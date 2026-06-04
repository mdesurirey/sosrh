import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY = 'https://connector-gateway.lovable.dev/hubspot';

interface LeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  score?: number;
  context?: Record<string, unknown>;
}

function authHeaders() {
  const lovable = Deno.env.get('LOVABLE_API_KEY');
  const hs = Deno.env.get('HUBSPOT_API_KEY');
  if (!lovable) throw new Error('LOVABLE_API_KEY missing');
  if (!hs) throw new Error('HUBSPOT_API_KEY missing');
  return {
    Authorization: `Bearer ${lovable}`,
    'X-Connection-Api-Key': hs,
    'Content-Type': 'application/json',
  };
}

function domainFromEmail(email: string): string | null {
  const at = email.lastIndexOf('@');
  if (at < 0) return null;
  const d = email.slice(at + 1).toLowerCase().trim();
  const generic = ['gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'hotmail.fr', 'outlook.com', 'outlook.fr', 'live.com', 'live.fr', 'icloud.com', 'free.fr', 'orange.fr', 'wanadoo.fr', 'sfr.fr', 'laposte.net', 'proton.me', 'protonmail.com'];
  if (!d || generic.includes(d)) return null;
  return d;
}

async function hsRequest(path: string, init: RequestInit) {
  const res = await fetch(`${GATEWAY}${path}`, { ...init, headers: { ...authHeaders(), ...(init.headers || {}) } });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }
  return { ok: res.ok, status: res.status, body: json ?? text };
}

async function findCompanyByDomain(domain: string) {
  const res = await hsRequest('/crm/v3/objects/companies/search', {
    method: 'POST',
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'domain', operator: 'EQ', value: domain }] }],
      properties: ['name', 'domain'],
      limit: 1,
    }),
  });
  if (res.ok && res.body?.results?.length) return res.body.results[0].id as string;
  return null;
}

async function createCompany(name: string, domain: string) {
  const res = await hsRequest('/crm/v3/objects/companies', {
    method: 'POST',
    body: JSON.stringify({ properties: { name, domain } }),
  });
  if (res.ok) return res.body.id as string;
  // 409 conflict -> try search
  if (res.status === 409) return await findCompanyByDomain(domain);
  console.error('createCompany failed', res.status, res.body);
  return null;
}

async function upsertContact(p: LeadPayload) {
  const properties: Record<string, string> = {
    email: p.email,
    firstname: p.firstName,
    lastname: p.lastName,
    company: p.company,
  };
  if (p.phone) properties.phone = p.phone;
  if (typeof p.score === 'number') properties.legipilot_score = String(p.score);

  // Try create
  const create = await hsRequest('/crm/v3/objects/contacts', {
    method: 'POST',
    body: JSON.stringify({ properties }),
  });
  if (create.ok) return create.body.id as string;

  // If conflict, lookup by email
  if (create.status === 409) {
    const lookup = await hsRequest(`/crm/v3/objects/contacts/${encodeURIComponent(p.email)}?idProperty=email`, { method: 'GET' });
    if (lookup.ok) {
      const id = lookup.body.id as string;
      await hsRequest(`/crm/v3/objects/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ properties }),
      });
      return id;
    }
  }
  console.error('upsertContact failed', create.status, create.body);
  throw new Error(`HubSpot contact error ${create.status}`);
}

async function associate(contactId: string, companyId: string) {
  await hsRequest(`/crm/v4/objects/contacts/${contactId}/associations/default/companies/${companyId}`, {
    method: 'PUT',
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const payload = (await req.json()) as LeadPayload;
    if (!payload?.email || !payload?.firstName || !payload?.lastName || !payload?.company) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const contactId = await upsertContact(payload);

    let companyId: string | null = null;
    const domain = domainFromEmail(payload.email);
    if (domain) {
      companyId = await findCompanyByDomain(domain);
      if (!companyId) companyId = await createCompany(payload.company, domain);
      if (companyId) {
        try { await associate(contactId, companyId); } catch (e) { console.error('associate failed', e); }
      }
    }

    return new Response(JSON.stringify({ ok: true, contactId, companyId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('hubspot-lead error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

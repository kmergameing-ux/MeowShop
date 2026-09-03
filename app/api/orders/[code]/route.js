export async function GET(req, {params}) {
  const base = process.env.KHMER_TOPUP_BASE_URL || 'https://khmer-topup.com/api/v1';
  const key = process.env.KHMER_TOPUP_API_KEY;
  if (!key) return Response.json({error:'Supplier API key is not configured'}, {status:500});

  const r = await fetch(`${base}/orders/${encodeURIComponent(params.code)}`, {
    headers:{Authorization:`Bearer ${key}`},
    cache:'no-store'
  });
  const data = await r.json();
  return Response.json(data, {status:r.status});
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.package_id || !body.player_id) {
      return Response.json(
        { error: 'package_id and player_id are required' },
        { status: 400 }
      );
    }

    const base =
      process.env.KHMER_TOPUP_BASE_URL ||
      'https://khmer-topup.com/api/v1';

    const key = process.env.KHMER_TOPUP_API_KEY;

    if (!key) {
      return Response.json(
        { error: 'Supplier API key is not configured' },
        { status: 500 }
      );
    }

    const payload = {
      package_id: body.package_id,
      player_id: String(body.player_id),
      ...(body.server_id
        ? { server_id: String(body.server_id) }
        : {}),
      ...(body.reference
        ? { reference: String(body.reference) }
        : {})
    };

    const r = await fetch(`${base}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    const text = await r.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        error: text || 'Supplier returned an empty response'
      };
    }

    console.log('SUPPLIER ORDER STATUS:', r.status);
    console.log('SUPPLIER ORDER RESPONSE:', data);

    return Response.json(
      {
        success: r.ok,
        supplier_status: r.status,
        ...data
      },
      { status: r.status }
    );
  } catch (error) {
    console.error('ORDER ERROR:', error);

    return Response.json(
      {
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}
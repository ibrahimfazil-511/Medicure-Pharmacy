import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'orderId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, customer_name, customer_email, total_amount, items, status, created_at')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: orderError?.message || 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!order.customer_email) {
      return new Response(JSON.stringify({ skipped: true, reason: 'Customer email was not provided' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: Deno.env.get('ORDER_EMAIL_FROM'),
        to: [order.customer_email],
        subject: `MediCure Pharmacy order confirmation #${order.id}`,
        html: buildEmailHtml(order)
      })
    });

    const resendResult = await resendResponse.json();
    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ error: resendResult }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ sent: true, emailId: resendResult.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function buildEmailHtml(order: any) {
  const cart = Array.isArray(order.items?.cart) ? order.items.cart : [];
  const shipping = order.items?.shipping || {};
  const itemRows = cart.map((item: any) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e5e7eb">${escapeHtml(item.name)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center">${escapeHtml(item.quantity)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right">Rs ${Number(item.price || 0).toFixed(2)}</td>
    </tr>`).join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#172033;max-width:620px;margin:auto">
      <h2 style="color:#087f78">Thank you for your order, ${escapeHtml(order.customer_name)}!</h2>
      <p>Your order has been received by MediCure Pharmacy.</p>
      <p><strong>Order ID:</strong> ${escapeHtml(order.id)}<br>
      <strong>Status:</strong> ${escapeHtml(order.status)}<br>
      <strong>Placed:</strong> ${escapeHtml(order.created_at)}</p>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">Medicine</th><th>Qty</th><th style="text-align:right">Price</th></tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p><strong>Total: Rs ${Number(order.total_amount || 0).toFixed(2)}</strong></p>
      <p><strong>Delivery address:</strong> ${escapeHtml(shipping.address)}, ${escapeHtml(shipping.city)}</p>
      <p>We will contact you regarding delivery. Thank you for choosing MediCure Pharmacy.</p>
    </div>`;
}

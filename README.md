<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c323555f-5b73-40e2-a0fb-27e82dc2bf6a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Order Confirmation Emails

The checkout already collects an optional customer email. After an order is saved, the app invokes the `send-order-email` Supabase Edge Function. The function reads the order and sends its details through Resend. Email failure does not cancel the saved order.

Deploy the function from the project root after installing the Supabase CLI and linking the project:

```bash
supabase functions deploy send-order-email
supabase secrets set RESEND_API_KEY=re_xxxxxxxxx
supabase secrets set ORDER_EMAIL_FROM="MediCure Pharmacy <orders@your-verified-domain.com>"
```

`ORDER_EMAIL_FROM` must use a sender domain verified in Resend. During testing, Resend's `onboarding@resend.dev` sender can only deliver to the Resend account email. Customers receive an email only when they enter a valid email at checkout.

## Supabase security setup

Apply `supabase/migrations/20261004000000_atomic_order_stock.sql` before accepting orders. Checkout uses the `place_order` RPC so stock deduction and order creation are atomic. The `track_order` RPC returns only the order matching the supplied tracking code and phone number.

Set `VITE_ADMIN_EMAIL` to the admin Auth user's email. In Supabase Auth, set that user's `app_metadata` role to `admin`; this role is required by the RLS policies for inventory and order management. The staff portal is intentionally available only at `/staff-gateway-786` and uses the Supabase session, not a browser `localStorage` flag.

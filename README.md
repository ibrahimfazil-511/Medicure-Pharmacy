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

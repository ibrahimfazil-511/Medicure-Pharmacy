# 📧 MediCure Pharmacy: Supabase Secrets & Resend Email Verification Setup

Yeh guide aapko step-by-step batati hai ke **Order Confirmation Emails** active karne ke liye Resend API key aur domain Supabase mein kaise configure karni hai.

---

## 🚀 Step 1: Resend Account & API Key Hasil Karein (Free)

1. [https://resend.com](https://resend.com) par jayein aur **Sign Up** karein (Free account mein 3,000 emails/month free milti hain).
2. Login karne ke baad left sidebar mein **API Keys** par click karein.
3. **Create API Key** button dabayein:
   - Name: `MediCure Supabase`
   - Permission: `Full access`
4. Generated key ko copy kar lein (yeh `re_` se shuru hoti hai, maslan: `re_123456789_abcdef`).

---

## 🛠️ Step 2: Supabase Secrets Set Karein (2 Aasan Tareeqay)

### Tareeqa A: Supabase Web Dashboard Se (Recommended - Koi CLI ya Terminal nahi chahiye)

1. Apne [Supabase Dashboard](https://supabase.com/dashboard) mein apna project open karein.
2. Left menu mein **Project Settings** (gear icon) par click karein.
3. Left sub-menu mein **Edge Functions** (ya **Secrets / Environment Variables**) par jayein.
4. **Add new secret** button par click kar ke do secrets add karein:

| Secret Name | Secret Value | Detail |
| :--- | :--- | :--- |
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` | Resend se copy ki hui aapki API key |
| `ORDER_EMAIL_FROM` | `MediCure Pharmacy <onboarding@resend.dev>` | Testing ke liye Resend ka default sender address |

> 💡 **Testing Note:** Testing ke waqt `onboarding@resend.dev` sirf usi email par confirmation bhejta hai jis email se aapka Resend account bana hua hai. Checkout form mein apna wohi email daal kar test karein!

---

### Tareeqa B: Supabase CLI Se (Agar Terminal use kar rahe hon)

Apne project ke root folder mein yeh commands run karein:

```bash
# 1. Supabase link karein (agar pehle nahi kiya)
supabase link --project-ref your-project-ref

# 2. Secrets set karein
supabase secrets set RESEND_API_KEY="re_xxxxxxxxxxxx"
supabase secrets set ORDER_EMAIL_FROM="MediCure Pharmacy <onboarding@resend.dev>"

# 3. Edge function deploy karein
supabase functions deploy send-order-email
```

---

## 🌐 Step 3: Custom Domain Verify Karna (Production Live ke liye)

Jab aap apni real business domain (e.g. `medicure.pk` ya `yourdomain.com`) se har customer ko email bhejna chahein:

1. Resend dashboard mein **Domains** ➔ **Add Domain** par click karein (maslan: `orders.medicure.pk`).
2. Resend aapko 3 DNS records (DKIM, SPF, MX) dega.
3. Apne domain registrar (Namecheap, GoDaddy, Cloudflare wagera) ke DNS records mein yeh values add kar dein.
4. Resend mein **Verify DNS** dabayein (yeh green ho jayega).
5. Supabase secrets mein `ORDER_EMAIL_FROM` ko update karein:
   ```text
   ORDER_EMAIL_FROM = MediCure Pharmacy <orders@yourdomain.com>
   ```

---

## 🧪 Step 4: Verification & Testing

1. Website par jayein aur Cart mein koi medicine add karein.
2. Checkout par apna woh email address enter karein jo Resend account mein registered hai.
3. Order place karein!
4. Resend dashboard ke **Emails** tab mein jayein — aapko delivered email, open rates aur timestamp nazar aa jayega.

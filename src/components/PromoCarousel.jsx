import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, HeartPulse, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import logoImg from '../assets/images/medicure_pharmacy_logo_1786426208570.jpg';

const promoStyles = `
.promo-wrap { padding: 1.5rem 1rem 2.5rem; background: linear-gradient(180deg, var(--clinic-mint), var(--clinic-canvas)); }
.promo-poster { position: relative; isolation: isolate; overflow: hidden; min-height: 440px; max-width: 1180px; margin: 0 auto; border: 1px solid var(--clinic-line); border-radius: 1.25rem; background: linear-gradient(115deg, #fff 0%, #f5fbf9 45%, #d7efe9 100%); box-shadow: var(--clinic-shadow-hover); animation: promo-reveal 0.55s ease both; }
.promo-poster::before { content: ''; position: absolute; right: -170px; top: -170px; z-index: -1; width: 540px; height: 540px; border-radius: 50%; background: radial-gradient(circle, rgba(8, 127, 120, 0.18), transparent 65%); }
.promo-poster-wellness { background: linear-gradient(115deg, #fff 0%, #f7fbf4 45%, #e8f1d7 100%); }
.promo-poster-prescription { background: linear-gradient(115deg, #fff 0%, #f5f9fc 45%, #dcecf8 100%); }
.promo-copy { position: relative; z-index: 2; max-width: 62%; padding: 2.8rem 3.5rem 3.7rem; }
.promo-brand-mark { display: inline-flex; align-items: center; max-width: 100%; color: var(--clinic-ink); font-size: 1.15rem; font-weight: 900; letter-spacing: -0.03em; white-space: nowrap; }
.promo-brand-mark img { flex: 0 0 auto; width: 2.2rem; height: 2.2rem; margin-right: 0.55rem; border: 1px solid var(--clinic-line); border-radius: 0.65rem; object-fit: cover; }
.promo-brand-mark > span span { color: var(--clinic-teal); }
.promo-brand-mark b { align-self: flex-end; margin: 0 0 0.05rem 0.5rem; color: var(--clinic-teal); font-size: 0.52rem; letter-spacing: 0.16em; }
.promo-eyebrow { margin: 1.8rem 0 0.55rem; color: var(--clinic-teal); font-size: 0.72rem; font-weight: 900; letter-spacing: 0.2em; }
.promo-copy h1 { margin: 0 0 1rem; color: var(--clinic-ink); font-size: clamp(2.1rem, 4vw, 3.55rem); line-height: 1.05; letter-spacing: -0.04em; }
.promo-copy h1 strong { color: var(--clinic-teal); font-weight: 950; }
.promo-description { max-width: 32rem; margin: 0 0 0.9rem; color: var(--clinic-muted); font-size: 0.92rem; line-height: 1.5; }
.promo-benefits { display: flex; flex-wrap: wrap; gap: 0.55rem 1.1rem; margin: 0.9rem 0; color: var(--clinic-ink); font-size: 0.75rem; font-weight: 800; }
.promo-benefits span, .promo-contact { display: inline-flex; align-items: center; gap: 0.35rem; }
.promo-benefits svg, .promo-contact svg { color: var(--clinic-teal); }
.promo-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 0.7rem 1rem; margin-top: 0.65rem; }
.promo-cta { display: inline-flex; align-items: center; gap: 0.7rem; padding: 0.75rem 1.2rem; border: 0; border-radius: 999px; background: var(--clinic-teal); color: #fff; font-size: 0.78rem; font-weight: 900; letter-spacing: 0.04em; white-space: nowrap; box-shadow: 0 10px 22px rgba(8, 127, 120, 0.25); cursor: pointer; transition: 0.2s ease; }
.promo-cta:hover { background: var(--clinic-teal-dark); transform: translateY(-2px); }
.promo-contact { margin: 0; color: var(--clinic-muted); font-size: 0.76rem; white-space: nowrap; }
.promo-contact a { display: inline-flex; align-items: center; gap: 0.25rem; color: inherit; text-decoration: none; }
.promo-contact a:hover { color: var(--clinic-teal); }
.promo-contact b { color: var(--clinic-ink); }
.promo-art { position: absolute; right: 0; bottom: 0; z-index: 1; width: 43%; height: 100%; }
.promo-art-heading { position: absolute; top: 2.2rem; right: 2.8rem; color: var(--clinic-teal-dark); font-size: 0.82rem; font-weight: 900; }
.promo-art-detail { position: absolute; top: 3.7rem; right: 2.8rem; color: var(--clinic-muted); font-size: 0.68rem; }
.promo-orbit { position: absolute; border: 2px solid rgba(8, 127, 120, 0.2); border-radius: 50%; transform: rotate(26deg); }
.promo-orbit-one { width: 16rem; height: 8rem; right: 9%; bottom: 18%; }
.promo-orbit-two { width: 22rem; height: 10rem; right: -4%; bottom: 6%; }
.promo-cross { position: absolute; right: 14%; top: 28%; color: var(--clinic-teal); font-size: 3.5rem; font-weight: 300; }
.promo-pill { position: absolute; width: 7.5rem; height: 3rem; border-radius: 3rem; box-shadow: 0 12px 20px rgba(18,48,71,0.13); transform: rotate(-28deg); }
.promo-pill-one { right: 30%; bottom: 31%; background: linear-gradient(90deg, var(--clinic-teal) 50%, #fff 50%); }
.promo-pill-two { right: 5%; bottom: 48%; background: linear-gradient(90deg, var(--clinic-teal-dark) 50%, var(--clinic-mint) 50%); transform: rotate(26deg) scale(0.7); }
.promo-heart { position: absolute; right: 17%; bottom: 18%; display: grid; width: 8rem; height: 8rem; place-items: center; border-radius: 2rem; background: rgba(255,255,255,0.8); color: var(--clinic-teal); box-shadow: var(--clinic-shadow); transform: rotate(-8deg); }
.promo-wellness-card, .promo-rx-card { position: absolute; right: 10%; bottom: 14%; display: flex; flex-direction: column; justify-content: center; width: 14rem; min-height: 12rem; padding: 1.25rem; border: 1px solid var(--clinic-line); border-radius: 1rem; background: rgba(255,255,255,0.9); color: var(--clinic-teal); box-shadow: var(--clinic-shadow-hover); transform: rotate(5deg); }
.promo-wellness-card strong { margin-top: 0.7rem; color: var(--clinic-ink); font-size: 1.6rem; line-height: 1; }
.promo-wellness-card span { margin-top: 0.6rem; color: var(--clinic-muted); font-size: 0.7rem; font-weight: 700; }
.promo-rx-card { flex-direction: row; flex-wrap: wrap; align-items: flex-start; gap: 0.7rem; transform: rotate(-5deg); }
.promo-rx-card strong { color: var(--clinic-ink); font-size: 1rem; line-height: 1.1; }
.promo-rx-card span { display: flex; align-items: center; gap: 0.25rem; margin-top: 0.8rem; color: var(--clinic-teal); font-size: 0.68rem; font-weight: 800; }
.promo-rx-line { width: 100%; height: 0.45rem; border-radius: 1rem; background: var(--clinic-mint); }
.promo-rx-line.short { width: 65%; }
.promo-arrow { position: absolute; top: 50%; z-index: 4; display: grid; width: 2.6rem; height: 2.6rem; place-items: center; border: 1px solid var(--clinic-line); border-radius: 50%; background: #fff; color: var(--clinic-ink); box-shadow: 0 5px 14px rgba(18,48,71,0.1); cursor: pointer; transform: translateY(-50%); }
.promo-arrow:hover { color: var(--clinic-teal); }
.promo-arrow-left { left: 1rem; }
.promo-arrow-right { right: 1rem; }
.promo-dots { position: absolute; bottom: 1rem; left: 50%; z-index: 4; display: flex; gap: 0.45rem; transform: translateX(-50%); }
.promo-dots button { width: 0.5rem; height: 0.5rem; padding: 0; border: 0; border-radius: 50%; background: #9bcfcb; cursor: pointer; transition: 0.2s ease; }
.promo-dots button.active { width: 1.4rem; border-radius: 1rem; background: var(--clinic-teal); }
@keyframes promo-reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 700px) {
  .promo-wrap { padding: 0.8rem 0.75rem 1.7rem; }
  .promo-poster { min-height: 570px; }
  .promo-copy { max-width: 100%; padding: 1.8rem 1.35rem 0; }
  .promo-brand-mark { font-size: 1rem; }
  .promo-eyebrow { margin-top: 1.25rem; font-size: 0.63rem; }
  .promo-copy h1 { font-size: 2.25rem; }
  .promo-description { max-width: 20rem; font-size: 0.82rem; }
  .promo-benefits { max-width: 20rem; }
  .promo-art { width: 100%; height: 45%; }
  .promo-art-heading { top: 0.6rem; right: 1.2rem; font-size: 0.75rem; }
  .promo-art-detail { top: 1.8rem; right: 1.2rem; font-size: 0.6rem; }
  .promo-heart { right: 18%; bottom: 12%; width: 6rem; height: 6rem; }
  .promo-pill-one { right: 35%; bottom: 27%; transform: rotate(-28deg) scale(0.7); }
  .promo-pill-two { right: 3%; bottom: 44%; }
  .promo-wellness-card, .promo-rx-card { right: 11%; bottom: 6%; width: 12rem; min-height: 9rem; }
}
`;

const slides = [
  { eyebrow: 'MediCure Pharmacy', title: 'Genuine medicines', accent: 'at your doorstep', body: 'Verified products, careful packing, and dependable delivery for your family.', icon: ShieldCheck, art: 'capsules', label: '12-hour delivery', detail: 'From our pharmacy to your door' },
  { eyebrow: 'Save on every order', title: 'Better care,', accent: 'better value', body: 'Shop trusted pharmacy essentials and keep your wellness routine on track.', icon: HeartPulse, art: 'wellness', label: 'Wellness essentials', detail: 'Everyday care, trusted by families' },
  { eyebrow: 'Easy prescription service', title: 'Upload your Rx,', accent: 'we handle the rest', body: 'Send your prescription to our team for quick review by a qualified pharmacist.', icon: FileText, art: 'prescription', label: 'Pharmacist verified', detail: 'Quick review before dispatch' },
];

export default function PromoCarousel({ onOrderNow }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[activeSlide];
  const SlideIcon = slide.icon;
  const showSlide = (index) => setActiveSlide((index + slides.length) % slides.length);

  return (
    <section className="promo-wrap" aria-label="MediCure Pharmacy promotions">
      <div className={`promo-poster promo-poster-${slide.art}`}>
        <div className="promo-copy">
          <div className="promo-brand-mark"><img src={logoImg} alt="MediCure Pharmacy" /><span>Medi<span>Cure</span></span><b>PHARMACY</b></div>
          <p className="promo-eyebrow">{slide.eyebrow}</p>
          <h1>{slide.title}<br /><strong>{slide.accent}</strong></h1>
          <p className="promo-description">{slide.body}</p>
          <div className="promo-benefits"><span><SlideIcon size={16} /> Authentic products</span><span><Truck size={16} /> Fast local delivery</span></div>
          <div className="promo-actions">
            <button type="button" className="promo-cta" onClick={onOrderNow}><span>Order Now</span><ArrowRight size={17} /></button>
            <p className="promo-contact"><a href="https://wa.me/923342850819?text=Hello%20MediCure%20Pharmacy%2C%20I%20want%20to%20place%20an%20order." target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp: <b>+92 334 2850819</b></a></p>
          </div>
        </div>
        <div className="promo-art" aria-hidden="true">
          <div className="promo-art-heading">{slide.label}</div>
          <div className="promo-art-detail">{slide.detail}</div>
          {slide.art === 'capsules' && <><div className="promo-orbit promo-orbit-one" /><div className="promo-orbit promo-orbit-two" /><div className="promo-cross">+</div><div className="promo-pill promo-pill-one" /><div className="promo-pill promo-pill-two" /><div className="promo-heart"><HeartPulse size={72} strokeWidth={1.4} /></div></>}
          {slide.art === 'wellness' && <div className="promo-wellness-card"><HeartPulse size={62} /><strong>Daily<br />wellness</strong><span>Care that fits your routine</span></div>}
          {slide.art === 'prescription' && <div className="promo-rx-card"><FileText size={38} /><div><strong>Prescription<br />received</strong><span><ShieldCheck size={14} /> Ready for review</span></div><div className="promo-rx-line" /><div className="promo-rx-line short" /></div>}
        </div>
        <button type="button" className="promo-arrow promo-arrow-left" onClick={() => showSlide(activeSlide - 1)} aria-label="Previous promotion"><ChevronLeft size={22} /></button>
        <button type="button" className="promo-arrow promo-arrow-right" onClick={() => showSlide(activeSlide + 1)} aria-label="Next promotion"><ChevronRight size={22} /></button>
        <div className="promo-dots" role="tablist" aria-label="Choose promotion">{slides.map((item, index) => <button key={item.art} type="button" className={index === activeSlide ? 'active' : ''} onClick={() => showSlide(index)} aria-label={`Promotion ${index + 1}`} aria-selected={index === activeSlide} role="tab" />)}</div>
      </div>
      <style>{promoStyles}</style>
    </section>
  );
}   

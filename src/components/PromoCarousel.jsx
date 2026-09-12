import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, HeartPulse, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import logoImg from '../assets/images/medicure_pharmacy_logo_1786426208570.jpg';

const promoStyles = `
.promo-wrap { 
  padding: 1rem 0.75rem 2rem; 
  background: linear-gradient(180deg, var(--clinic-mint), var(--clinic-canvas)); 
}
@media (min-width: 640px) {
  .promo-wrap { padding: 1.5rem 1rem 2.5rem; }
}
.promo-poster { 
  position: relative; 
  isolation: isolate; 
  overflow: hidden; 
  min-height: 380px; 
  max-width: 1180px; 
  margin: 0 auto; 
  border: 1px solid var(--clinic-line); 
  border-radius: 1.25rem; 
  background: linear-gradient(115deg, #fff 0%, #f5fbf9 45%, #d7efe9 100%); 
  box-shadow: var(--clinic-shadow-hover); 
  animation: promo-reveal 0.55s ease both; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
@media (min-width: 768px) {
  .promo-poster { min-height: 420px; flex-direction: row; align-items: center; }
}
.promo-poster::before { 
  content: ''; 
  position: absolute; 
  right: -170px; 
  top: -170px; 
  z-index: -1; 
  width: 540px; 
  height: 540px; 
  border-radius: 50%; 
  background: radial-gradient(circle, rgba(8, 127, 120, 0.18), transparent 65%); 
}
.promo-poster-wellness { background: linear-gradient(115deg, #fff 0%, #f7fbf4 45%, #e8f1d7 100%); }
.promo-poster-prescription { background: linear-gradient(115deg, #fff 0%, #f5f9fc 45%, #dcecf8 100%); }

.promo-copy { 
  position: relative; 
  z-index: 3; 
  width: 100%; 
  padding: 1.75rem 1.25rem 1rem; 
}
@media (min-width: 768px) {
  .promo-copy { 
    width: 60%; 
    padding: 2.5rem 2rem 3rem 2.5rem; 
  }
}
@media (min-width: 1024px) {
  .promo-copy { 
    width: 58%; 
    padding: 2.8rem 3.5rem 3.5rem; 
  }
}

.promo-brand-mark { 
  display: inline-flex; 
  align-items: center; 
  max-width: 100%; 
  color: var(--clinic-ink); 
  font-size: 1rem; 
  font-weight: 900; 
  letter-spacing: -0.03em; 
  white-space: nowrap; 
}
@media (min-width: 640px) {
  .promo-brand-mark { font-size: 1.15rem; }
}
.promo-brand-mark img { 
  flex: 0 0 auto; 
  width: 2rem; 
  height: 2rem; 
  margin-right: 0.5rem; 
  border: 1px solid var(--clinic-line); 
  border-radius: 0.65rem; 
  object-fit: cover; 
}
.promo-brand-mark > span span { color: var(--clinic-teal); }
.promo-brand-mark b { 
  align-self: flex-end; 
  margin: 0 0 0.05rem 0.4rem; 
  color: var(--clinic-teal); 
  font-size: 0.5rem; 
  letter-spacing: 0.16em; 
}

.promo-eyebrow { 
  margin: 1rem 0 0.4rem; 
  color: var(--clinic-teal); 
  font-size: 0.68rem; 
  font-weight: 900; 
  letter-spacing: 0.18em; 
  text-transform: uppercase;
}
@media (min-width: 640px) {
  .promo-eyebrow { margin: 1.5rem 0 0.55rem; font-size: 0.72rem; }
}

.promo-copy h1 { 
  margin: 0 0 0.75rem; 
  color: var(--clinic-ink); 
  font-size: clamp(1.7rem, 4.5vw, 3.2rem); 
  line-height: 1.08; 
  letter-spacing: -0.04em; 
}
.promo-copy h1 strong { color: var(--clinic-teal); font-weight: 950; }

.promo-description { 
  max-width: 30rem; 
  margin: 0 0 0.8rem; 
  color: var(--clinic-muted); 
  font-size: 0.82rem; 
  line-height: 1.45; 
}
@media (min-width: 640px) {
  .promo-description { font-size: 0.92rem; line-height: 1.5; }
}

.promo-benefits { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 0.5rem 1rem; 
  margin: 0.75rem 0; 
  color: var(--clinic-ink); 
  font-size: 0.72rem; 
  font-weight: 800; 
}
@media (min-width: 640px) {
  .promo-benefits { font-size: 0.75rem; }
}
.promo-benefits span { display: inline-flex; align-items: center; gap: 0.35rem; }
.promo-benefits svg { color: var(--clinic-teal); }

.promo-actions { 
  display: flex; 
  align-items: center; 
  flex-wrap: wrap; 
  gap: 0.7rem 1rem; 
  margin-top: 0.65rem; 
}
.promo-cta { 
  display: inline-flex; 
  align-items: center; 
  gap: 0.6rem; 
  padding: 0.7rem 1.25rem; 
  border: 0; 
  border-radius: 999px; 
  background: var(--clinic-teal); 
  color: #fff; 
  font-size: 0.78rem; 
  font-weight: 900; 
  letter-spacing: 0.04em; 
  white-space: nowrap; 
  box-shadow: 0 8px 18px rgba(8, 127, 120, 0.25); 
  cursor: pointer; 
  transition: 0.2s ease; 
}
.promo-cta:hover { background: var(--clinic-teal-dark); transform: translateY(-2px); }

/* Floating WhatsApp Button - Responsive & Clean */
.promo-contact { 
  position: fixed; 
  right: 1rem; 
  bottom: 1.25rem; 
  z-index: 45; 
  display: inline-flex; 
  align-items: center; 
  padding: 0.65rem 0.9rem; 
  border: 1px solid rgba(37, 211, 102, 0.35); 
  border-radius: 999px; 
  background: #ffffff; 
  color: #128c7e; 
  box-shadow: 0 8px 24px rgba(18, 48, 71, 0.2); 
  animation: promo-contact-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both, promo-contact-float 3.5s ease-in-out 0.7s infinite; 
  transition: transform 0.2s ease, box-shadow 0.2s ease; 
}
@media (min-width: 640px) {
  .promo-contact { right: 1.5rem; bottom: 1.5rem; padding: 0.7rem 1.1rem; }
}
.promo-contact::before { 
  content: ''; 
  position: absolute; 
  inset: -0.25rem; 
  z-index: -1; 
  border: 1px solid rgba(37, 211, 102, 0.25); 
  border-radius: inherit; 
  animation: promo-contact-pulse 2.8s ease-out 1s infinite; 
}
.promo-contact a { 
  display: inline-flex; 
  align-items: center; 
  gap: 0.45rem; 
  color: inherit; 
  font-size: 0.75rem; 
  font-weight: 900; 
  letter-spacing: 0.01em; 
  text-decoration: none; 
}
@media (min-width: 640px) {
  .promo-contact a { font-size: 0.8rem; }
}
.promo-contact a:hover { color: var(--clinic-teal); }
.promo-contact:hover { 
  animation-play-state: paused; 
  transform: translateY(-3px) scale(1.02); 
  box-shadow: 0 12px 28px rgba(18, 48, 71, 0.25); 
}
.promo-contact svg { flex: 0 0 auto; color: #25d366; }
.promo-contact b { 
  position: absolute; 
  width: 1px; 
  height: 1px; 
  padding: 0; 
  margin: -1px; 
  overflow: hidden; 
  clip: rect(0, 0, 0, 0); 
  white-space: nowrap; 
  border: 0; 
}

/* Graphics / Visual Artwork */
.promo-art { 
  position: relative; 
  width: 100%; 
  height: 180px; 
  overflow: hidden;
  z-index: 1;
}
@media (min-width: 768px) {
  .promo-art { 
    position: absolute; 
    right: 0; 
    bottom: 0; 
    width: 40%; 
    height: 100%; 
    overflow: visible;
  }
}
@media (min-width: 1024px) {
  .promo-art { width: 42%; }
}

.promo-art-heading { 
  position: absolute; 
  top: 1rem; 
  right: 1.5rem; 
  color: var(--clinic-teal-dark); 
  font-size: 0.75rem; 
  font-weight: 900; 
}
@media (min-width: 768px) {
  .promo-art-heading { top: 2.2rem; right: 2.5rem; font-size: 0.82rem; }
}
.promo-art-detail { 
  position: absolute; 
  top: 2.2rem; 
  right: 1.5rem; 
  color: var(--clinic-muted); 
  font-size: 0.65rem; 
}
@media (min-width: 768px) {
  .promo-art-detail { top: 3.7rem; right: 2.5rem; font-size: 0.68rem; }
}

.promo-orbit { position: absolute; border: 2px solid rgba(8, 127, 120, 0.18); border-radius: 50%; transform: rotate(26deg); }
.promo-orbit-one { width: 14rem; height: 7rem; right: 8%; bottom: 18%; }
.promo-orbit-two { width: 19rem; height: 9rem; right: -4%; bottom: 6%; }
.promo-cross { position: absolute; right: 14%; top: 28%; color: var(--clinic-teal); font-size: 3rem; font-weight: 300; opacity: 0.7; }
.promo-pill { position: absolute; width: 6.5rem; height: 2.6rem; border-radius: 3rem; box-shadow: 0 10px 18px rgba(18,48,71,0.12); transform: rotate(-28deg); }
.promo-pill-one { right: 28%; bottom: 28%; background: linear-gradient(90deg, var(--clinic-teal) 50%, #fff 50%); }
.promo-pill-two { right: 5%; bottom: 44%; background: linear-gradient(90deg, var(--clinic-teal-dark) 50%, var(--clinic-mint) 50%); transform: rotate(26deg) scale(0.7); }
.promo-heart { position: absolute; right: 15%; bottom: 16%; display: grid; width: 6.5rem; height: 6.5rem; place-items: center; border-radius: 1.75rem; background: rgba(255,255,255,0.85); color: var(--clinic-teal); box-shadow: var(--clinic-shadow); transform: rotate(-8deg); }

.promo-wellness-card, .promo-rx-card { 
  position: absolute; 
  right: 8%; 
  bottom: 12%; 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  width: 12.5rem; 
  min-height: 10rem; 
  padding: 1.1rem; 
  border: 1px solid var(--clinic-line); 
  border-radius: 1rem; 
  background: rgba(255,255,255,0.92); 
  color: var(--clinic-teal); 
  box-shadow: var(--clinic-shadow-hover); 
  transform: rotate(4deg); 
}
.promo-wellness-card strong { margin-top: 0.6rem; color: var(--clinic-ink); font-size: 1.4rem; line-height: 1; }
.promo-wellness-card span { margin-top: 0.5rem; color: var(--clinic-muted); font-size: 0.68rem; font-weight: 700; }
.promo-rx-card { flex-direction: row; flex-wrap: wrap; align-items: flex-start; gap: 0.6rem; transform: rotate(-4deg); }
.promo-rx-card strong { color: var(--clinic-ink); font-size: 0.95rem; line-height: 1.1; }
.promo-rx-card span { display: flex; align-items: center; gap: 0.25rem; margin-top: 0.6rem; color: var(--clinic-teal); font-size: 0.65rem; font-weight: 800; }
.promo-rx-line { width: 100%; height: 0.4rem; border-radius: 1rem; background: var(--clinic-mint); }
.promo-rx-line.short { width: 65%; }

/* Arrows & Navigation */
.promo-arrow { 
  position: absolute; 
  top: 50%; 
  z-index: 4; 
  display: none; 
  width: 2.4rem; 
  height: 2.4rem; 
  place-items: center; 
  border: 1px solid var(--clinic-line); 
  border-radius: 50%; 
  background: #fff; 
  color: var(--clinic-ink); 
  box-shadow: 0 4px 12px rgba(18,48,71,0.1); 
  cursor: pointer; 
  transform: translateY(-50%); 
  transition: 0.2s ease;
}
@media (min-width: 768px) {
  .promo-arrow { display: grid; }
}
.promo-arrow:hover { color: var(--clinic-teal); transform: translateY(-50%) scale(1.05); }
.promo-arrow-left { left: 0.75rem; }
.promo-arrow-right { right: 0.75rem; }

.promo-dots { 
  position: absolute; 
  bottom: 0.75rem; 
  left: 50%; 
  z-index: 4; 
  display: flex; 
  gap: 0.45rem; 
  transform: translateX(-50%); 
}
@media (min-width: 640px) {
  .promo-dots { bottom: 1rem; }
}
.promo-dots button { 
  width: 0.45rem; 
  height: 0.45rem; 
  padding: 0; 
  border: 0; 
  border-radius: 50%; 
  background: #9bcfcb; 
  cursor: pointer; 
  transition: 0.2s ease; 
}
.promo-dots button.active { width: 1.3rem; border-radius: 1rem; background: var(--clinic-teal); }

@keyframes promo-reveal { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes promo-contact-in { from { opacity: 0; transform: translateX(1rem) scale(0.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes promo-contact-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes promo-contact-pulse { 0% { opacity: 0.7; transform: scale(0.96); } 75%, 100% { opacity: 0; transform: scale(1.16); } }
@media (prefers-reduced-motion: reduce) {
  .promo-contact, .promo-contact::before { animation: none; }
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
      {/* <p className="promo-contact"><a href="https://wa.me/923342850819?text=Hello%20MediCure%20Pharmacy%2C%20I%20want%20to%20place%20an%20order." target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"><FaWhatsapp size={25} /><span>WhatsApp</span><b>+92 334 2850819</b></a></p> */}
      <style>{promoStyles}</style>
    </section>
  );
}   

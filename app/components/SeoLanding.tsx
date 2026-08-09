import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Check, ShieldCheck, Sparkles } from "lucide-react";
import styles from "../seo-pages.module.css";

type FAQ = { question: string; answer: string };

type SeoLandingProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  bullets: string[];
  sections: { title: string; text: string }[];
  faqs: FAQ[];
};

const registerUrl = "https://app.krypnova.com/register";

export default function SeoLanding({ eyebrow, title, highlight, description, bullets, sections, faqs }: SeoLandingProps) {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          <Image src="/krypnova-logo.jpeg" alt="Krypnova" width={42} height={42} priority />
          <span>KRYPNOVA</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/markets">Live Markets</Link>
          <a href={registerUrl} className={styles.smallCta}>Start Free Beta</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.badge}><Sparkles size={16} /> {eyebrow}</div>
        <h1>{title} <span>{highlight}</span></h1>
        <p className={styles.lead}>{description}</p>
        <div className={styles.actions}>
          <a href={registerUrl} className={styles.primary}>Start Free Beta <ArrowRight size={18} /></a>
          <Link href="/markets" className={styles.secondary}>View Live Markets</Link>
        </div>
        <div className={styles.bullets}>
          {bullets.map((item) => <span key={item}><Check size={16} /> {item}</span>)}
        </div>
      </section>

      <section className={styles.grid}>
        {sections.map((section, index) => (
          <article key={section.title}>
            <div className={styles.icon}>{index % 2 === 0 ? <BrainCircuit size={26} /> : <ShieldCheck size={26} />}</div>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.faq}>
        <p className={styles.eyebrow}>Frequently Asked Questions</p>
        <h2>Understand Krypnova before you use it.</h2>
        <div className={styles.faqGrid}>
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <p className={styles.eyebrow}>Exion AI inside Krypnova</p>
          <h2>Turn market noise into clearer decisions.</h2>
          <p>Analyze opportunities, understand risk and review market context from one intelligent platform.</p>
        </div>
        <a href={registerUrl} className={styles.primary}>Start Free Beta <ArrowRight size={18} /></a>
      </section>

      <footer className={styles.footer}>
        <span>© 2026 Krypnova. Trading and investing involve risk. Krypnova does not provide financial advice.</span>
        <Link href="/">Home</Link>
      </footer>
    </main>
  );
}

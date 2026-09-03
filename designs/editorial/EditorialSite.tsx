import React from 'react';
import { ArrowUpRight, ArrowLeft, ArrowDown } from 'lucide-react';
import { PROFILE, WORKS_DATA, NEWS_DATA, SKILLS } from '../../constants';
import { useReveal } from '../../components/useReveal';
import type { SiteProps } from '../../App';

/**
 * C. Editorial — 明朝 × 余白 × 大型タイポ
 * 参考: Awwwards 常連のデザインスタジオ / 日本のクリエイティブエージェンシーのサイト。
 * クリーム色の紙のような背景に、明朝体の巨大な見出しと極細の罫線。マーキー、番号付きリスト、画像はゆっくりズーム。
 */
const Section: React.FC<{ id: string; label: string; count?: string; children: React.ReactNode }> = ({ id, label, count, children }) => (
  <section id={id} className="border-t border-stone-900/15">
    <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-12 gap-10">
      <div className="md:col-span-3 reveal">
        <div className="sticky top-28 flex items-baseline gap-3">
          <span className="font-serif italic text-2xl">{label}</span>
          {count && <span className="font-mono text-[11px] text-stone-500">({count})</span>}
        </div>
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  </section>
);

const EditorialSite: React.FC<SiteProps> = ({ selectedNewsId, onSelectNews }) => {
  useReveal([selectedNewsId]);
  const news = selectedNewsId ? NEWS_DATA.find((n) => n.id === selectedNewsId) : null;
  const marquee = ['Game', 'XR', 'Unity', 'Simulator', 'VR Booth', 'Automation', 'Web', 'AI'];

  return (
    <div className="grain min-h-screen bg-[#eeefec] text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-[#eeefec]">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 mix-blend-difference text-[#eeefec]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
          <button onClick={() => onSelectNews(null)} className="font-mincho font-bold text-xl tracking-wide">M Lab</button>
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase">
            {['about', 'works', 'news', 'contact'].map((s) => (
              <a key={s} href={`#${s}`} onClick={() => onSelectNews(null)} className="link-underline">{s}</a>
            ))}
          </nav>
          <a href={`mailto:${PROFILE.social.email}`} className="text-xs tracking-[0.2em] uppercase link-underline">Email</a>
        </div>
      </header>

      <main className="relative z-[2]">
        {news ? (
          /* ---------- News Detail ---------- */
          <article className="mx-auto max-w-3xl px-6 pt-36 pb-24">
            <button onClick={() => onSelectNews(null)} className="group inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-stone-900 mb-12">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back
            </button>
            <div className="flex items-center gap-4 font-mono text-xs text-stone-500 mb-6">
              <time>{news.date}</time>
              {news.tag && <span className="border border-stone-900/30 rounded-full px-2 py-0.5 tracking-widest uppercase text-[10px]">{news.tag}</span>}
            </div>
            <h1 className="font-mincho text-3xl md:text-5xl font-bold leading-[1.3] tracking-tight mb-12">{news.title}</h1>
            {news.thumbnail && (
              <div className="aspect-video overflow-hidden bg-stone-200 mb-12">
                <img src={news.thumbnail} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="news-body text-stone-700 text-[17px] [&_h3]:font-mincho [&_h3]:text-stone-900" dangerouslySetInnerHTML={{ __html: news.content ?? '' }} />
            {news.url && (
              <a href={news.url} target="_blank" rel="noopener noreferrer" className="mt-12 inline-flex items-center gap-2 text-sm link-underline">
                イベントページを見る <ArrowUpRight size={14} />
              </a>
            )}
          </article>
        ) : (
          <>
            {/* ---------- Hero ---------- */}
            <section className="min-h-screen flex flex-col justify-end mx-auto max-w-7xl px-6 md:px-10 pt-32 pb-12">
              <div className="grid md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                  <p className="reveal font-mono text-xs tracking-[0.2em] uppercase text-stone-500 mb-6">
                    {PROFILE.englishName} — {PROFILE.role}
                  </p>
                  <h1 className="reveal reveal-delay-1 font-mincho font-bold text-[clamp(3.2rem,11vw,8.5rem)] leading-[1.02] tracking-[-0.03em] whitespace-nowrap">
                    ワクワクを、<br />
                    <span className="outline-text">実装する。</span>
                  </h1>
                </div>
                <div className="md:col-span-4 reveal reveal-delay-2">
                  <p className="text-stone-600 leading-[1.9] text-[15px]">
                    Unity・XR を軸に、ゲーム、シミュレータ、VR 空間、開発自動化ツールまで。設計から実装までをひとりで完走する、札幌のゲーム / XR デベロッパー。
                  </p>
                  <a href="#about" className="mt-8 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase link-underline">
                    Scroll <ArrowDown size={12} />
                  </a>
                </div>
              </div>
            </section>

            {/* Marquee */}
            <div className="border-y border-stone-900/15 py-4 overflow-hidden">
              <div className="marquee font-serif italic text-3xl md:text-5xl text-stone-900/80">
                {[...marquee, ...marquee].map((w, i) => (
                  <span key={i} className="px-8 whitespace-nowrap">{w} <span className="text-stone-400 not-italic">✦</span></span>
                ))}
              </div>
            </div>

            {/* ---------- About ---------- */}
            <Section id="about" label="About">
              <div className="grid md:grid-cols-12 gap-10">
                <div className="md:col-span-7">
                  <h2 className="reveal font-mincho text-3xl md:text-4xl font-bold leading-[1.4] tracking-tight mb-8">
                    設計から実装まで、<br />ひとりで完走する。
                  </h2>
                  <p className="reveal reveal-delay-1 text-stone-700 leading-[2]">{PROFILE.bio}</p>
                  <p className="reveal reveal-delay-2 text-stone-500 leading-[2] mt-4 text-sm">
                    {PROFILE.university} / {PROFILE.affiliation}。将来の目標は、AAA 級のゲームスタジオを立ち上げること。
                  </p>
                </div>
                <div className="md:col-span-5 reveal reveal-delay-2">
                  <div className="aspect-[4/5] overflow-hidden bg-stone-200 group">
                    <img src={PROFILE.heroImage} alt="Nラボの日常" className="h-full w-full object-cover grayscale contrast-110 transition-transform duration-[1.5s] group-hover:scale-105" />
                  </div>
                  <div className="font-mono text-[10px] tracking-widest text-stone-500 mt-2">写真：Nラボの日常の風景</div>
                </div>
              </div>
              <dl className="mt-16 grid sm:grid-cols-2 gap-x-10">
                {SKILLS.map((s) => (
                  <div key={s.group} className="reveal border-t border-stone-900/15 py-5 grid grid-cols-[6rem_1fr] gap-4">
                    <dt className="font-mono text-[11px] tracking-[0.2em] uppercase text-stone-500 pt-1">{s.group}</dt>
                    <dd className="text-sm leading-relaxed">{s.items.join(' / ')}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            {/* ---------- Works ---------- */}
            <Section id="works" label="Works" count={String(WORKS_DATA.length).padStart(2, '0')}>
              <ul>
                {WORKS_DATA.map((w, i) => (
                  <li key={w.id} className="reveal border-t border-stone-900/15 last:border-b">
                    <a href={w.url ?? '#works'} target={w.url ? '_blank' : undefined} rel="noopener noreferrer" className="group grid md:grid-cols-12 gap-6 py-10 items-start">
                      <span className="md:col-span-1 font-mono text-xs text-stone-500 pt-2">{String(i + 1).padStart(2, '0')}</span>
                      <div className="md:col-span-5 md:order-none order-2">
                        <h3 className="font-mincho text-2xl md:text-3xl font-bold tracking-tight leading-snug flex items-start gap-2">
                          {w.title}
                          <ArrowUpRight size={20} className="mt-1.5 shrink-0 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                        </h3>
                        <p className="text-sm text-stone-600 leading-[1.9] mt-4">{w.description}</p>
                        <p className="font-mono text-[11px] tracking-wider text-stone-500 mt-5">{w.category} · {w.year} · {w.techStack.join(' / ')}</p>
                      </div>
                      <div className="md:col-span-6 aspect-[16/10] overflow-hidden bg-stone-200 order-1 md:order-none">
                        <img src={w.image} alt={w.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>

            {/* ---------- News ---------- */}
            <Section id="news" label="News">
              <ul>
                {NEWS_DATA.map((n) => (
                  <li key={n.id} className="reveal border-t border-stone-900/15 last:border-b">
                    <button onClick={() => onSelectNews(n.id)} className="group w-full text-left grid md:grid-cols-12 gap-4 py-7 items-baseline">
                      <time className="md:col-span-2 font-mono text-xs text-stone-500">{n.date}</time>
                      <span className="md:col-span-1 font-mono text-[10px] tracking-widest uppercase text-stone-500">{n.tag}</span>
                      <h3 className="md:col-span-8 font-mincho text-lg md:text-xl font-bold leading-relaxed link-underline inline">{n.title}</h3>
                      <ArrowUpRight size={18} className="md:col-span-1 justify-self-end text-stone-400 group-hover:text-stone-900 transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </Section>

            {/* ---------- Contact ---------- */}
            <section id="contact" className="border-t border-stone-900/15 bg-stone-900 text-[#eeefec]">
              <div className="mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-40">
                <p className="reveal font-mono text-xs tracking-[0.2em] uppercase text-stone-400 mb-8">Contact</p>
                <a href={`mailto:${PROFILE.social.email}`} className="reveal reveal-delay-1 group block">
                  <h2 className="font-serif italic text-[14vw] md:text-[9rem] leading-[0.9] tracking-tight">
                    Let's talk<span className="text-stone-500 group-hover:text-[#eeefec] transition-colors">.</span>
                  </h2>
                </a>
                <div className="reveal reveal-delay-2 mt-12 grid md:grid-cols-12 gap-8 items-end">
                  <p className="md:col-span-6 text-stone-400 leading-[1.9]">制作依頼、技術相談、Vket 出展、ハッカソンのお誘いなど、お気軽にご連絡ください。</p>
                  <div className="md:col-span-6 flex flex-wrap gap-x-10 gap-y-3 md:justify-end text-sm">
                    <a href={`mailto:${PROFILE.social.email}`} className="link-underline">{PROFILE.social.email}</a>
                    <a href={PROFILE.social.github} target="_blank" rel="noopener noreferrer" className="link-underline">GitHub ↗</a>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className={`relative z-[2] ${news ? 'border-t border-stone-900/15' : 'bg-stone-900 text-stone-500 border-t border-white/10'}`}>
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between gap-2 font-mono text-[11px] tracking-wider">
          <span>© {new Date().getFullYear()} {PROFILE.brand} / {PROFILE.name}</span>
          <span>{PROFILE.location}</span>
        </div>
      </footer>
    </div>
  );
};

export default EditorialSite;

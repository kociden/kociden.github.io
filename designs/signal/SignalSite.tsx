import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowLeft, Github, Mail, MapPin } from 'lucide-react';
import { PROFILE, WORKS_DATA, NEWS_DATA, SKILLS } from '../../constants';
import { useReveal } from '../../components/useReveal';
import type { SiteProps } from '../../App';

/**
 * A. Signal — ダーク × グリッド × モノスペース
 * 参考: linear.app / vercel.com のプロダクトサイト。
 * 情報密度を保ちながら、細い罫線・小さなモノスペースラベル・大きな見出しで「精密さ」を出す。
 */
const Label: React.FC<{ n: string; children: React.ReactNode }> = ({ n, children }) => (
  <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500">
    <span className="text-sky-400">{n}</span>
    <span className="h-px w-8 bg-zinc-800" />
    {children}
  </div>
);

const SignalSite: React.FC<SiteProps> = ({ selectedNewsId, onSelectNews }) => {
  useReveal([selectedNewsId]);
  const spot = useRef<HTMLDivElement>(null);

  // マウス追従のスポットライト
  useEffect(() => {
    const move = (e: MouseEvent) => {
      spot.current?.style.setProperty('--x', `${e.clientX}px`);
      spot.current?.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const news = selectedNewsId ? NEWS_DATA.find((n) => n.id === selectedNewsId) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans antialiased selection:bg-sky-400 selection:text-black">
      {/* Spotlight */}
      <div
        ref={spot}
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(600px circle at var(--x, 50%) var(--y, 30%), rgba(56,189,248,.08), transparent 60%)' }}
      />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-[#0a0a0b]/70 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <button onClick={() => onSelectNews(null)} className="font-grotesk font-bold tracking-tight text-lg flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-400 pulse-dot" />
            {PROFILE.handle}
          </button>
          <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-400">
            {['about', 'works', 'news', 'contact'].map((s) => (
              <a key={s} href={`#${s}`} onClick={() => onSelectNews(null)} className="hover:text-white transition-colors">{s}</a>
            ))}
          </nav>
          <a href={`mailto:${PROFILE.social.email}`} className="text-xs font-medium rounded-full bg-white text-black px-4 py-1.5 hover:bg-sky-400 transition-colors">
            Contact
          </a>
        </div>
      </header>

      <main className="relative z-10">
        {news ? (
          /* ---------- News Detail ---------- */
          <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
            <button onClick={() => onSelectNews(null)} className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 hover:text-white mb-10">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back
            </button>
            <div className="flex items-center gap-3 font-mono text-xs text-zinc-500 mb-4">
              <time>{news.date}</time>
              {news.tag && <span className="rounded border border-sky-400/30 text-sky-400 px-1.5 py-0.5 text-[10px] tracking-widest uppercase">{news.tag}</span>}
            </div>
            <h1 className="font-grotesk text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-10">{news.title}</h1>
            {news.thumbnail && (
              <div className="aspect-video overflow-hidden rounded-lg border border-white/10 bg-zinc-900 mb-10">
                <img src={news.thumbnail} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="news-body text-zinc-300 text-[17px] [&_a]:text-sky-400 [&_h3]:text-white" dangerouslySetInnerHTML={{ __html: news.content ?? '' }} />
            {news.url && (
              <a href={news.url} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 text-sm text-sky-400 hover:underline underline-offset-4">
                イベントページを見る <ArrowUpRight size={14} />
              </a>
            )}
          </article>
        ) : (
          <>
            {/* ---------- Hero ---------- */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 signal-grid" />
              <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-sky-500/10 blur-[120px] signal-glow" />
              <div className="relative mx-auto max-w-6xl px-6 pt-44 pb-32">
                <div className="reveal inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-zinc-400 mb-8">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 pulse-dot" />
                  Available for freelance · {PROFILE.location}
                </div>
                <h1 className="reveal reveal-delay-1 font-grotesk text-[13vw] md:text-[7.5rem] leading-[0.92] font-bold tracking-[-0.04em]">
                  Build worlds.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-white to-zinc-500">Ship fast.</span>
                </h1>
                <div className="reveal reveal-delay-2 mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end">
                  <p className="max-w-xl text-zinc-400 text-lg leading-relaxed">
                    {PROFILE.name} / {PROFILE.role}。Unity・XR を軸に、ゲーム、シミュレータ、VR 空間、そして開発を加速する自動化ツールまでを「設計から実装まで」ワンストップで作ります。
                  </p>
                  <div className="flex gap-3">
                    <a href="#works" className="inline-flex items-center gap-2 rounded-md bg-white text-black px-5 py-3 text-sm font-semibold hover:bg-sky-400 transition-colors">
                      Works <ArrowUpRight size={16} />
                    </a>
                    <a href={PROFILE.social.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5 transition-colors">
                      <Github size={16} /> GitHub
                    </a>
                  </div>
                </div>
              </div>
              {/* stats strip */}
              <div className="relative border-y border-white/5">
                <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
                  {[
                    ['3+', 'Years in game / XR dev'],
                    [String(WORKS_DATA.length), 'Selected works'],
                    ['HP賞', '札幌すごいAIハッカソン 2026'],
                    ['24h', 'Energy to build'],
                  ].map(([v, l], i) => (
                    <div key={l} className={`reveal reveal-delay-${(i % 3) + 1} py-6 px-4 first:pl-0`}>
                      <div className="font-grotesk text-2xl md:text-3xl font-bold">{v}</div>
                      <div className="font-mono text-[11px] tracking-wider text-zinc-500 mt-1">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ---------- About ---------- */}
            <section id="about" className="mx-auto max-w-6xl px-6 py-28 grid md:grid-cols-12 gap-12">
              <div className="md:col-span-4 reveal">
                <Label n="01">About</Label>
                <h2 className="font-grotesk text-4xl font-bold tracking-tight mt-5 leading-tight">設計から実装まで、<br />ひとりで完走する。</h2>
              </div>
              <div className="md:col-span-8 reveal reveal-delay-1">
                <p className="text-zinc-300 text-lg leading-[1.9]">{PROFILE.bio}</p>
                <p className="text-zinc-500 mt-4 leading-[1.9]">{PROFILE.university} / {PROFILE.affiliation}。将来の目標は AAA 級のゲームスタジオを立ち上げること。</p>
                <div className="mt-10 grid sm:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-lg overflow-hidden">
                  {SKILLS.map((s) => (
                    <div key={s.group} className="bg-[#0a0a0b] p-5">
                      <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-sky-400 mb-3">{s.group}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.items.map((t) => <span key={t} className="text-xs text-zinc-300 rounded border border-white/10 px-2 py-1">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ---------- Works ---------- */}
            <section id="works" className="border-t border-white/5">
              <div className="mx-auto max-w-6xl px-6 py-28">
                <div className="reveal flex items-end justify-between mb-12">
                  <div>
                    <Label n="02">Selected Works</Label>
                    <h2 className="font-grotesk text-4xl font-bold tracking-tight mt-5">Works</h2>
                  </div>
                  <span className="font-mono text-xs text-zinc-500 hidden md:block">{WORKS_DATA.length} projects</span>
                </div>
                <ul className="divide-y divide-white/5 border-y border-white/5">
                  {WORKS_DATA.map((w, i) => (
                    <li key={w.id} className="reveal group">
                      <a href={w.url ?? '#works'} target={w.url ? '_blank' : undefined} rel="noopener noreferrer" className="grid md:grid-cols-12 gap-6 py-8 items-center">
                        <span className="md:col-span-1 font-mono text-xs text-zinc-600">{String(i + 1).padStart(2, '0')}</span>
                        <div className="md:col-span-5">
                          <h3 className="font-grotesk text-2xl font-bold tracking-tight group-hover:text-sky-400 transition-colors flex items-center gap-2">
                            {w.title}
                            <ArrowUpRight size={18} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </h3>
                          <p className="text-zinc-500 text-sm mt-2 leading-relaxed max-w-md">{w.description}</p>
                        </div>
                        <div className="md:col-span-3 flex flex-wrap gap-1.5">
                          {w.techStack.map((t) => <span key={t} className="font-mono text-[10px] text-zinc-400 rounded border border-white/10 px-1.5 py-0.5">{t}</span>)}
                        </div>
                        <div className="md:col-span-3 aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-zinc-900">
                          <img src={w.image} alt={w.title} loading="lazy" className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ---------- News ---------- */}
            <section id="news" className="border-t border-white/5">
              <div className="mx-auto max-w-6xl px-6 py-28">
                <div className="reveal mb-12">
                  <Label n="03">Latest</Label>
                  <h2 className="font-grotesk text-4xl font-bold tracking-tight mt-5">News</h2>
                </div>
                <ul className="grid md:grid-cols-2 gap-4">
                  {NEWS_DATA.map((n) => (
                    <li key={n.id} className="reveal">
                      <button onClick={() => onSelectNews(n.id)} className="group w-full text-left rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-sky-400/40 transition-colors p-6 flex gap-5">
                        {n.thumbnail && (
                          <div className="hidden sm:block h-24 w-32 shrink-0 overflow-hidden rounded-md border border-white/10 bg-zinc-900">
                            <img src={n.thumbnail} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500 mb-2">
                            <time>{n.date}</time>
                            {n.tag && <span className="text-sky-400 tracking-widest uppercase">{n.tag}</span>}
                          </div>
                          <h3 className="font-semibold leading-snug group-hover:text-sky-400 transition-colors line-clamp-2">{n.title}</h3>
                          <span className="mt-3 inline-flex items-center gap-1 text-xs text-zinc-500">Read <ArrowUpRight size={12} /></span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ---------- Contact ---------- */}
            <section id="contact" className="border-t border-white/5 relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-sky-500/10 to-transparent" />
              <div className="relative mx-auto max-w-6xl px-6 py-32 text-center">
                <Label n="04"><span className="mx-auto">Contact</span></Label>
                <h2 className="reveal font-grotesk text-5xl md:text-7xl font-bold tracking-[-0.04em] mt-8">
                  一緒に、<span className="text-sky-400">ワクワク</span>を作りませんか。
                </h2>
                <p className="reveal reveal-delay-1 text-zinc-400 mt-6 max-w-xl mx-auto">制作依頼、技術相談、Vket 出展、ハッカソンのお誘いなど、お気軽にどうぞ。</p>
                <div className="reveal reveal-delay-2 mt-10 flex flex-wrap justify-center gap-3">
                  <a href={`mailto:${PROFILE.social.email}`} className="inline-flex items-center gap-2 rounded-md bg-white text-black px-6 py-3.5 font-semibold hover:bg-sky-400 transition-colors">
                    <Mail size={16} /> {PROFILE.social.email}
                  </a>
                  <a href={PROFILE.social.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/15 px-6 py-3.5 font-semibold hover:bg-white/5 transition-colors">
                    <Github size={16} /> github.com/{PROFILE.handle}
                  </a>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[11px] text-zinc-500">
          <span>© {new Date().getFullYear()} {PROFILE.brand} / {PROFILE.name}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {PROFILE.location}</span>
        </div>
      </footer>
    </div>
  );
};

export default SignalSite;

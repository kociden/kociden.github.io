import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowLeft, Github, Mail, MapPin, Trophy, Gamepad2, Sparkles } from 'lucide-react';
import { PROFILE, WORKS_DATA, NEWS_DATA, SKILLS } from '../../constants';
import { useReveal } from '../../components/useReveal';
import type { SiteProps } from '../../App';

/**
 * B. Bento — ガラス質のタイルグリッド
 * 参考: Apple の製品ページ / Raycast / bento.me
 * 情報を「タイル」に分割し、サイズの強弱で視線を誘導する。メッシュグラデーション背景 + グラスモーフィズム。
 */
const Tile: React.FC<React.HTMLAttributes<HTMLDivElement> & { as?: 'div' | 'a' | 'button'; href?: string; onClick?: () => void }> = ({ className = '', children, as = 'div', href, onClick, ...rest }) => {
  const cls = `glass rounded-3xl p-6 md:p-7 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 ${className}`;
  if (as === 'a') return <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`${cls} block`}>{children}</a>;
  if (as === 'button') return <button onClick={onClick} className={`${cls} text-left w-full`}>{children}</button>;
  return <div className={cls} {...rest}>{children}</div>;
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/45 mb-3">{children}</div>
);

/** 札幌の現在時刻を表示するミニウィジェット */
const Clock: React.FC = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return <span className="font-mono tabular-nums">{now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>;
};

const BentoSite: React.FC<SiteProps> = ({ selectedNewsId, onSelectNews }) => {
  useReveal([selectedNewsId]);
  const news = selectedNewsId ? NEWS_DATA.find((n) => n.id === selectedNewsId) : null;
  const [featured, ...restWorks] = WORKS_DATA;

  return (
    <div className="min-h-screen bento-mesh text-white font-sans antialiased selection:bg-violet-500 selection:text-white">
      {/* Header */}
      <header className="fixed top-4 inset-x-0 z-40 px-4">
        <div className="mx-auto max-w-6xl glass rounded-full px-5 h-12 flex items-center justify-between">
          <button onClick={() => onSelectNews(null)} className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-sky-400 text-[11px]">M</span>
            {PROFILE.brand}
          </button>
          <nav className="hidden md:flex items-center gap-1 text-sm text-white/70">
            {['about', 'works', 'news', 'contact'].map((s) => (
              <a key={s} href={`#${s}`} onClick={() => onSelectNews(null)} className="rounded-full px-3 py-1 hover:bg-white/10 hover:text-white transition-colors capitalize">{s}</a>
            ))}
          </nav>
          <a href={`mailto:${PROFILE.social.email}`} className="text-sm font-medium rounded-full bg-white text-black px-4 py-1.5 hover:bg-violet-200 transition-colors">Contact</a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-28 pb-20">
        {news ? (
          /* ---------- News Detail ---------- */
          <article className="glass rounded-3xl p-6 md:p-12 max-w-3xl mx-auto">
            <button onClick={() => onSelectNews(null)} className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-8">
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back
            </button>
            <div className="flex items-center gap-3 text-sm text-white/50 mb-4">
              <time>{news.date}</time>
              {news.tag && <span className="rounded-full bg-violet-500/20 text-violet-200 px-2.5 py-0.5 text-[11px] font-semibold">{news.tag}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-8">{news.title}</h1>
            {news.thumbnail && (
              <div className="aspect-video overflow-hidden rounded-2xl bg-white/5 mb-8">
                <img src={news.thumbnail} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="news-body text-white/80 text-[17px] [&_a]:text-sky-300 [&_h3]:text-white" dangerouslySetInnerHTML={{ __html: news.content ?? '' }} />
            {news.url && (
              <a href={news.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
                イベントページ <ArrowUpRight size={14} />
              </a>
            )}
          </article>
        ) : (
          <>
            {/* ---------- Hero bento ---------- */}
            <section id="about" className="grid grid-cols-2 md:grid-cols-6 auto-rows-[minmax(150px,auto)] gap-4">
              {/* Intro (big) */}
              <Tile className="col-span-2 md:col-span-4 md:row-span-2 flex flex-col justify-between reveal">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl float" />
                <div className="relative">
                  <Eyebrow>{PROFILE.role} · {PROFILE.location}</Eyebrow>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
                    {PROFILE.tagline}
                  </h1>
                </div>
                <p className="relative mt-8 text-white/70 max-w-lg leading-relaxed">
                  {PROFILE.name} ({PROFILE.handle})。Unity・XR を軸に、ゲーム、シミュレータ、VR 空間、開発自動化ツールまでを設計から実装まで一気通貫で作ります。
                </p>
                <div className="relative mt-6 flex gap-2">
                  <a href="#works" className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-violet-200 transition-colors">Works <ArrowUpRight size={14} /></a>
                  <a href={`mailto:${PROFILE.social.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-colors">Contact</a>
                </div>
              </Tile>

              {/* Photo */}
              <Tile className="col-span-1 md:col-span-2 md:row-span-2 !p-0 reveal reveal-delay-1">
                <img src={PROFILE.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-xs text-white/60">Nラボの日常</div>
                  <div className="font-bold">{PROFILE.affiliation}</div>
                </div>
              </Tile>

              {/* Award */}
              <Tile as="button" onClick={() => onSelectNews('n2')} className="col-span-1 md:col-span-2 reveal reveal-delay-2 group">
                <Trophy className="text-amber-300 mb-3" />
                <div className="text-sm font-semibold leading-snug">HP賞 受賞</div>
                <div className="text-xs text-white/50 mt-1">札幌すごいAIハッカソン 2026夏</div>
                <ArrowUpRight size={16} className="absolute right-5 top-5 text-white/40 group-hover:text-white transition-colors" />
              </Tile>

              {/* GitHub */}
              <Tile as="a" href={PROFILE.social.github} className="col-span-1 md:col-span-2 reveal reveal-delay-2 group">
                <Github className="mb-3" />
                <div className="text-sm font-semibold break-all">github.com/{PROFILE.handle}</div>
                <div className="text-xs text-white/50 mt-1">Code & experiments</div>
                <ArrowUpRight size={16} className="absolute right-5 top-5 text-white/40 group-hover:text-white transition-colors" />
              </Tile>

              {/* Clock / Location */}
              <Tile className="col-span-2 md:col-span-2 reveal reveal-delay-3">
                <MapPin className="text-sky-300 mb-3" />
                <div className="text-sm font-semibold">Sapporo, JP</div>
                <div className="text-xs text-white/50 mt-1">Local time <Clock /></div>
              </Tile>

              {/* Skills (wide) */}
              <Tile className="col-span-2 md:col-span-4 reveal">
                <Eyebrow>Stack</Eyebrow>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                  {SKILLS.map((s) => (
                    <div key={s.group}>
                      <div className="text-xs text-white/50 mb-1.5">{s.group}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.items.map((t) => <span key={t} className="text-xs rounded-full bg-white/10 border border-white/10 px-2.5 py-1">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </Tile>

              {/* Goal */}
              <Tile className="col-span-2 md:col-span-2 bg-gradient-to-br from-violet-600/30 to-sky-500/20 reveal reveal-delay-1">
                <Gamepad2 className="mb-3" />
                <div className="text-sm font-semibold">Dream</div>
                <p className="text-sm text-white/70 mt-1 leading-relaxed">いつか AAA 級のゲームスタジオを作る。そのために今日も作り続ける。</p>
              </Tile>
            </section>

            {/* ---------- Works bento ---------- */}
            <section id="works" className="mt-24">
              <div className="reveal flex items-end justify-between mb-6 px-1">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">Works</h2>
                <span className="text-sm text-white/40">{WORKS_DATA.length} projects</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* featured */}
                <Tile as="a" href={featured.url ?? '#works'} className="md:col-span-4 !p-0 min-h-[360px] group reveal">
                  <img src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-7">
                    <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60 mb-2">{featured.category} · {featured.year}</div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{featured.title}</h3>
                    <p className="text-sm text-white/70 mt-2 max-w-lg line-clamp-2">{featured.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">{featured.techStack.map((t) => <span key={t} className="text-[11px] rounded-full bg-white/15 backdrop-blur px-2 py-0.5">{t}</span>)}</div>
                  </div>
                </Tile>
                {restWorks.map((w, i) => (
                  <Tile key={w.id} as="a" href={w.url ?? '#works'} className={`!p-0 min-h-[260px] group reveal reveal-delay-${(i % 3) + 1} ${i === 0 ? 'md:col-span-2' : i === 1 ? 'md:col-span-2' : i === 2 ? 'md:col-span-2' : 'md:col-span-2'}`}>
                    <img src={w.image} alt={w.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 p-6">
                      <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60 mb-1.5">{w.category} · {w.year}</div>
                      <h3 className="text-xl font-bold tracking-tight">{w.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">{w.techStack.slice(0, 3).map((t) => <span key={t} className="text-[11px] rounded-full bg-white/15 backdrop-blur px-2 py-0.5">{t}</span>)}</div>
                    </div>
                  </Tile>
                ))}
              </div>
            </section>

            {/* ---------- News ---------- */}
            <section id="news" className="mt-24">
              <h2 className="reveal text-3xl md:text-4xl font-black tracking-tight mb-6 px-1">News</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {NEWS_DATA.map((n, i) => (
                  <Tile key={n.id} as="button" onClick={() => onSelectNews(n.id)} className={`group reveal reveal-delay-${(i % 3) + 1}`}>
                    <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
                      <time>{n.date}</time>
                      {n.tag && <span className="rounded-full bg-violet-500/20 text-violet-200 px-2 py-0.5 text-[10px] font-semibold">{n.tag}</span>}
                    </div>
                    <h3 className="font-semibold leading-snug pr-8">{n.title}</h3>
                    <ArrowUpRight size={16} className="absolute right-6 top-6 text-white/40 group-hover:text-white transition-colors" />
                  </Tile>
                ))}
              </div>
            </section>

            {/* ---------- Contact ---------- */}
            <section id="contact" className="mt-24">
              <Tile className="reveal text-center py-16 md:py-24 bg-gradient-to-br from-violet-600/25 via-transparent to-sky-500/20">
                <Sparkles className="mx-auto text-violet-200 mb-5" />
                <h2 className="text-4xl md:text-6xl font-black tracking-tight">一緒に作りませんか。</h2>
                <p className="text-white/60 mt-4 max-w-lg mx-auto">制作依頼、技術相談、Vket 出展、ハッカソンのお誘いなど、お気軽にご連絡ください。</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a href={`mailto:${PROFILE.social.email}`} className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 font-semibold hover:bg-violet-200 transition-colors"><Mail size={16} /> {PROFILE.social.email}</a>
                  <a href={PROFILE.social.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-semibold hover:bg-white/20 transition-colors"><Github size={16} /> GitHub</a>
                </div>
              </Tile>
            </section>
          </>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {PROFILE.brand} / {PROFILE.name}
      </footer>
    </div>
  );
};

export default BentoSite;

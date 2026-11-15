import { useRef } from 'react';
import { useInkReveal } from '../../lib/inkReveal';
import { findGame } from '../../lib/routes';
import type { GameLink } from '../../types';
import { Burst, Chips, Ransom } from '../Deco';
import { Link } from '../SiteContext';
import { Missing } from './Lists';

const ICON: Record<GameLink['kind'], string> = { post: 'POST', x: 'X', youtube: '▶', store: 'STORE', demo: 'PLAY' };

export default function GameDetail({ slug }: { slug: string }) {
  const g = findGame(slug);
  const root = useRef<HTMLElement>(null);
  useInkReveal(() => root.current);
  if (!g) {
    return <Missing back="/works/" backLabel="ワークスに戻る" title="このゲームのページは見つかりません" text="アドレスが間違っているようです。" cta="制作物を見る" />;
  }
  return (
    <article className="talk game" ref={root}>
      <Link className="back" href="/works/"><span>ワークスに戻る</span></Link>

      <div className="gm-hero">
        <img src={g.hero} alt={`${g.title} ${g.subtitle} のキービジュアル`} width="1920" height="620" />
        <span className="gm-status">{g.status}</span>
      </div>

      <div className="talk-head">
        <div>
          <p className="talk-meta"><span className="gm-rel">{g.release}</span><span>{g.genre}</span></p>
          <h1 className="talk-title" tabIndex={-1} data-focus=""><Ransom text={g.title} seed={41} /></h1>
          <p className="gm-sub">{g.subtitle}<span lang="en">{g.en}</span></p>
          <p className="gm-catch">{g.catch}</p>
          <Chips list={g.tags} label="使用技術" />
        </div>
        <section className="talk-summary" aria-labelledby="h-story"><h2 id="h-story">あらすじ</h2><p>{g.story}</p></section>
      </div>

      <dl className="ev-dl gm-dl" data-ink="">
        <div><dt>ジャンル</dt><dd>{g.genre}</dd></div>
        <div><dt>発売</dt><dd>{g.release}</dd></div>
        <div><dt>対応</dt><dd>{g.platform}</dd></div>
        <div><dt>開発</dt><dd>{g.circle}</dd></div>
        <div className="w"><dt>担当</dt><dd>{g.role}</dd></div>
      </dl>

      <section className="gm-sec" aria-labelledby="h-feat">
        <h2 className="gm-h" id="h-feat">特長</h2>
        <div className="gm-feats">
          {g.features.map((f, i) => (
            <article key={f.t} className="gm-feat" data-ink="">
              <span className="gm-feat-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </article>
          ))}
        </div>
      </section>

      {g.shots.map((s) => (
        <figure key={s.src} className="nd-photo gm-shot" data-ink="">
          <img src={s.src} alt={s.alt} width="1280" height="720" loading="lazy" />
          <figcaption>{s.caption}</figcaption>
        </figure>
      ))}

      <section className="gm-sec" id="follow" aria-labelledby="h-follow">
        <div className="contact on-red" data-ink="k">
          <Burst n={14} seed={9} />
          <div>
            <h2 className="gm-h gm-h-k" id="h-follow">開発の様子を発信中</h2>
            <p className="c-lead">新しい画面、PV、体験版のお知らせは X と YouTube で。体験版は準備中です。</p>
          </div>
          <div className="c-links">
            {g.links.map((l) => (
              <a key={l.href} className="c-link" href={l.href} target="_blank" rel="noopener">
                <span className="gm-ico" aria-hidden="true">{ICON[l.kind]}</span>
                <span className="gm-lt"><small>{l.label}</small><b>{l.text}</b></span>
                <span className="vh">（新しいタブで開きます）</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

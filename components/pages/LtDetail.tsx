import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { findTalk } from '../../lib/routes';
import { pad, reduced } from '../../lib/util';
import type { Talk } from '../../types';
import { Chips, Ransom } from '../Deco';
import { Link, useSite } from '../SiteContext';
import { Missing } from './Lists';

type Dir = 'next' | 'prev';
/** 表示中の画像レイヤー。dir があるものはワイプで入ってくる途中 */
interface Layer { key: number; idx: number; dir: Dir | null }

function Viewer({ t }: { t: Talk }) {
  const { keys, navigate } = useSite();
  const n = t.slides.length;
  const [cur, setCur] = useState(0);
  const curRef = useRef(0);
  const keyRef = useRef(0);
  const [layers, setLayers] = useState<Layer[]>([{ key: 0, idx: 0, dir: null }]);
  const strip = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);

  // 全スライドを先読み
  useEffect(() => {
    t.slides.forEach((src) => { const im = new Image(); im.src = src; });
  }, [t]);

  const go = useCallback((i: number) => {
    i = Math.max(0, Math.min(n - 1, i));
    if (i === curRef.current) return;
    const dir: Dir = i > curRef.current ? 'next' : 'prev';
    curRef.current = i;
    setCur(i);
    if (reduced()) { setLayers([{ key: ++keyRef.current, idx: i, dir: null }]); return; }
    // 前のワイプが途中なら即座に完了させ、その上に新しいレイヤーを重ねる
    setLayers((ls) => {
      const top = ls[ls.length - 1];
      return [{ ...top, dir: null }, { key: ++keyRef.current, idx: i, dir }];
    });
  }, [n]);

  const finish = (key: number) => {
    setLayers((ls) => {
      const top = ls[ls.length - 1];
      return top.key === key ? [{ ...top, dir: null }] : ls;
    });
  };

  // サムネイル列を現在のスライドが中央に来るようにスクロール
  useLayoutEffect(() => {
    const s = strip.current;
    const th = thumbs.current[cur];
    if (!s || !th) return;
    s.scrollTo({ left: th.offsetLeft - (s.clientWidth - th.offsetWidth) / 2, behavior: reduced() ? 'auto' : 'smooth' });
  }, [cur]);

  useEffect(() => {
    const v = { go: (d: number) => go(curRef.current + d), back: () => navigate('/lt/') };
    keys.viewer = v;
    return () => { if (keys.viewer === v) keys.viewer = null; };
  }, [keys, go, navigate]);

  const top = layers[layers.length - 1];
  return (
    <section className="viewer" aria-label="スライド" id="viewer">
      <div className="screen">
        <div className="slide-wrap">
          {layers.map((l) => (
            <img
              key={l.key}
              className={l.dir ? `slide-layer ${l.dir}` : 'slide-base'}
              src={t.slides[l.idx]} alt={`スライド ${l.idx + 1} / ${n}`} width="1280" height="720"
              onAnimationEnd={l.dir ? () => finish(l.key) : undefined}
            />
          ))}
          {top.dir ? <i key={`e${top.key}`} className={`slide-edge ${top.dir}`} /> : null}
        </div>
      </div>
      <div className="ctrl">
        <button className="btn nav-btn" type="button" aria-label="前のスライド" aria-disabled={cur === 0} onClick={() => go(curRef.current - 1)}><span>◀ 前へ</span></button>
        <p className="count" aria-live="polite"><span className="vh">スライド </span><b>{pad(cur + 1)}</b> / {pad(n)}</p>
        <div className="segs" aria-hidden="true">
          {t.slides.map((s, i) => <i key={s} className={i === cur ? 'on' : i < cur ? 'past' : ''} />)}
        </div>
        <button className="btn nav-btn" type="button" aria-label="次のスライド" aria-disabled={cur === n - 1} onClick={() => go(curRef.current + 1)}><span>次へ ▶</span></button>
      </div>
      <div className="thumbs" role="group" aria-label="スライド一覧" ref={strip}>
        {t.slides.map((s, i) => (
          <button
            key={s} className="thumb" type="button" aria-label={`スライド ${i + 1} へ`} aria-current={i === cur}
            ref={(el) => { thumbs.current[i] = el; }} onClick={() => go(i)}
          >
            <img src={s} alt="" loading="lazy" width="1280" height="720" />
            <span className="tn" aria-hidden="true">{pad(i + 1)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function LtDetail({ slug }: { slug: string }) {
  const t = findTalk(slug);
  if (!t || !t.slides.length) {
    return <Missing back="/lt/" backLabel="LT 一覧に戻る" title="この LT はまだ読めません" text="準備中か、アドレスが間違っているようです。" cta="一覧から選ぶ" />;
  }
  return (
    <article className="talk">
      <Link className="back" href="/lt/"><span>LT 一覧に戻る</span></Link>
      <div className="talk-head">
        <div>
          <p className="talk-meta"><time>{t.date}</time>{t.event ? <span>{t.event}</span> : null}<span>{t.minutes}分</span></p>
          <h1 className="talk-title" tabIndex={-1} data-focus=""><Ransom text={t.title} seed={31} /></h1>
          <p className="talk-sub">{t.subtitle}</p>
          <Chips list={t.tags} label="タグ" />
        </div>
        <section className="talk-summary" aria-labelledby="h-sum"><h2 id="h-sum">概要</h2><p>{t.summary}</p></section>
      </div>
      <Viewer t={t} />
    </article>
  );
}

import { useRef } from 'react';
import { EVENTS, NEWS, TALKS, WORKS } from '../../constants';
import { useInkReveal } from '../../lib/inkReveal';
import { realTalks } from '../../lib/routes';
import { EpCard, EventCard, LogItem, WorkCard } from '../Cards';
import { Burst, PageHead } from '../Deco';
import { Link } from '../SiteContext';

export function Events() {
  return (
    <div className="page">
      <Burst n={16} seed={21} />
      <PageHead title="主催イベント" sub="企画・主催しているイベント。" count={<><b>{EVENTS.length}</b>件</>} ghost="Event" seed={21} />
      {EVENTS.map((e, i) => (
        <div key={e.title}>
          {i > 0 ? <div style={{ height: 40 }} /> : null}
          <EventCard ev={e} h="h2" />
        </div>
      ))}
    </div>
  );
}

export function Works() {
  const root = useRef<HTMLDivElement>(null);
  useInkReveal(() => root.current);
  return (
    <div className="page" ref={root}>
      <Burst n={16} seed={22} />
      <PageHead title="ワークス" sub="これまでに手がけた制作物。" count={<><b>{WORKS.length}</b>件</>} ghost="Works" seed={22} />
      <div className="cards">{WORKS.map((w, i) => <WorkCard key={w.id} w={w} i={i} h="h2" />)}</div>
    </div>
  );
}

export function LtList() {
  const pending = TALKS.length - realTalks.length;
  const root = useRef<HTMLDivElement>(null);
  useInkReveal(() => root.current);
  return (
    <div className="page" ref={root}>
      <Burst n={16} seed={23} />
      <PageHead
        title="LT アーカイブ" sub="登壇した LT のスライド。"
        count={<><b>{realTalks.length}</b>本{pending ? `（準備中 ${pending}）` : ''}</>}
        ghost="LT" seed={23}
      />
      <div className="ep-grid">{TALKS.map((t) => <EpCard key={t.slug} t={t} />)}</div>
    </div>
  );
}

export function News() {
  const list = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="page">
      <Burst n={16} seed={24} />
      <PageHead title="ログ" sub="受賞やお知らせなど、これまでの記録。" count={<><b>{list.length}</b>件</>} ghost="News" seed={24} />
      <ol className="log">{list.map((n) => <LogItem key={n.id} n={n} />)}</ol>
    </div>
  );
}

/** 見つからないページ / 公開前の LT など */
export function Missing({ back, backLabel, title, text, cta }: { back: string; backLabel: string; title: string; text: string; cta: string }) {
  return (
    <div className="talk">
      <Link className="back" href={back}><span>{backLabel}</span></Link>
      <div className="missing">
        <h1 className="ph-title" tabIndex={-1} data-focus="" style={{ fontSize: 28 }}>{title}</h1>
        <p>{text}</p>
        <Link className="btn" href={back}><span>{cta}</span></Link>
      </div>
    </div>
  );
}

export function NotFound() {
  return <Missing back="/" backLabel="ホームに戻る" title="ページが見つかりません" text="アドレスが間違っているか、ページが移動したようです。" cta="ホームへ" />;
}

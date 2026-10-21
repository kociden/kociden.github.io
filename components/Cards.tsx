import type { EventItem, NewsItem, Talk, WorkItem } from '../types';
import { countdown, useNow } from '../lib/time';
import { pad, reduced } from '../lib/util';
import { realTalks } from '../lib/routes';
import { Burst, Chips, Ransom } from './Deco';
import { Link, useSite } from './SiteContext';

type H = 'h2' | 'h3';

export function WorkCard({ w, i, h: Tag = 'h3' }: { w: WorkItem; i: number; h?: H }) {
  return (
    <article className="card">
      <span className="card-no" aria-hidden="true">{pad(i + 1)}</span>
      <div className="card-img"><img src={w.image} alt={`${w.title} の画面`} loading="lazy" width="800" height="500" /></div>
      <div className="card-body">
        <p className="card-cat"><span>{w.category}</span><span>{w.year}</span></p>
        <Tag className="card-title">
          {w.url ? <a href={w.url} target="_blank" rel="noopener">{w.title}</a> : w.title}
        </Tag>
        <p className="card-desc">{w.desc}</p>
        <Chips list={w.tech} label="使用技術" />
      </div>
    </article>
  );
}

/** LT の通し番号（古いものから #01） */
export const epNo = (t: Talk) => realTalks.length - realTalks.indexOf(t);

export function EpCard({ t }: { t: Talk }) {
  if (t.placeholder) {
    return (
      <div className="ep is-lock">
        <div className="ep-cover"><span className="lock">{t.subtitle || '準備中'}</span></div>
        <div className="ep-body">
          <h2 className="ep-title">{t.title}</h2>
          <p className="ep-sub">ただいま準備中です。公開までお待ちください。</p>
          <p className="ep-meta"><span>{t.minutes}分予定</span></p>
        </div>
      </div>
    );
  }
  return (
    <Link className="ep" href={`/lt/${encodeURIComponent(t.slug)}/`}>
      <div className="ep-cover">
        <img src={t.cover} alt="" loading="lazy" width="1280" height="720" />
        <span className="ep-no">#{pad(epNo(t))}</span>
        <span className="ep-min">{t.minutes}分</span>
      </div>
      <div className="ep-body">
        <h2 className="ep-title">{t.title}</h2>
        <p className="ep-sub">{t.subtitle}</p>
        <Chips list={t.tags} label="タグ" />
        <p className="ep-meta"><time>{t.date}</time>{t.event ? <span>{t.event}</span> : null}</p>
      </div>
    </Link>
  );
}

const TAGS: Record<string, [string, string]> = { Award: ['受賞', 'award'], Info: ['お知らせ', 'info'] };
export const newsTag = (tag?: string): [string, string] => (tag ? TAGS[tag] || [tag, 'other'] : ['', 'other']);

export function LogMeta({ n }: { n: NewsItem }) {
  const [label, cls] = newsTag(n.tag);
  return (
    <p className="log-meta"><time>{n.date}</time>{label ? <span className={`log-tag ${cls}`}>{label}</span> : null}</p>
  );
}

export function LogItem({ n }: { n: NewsItem }) {
  return (
    <li>
      <Link className="log-card" href={`/news/${encodeURIComponent(n.id)}/`}>
        <LogMeta n={n} />
        <h2 className="log-title">{n.title}</h2>
      </Link>
    </li>
  );
}

export function EventCard({ ev, h: Tag = 'h3' }: { ev: EventItem; h?: H }) {
  const now = useNow();
  const { cutin } = useSite();
  const c = countdown(ev, now);
  return (
    <div className="ev-wrap">
      <Burst n={12} seed={5} />
      <span className="burst-lbl" aria-hidden="true">参加<br />無料</span>
      <article className="ev on-red">
        <div className="ev-media">
          <div className="ev-img"><img src={ev.image} alt={`${ev.title} の告知画像`} width="660" height="270" loading="lazy" /></div>
          {c.state === 'soon' ? (
            <div className="ev-cd"><span className="l">開催まで</span><b>{c.d}</b><small>日</small><b>{pad(c.h)}</b><small>時間</small></div>
          ) : (
            <div className="ev-cd"><span className="l">{c.state === 'live' ? 'ただいま開催中' : '開催終了'}</span></div>
          )}
          <p className="ev-tagline">{ev.hashtag}</p>
        </div>
        <div className="ev-body">
          <p className="ev-role"><span className="r">{ev.role}</span><span>{ev.org}</span></p>
          <Tag className="ev-title"><Ransom text={ev.title} seed={11} /></Tag>
          <p className="ev-sub">{ev.subtitle}</p>
          <dl className="ev-dl">
            <div><dt>日時</dt><dd>{ev.date}<br />{ev.time}</dd></div>
            <div><dt>定員 / 参加費</dt><dd>{ev.capacity}名 ／ {ev.fee}</dd></div>
            <div className="w"><dt>会場</dt><dd>{ev.place}</dd></div>
            {ev.sponsors.length ? (
              <div className="w"><dt>協賛</dt><dd><ul>{ev.sponsors.map((s) => <li key={s}>{s}</li>)}</ul></dd></div>
            ) : null}
          </dl>
          <p className="ev-sum">{ev.summary}</p>
          <p className="ev-hash">{ev.hashtag}</p>
          <div className="ev-foot">
            <a
              className="cta" href={ev.url} target="_blank" rel="noopener"
              // リンク自体は通常どおり新しいタブで開く。こちらのタブではカットインだけ流す
              onClick={() => { if (!reduced()) void cutin({ big: ev.title, kick: '参加登録へ' }); }}
            >
              connpass で参加登録<span className="ext">別タブ</span><span className="vh">（新しいタブで開きます）</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

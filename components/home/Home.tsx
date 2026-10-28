import { useEffect, useRef, useState } from 'react';
import { useInkReveal } from '../../lib/inkReveal';
import { EVENTS, HERO_PHOTOS, HOT_SKILLS, PROFILE, SKILLS, WORKS } from '../../constants';
import { realTalks } from '../../lib/routes';
import { countdown, jstParts, useNow } from '../../lib/time';
import { pad, reduced } from '../../lib/util';
import type { EventItem } from '../../types';
import { EventCard, WorkCard } from '../Cards';
import { Burst, Chips, Ransom, SectionHead } from '../Deco';
import { Link } from '../SiteContext';
import CommandMenu from './CommandMenu';

const EV: EventItem | undefined = EVENTS[0];
const ghLabel = PROFILE.github.replace(/^https?:\/\//, '').replace(/\/$/, '');
const allSkills = new Set(SKILLS.flatMap((g) => g.items));

function HudBox() {
  const now = useNow();
  const p = jstParts(now);
  const c = EV ? countdown(EV, now) : null;
  return (
    <div className="hudbox">
      <div className="hb-top">
        <div className="hb-date"><span className="hb-l">今日</span><b className="hb-n">{`${p.year}.${p.month}.${p.day}`}</b><span className="dow">{p.weekday}</span></div>
        <div className="hb-clock"><span className="hb-l">札幌 現在時刻</span><b className="hb-n">{`${p.hour}:${p.minute}:${p.second}`}</b></div>
      </div>
      {EV && c ? (
        <div className="hb-mis">
          <span className="hb-l">次のミッション</span>
          <p className="hb-mis-name">{EV.title}</p>
          {c.state === 'soon' ? (
            <p className="hb-cd"><b>{c.d}</b><small>日</small><b className="s">{pad(c.h)}</b><small>時間</small><b className="s">{pad(c.m)}</b><small>分</small></p>
          ) : (
            <p className="hb-cd"><small>{c.state === 'live' ? 'ただいま開催中' : '開催終了'}</small></p>
          )}
          <Link className="hb-go" href="/events/">{EV.date} 開催・詳細を見る</Link>
        </div>
      ) : null}
    </div>
  );
}

function Radar({ on, setOn }: { on: number; setOn: (i: number) => void }) {
  const G = SKILLS;
  const N = G.length;
  const max = Math.max(8, Math.ceil(Math.max(...G.map((g) => g.items.length)) / 2) * 2);
  const R = 120;
  const ang = (i: number) => -Math.PI / 2 + (i / N) * Math.PI * 2;
  const P2 = (i: number, r: number): [number, number] => [Math.cos(ang(i)) * r, Math.sin(ang(i)) * r];
  const poly = (r: number) => Array.from({ length: N }, (_, i) => P2(i, r).map((v) => v.toFixed(1)).join(',')).join(' ');
  const area = G.map((g, i) => P2(i, (R * g.items.length) / max).map((v) => v.toFixed(1)).join(',')).join(' ');
  return (
    <svg className="radar" viewBox="-215 -200 430 400" role="img" aria-label={`分類ごとのスキル数のレーダーチャート：${G.map((g) => `${g.group} ${g.items.length}`).join('、')}`}>
      {[1, 2, 3, 4].map((k) => <polygon key={k} className={`ring${k === 4 ? ' o' : ''}`} points={poly((R * k) / 4)} />)}
      {G.map((_, i) => { const [x, y] = P2(i, R); return <line key={i} className="ax" x1="0" y1="0" x2={x.toFixed(1)} y2={y.toFixed(1)} />; })}
      <polygon className="area" points={area} />
      {G.map((g, i) => {
        const [px, py] = P2(i, (R * g.items.length) / max);
        const [lx, ly] = P2(i, R + 30);
        const c = Math.cos(ang(i));
        const anchor = Math.abs(c) < 0.3 ? 'middle' : c > 0 ? 'start' : 'end';
        const up = Math.sin(ang(i)) < -0.3;
        const lblY = up ? ly - 22 : ly + 4;
        const valY = up ? ly + 4 : ly + 32;
        const w = g.group.length * 9 + 14;
        const bx = anchor === 'middle' ? lx - w / 2 : anchor === 'start' ? lx - 6 : lx - w + 6;
        return (
          <g key={g.group} className={i === on ? 'on' : undefined} onPointerEnter={() => setOn(i)}>
            <circle className="pt" cx={px.toFixed(1)} cy={py.toFixed(1)} r="6" />
            <rect className="lbl-bg" x={bx.toFixed(1)} y={(lblY - 16).toFixed(1)} width={w} height="22" />
            <text className="lbl" x={lx.toFixed(1)} y={lblY.toFixed(1)} textAnchor={anchor}>{g.group}</text>
            <text className="val" x={lx.toFixed(1)} y={valY.toFixed(1)} textAnchor={anchor}>{g.items.length}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Status() {
  const [on, setOn] = useState(() => Math.max(0, SKILLS.findIndex((g) => g.items.includes('Claude Code'))));
  const maxN = Math.max(8, ...SKILLS.map((x) => x.items.length));
  return (
    <section className="sec" id="status" aria-labelledby="h-status">
      <SectionHead n={3} text="ステータス" id="h-status" focusable />
      <div className="stat">
        <div className="radar-box" data-ink="">
          <Burst n={16} seed={12} />
          <Radar on={on} setOn={setOn} />
          <p className="radar-total"><span>スキル総数</span><b>{allSkills.size}</b></p>
        </div>
        <div className="srows" data-ink="">
          {SKILLS.map((g, i) => (
            <div key={g.group} className={`srow${i === on ? ' on' : ''}`} onPointerEnter={() => setOn(i)}>
              <div className="srow-h"><h3>{g.group}</h3><span className="n">{g.items.length}<small>個</small></span></div>
              <div className="pips" aria-hidden="true">
                {Array.from({ length: maxN }, (_, k) => <i key={k} className={k < g.items.length ? 'f' : ''} />)}
              </div>
              <Chips list={g.items} label={`${g.group} のスキル`} hot={HOT_SKILLS} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PHOTO_MS = 4200;

/** 右側の写真枠: サイト内の写真を斜めのワイプで順に流す。ホバー・フォーカス中とタブ非表示中は止める */
function HeroPhotos() {
  const [{ cur, prev }, setShow] = useState({ cur: 0, prev: -1 });
  const hold = useRef(false);
  const go = (n: number) => setShow((s) => (n === s.cur ? s : { cur: n, prev: s.cur }));
  // 写真が変わるたびに（手で選んだときも）タイマーを掛け直す
  useEffect(() => {
    if (reduced() || HERO_PHOTOS.length < 2) return;
    let t = 0;
    const arm = () => {
      t = window.setTimeout(() => {
        if (hold.current || document.hidden) { arm(); return; }
        setShow((s) => ({ cur: (s.cur + 1) % HERO_PHOTOS.length, prev: s.cur }));
      }, PHOTO_MS);
    };
    arm();
    return () => window.clearTimeout(t);
  }, [cur]);
  const p = HERO_PHOTOS[cur];
  const pause = (v: boolean) => () => { hold.current = v; };
  return (
    <figure className="photo" onPointerEnter={pause(true)} onPointerLeave={pause(false)} onFocus={pause(true)} onBlur={pause(false)}>
      <div className="photo-frame">
        {HERO_PHOTOS.map((ph, k) => (
          <img
            key={ph.src} src={ph.src} alt={k === cur ? ph.alt : ''} aria-hidden={k === cur ? undefined : true}
            className={k === cur ? 'is-on' : k === prev ? 'is-prev' : undefined}
            width="640" height="480" decoding="async"
          />
        ))}
      </div>
      <figcaption className="photo-cap" aria-live="polite">{p.href ? <Link href={p.href}>{p.caption}</Link> : p.caption}</figcaption>
      <div className="photo-dots" role="group" aria-label="写真を選ぶ">
        {HERO_PHOTOS.map((ph, k) => (
          <button key={ph.src} type="button" aria-label={ph.caption} aria-pressed={k === cur} onClick={() => go(k)} />
        ))}
      </div>
      <div className="plate" aria-hidden="true"><p className="plate-h">{PROFILE.brand}</p><p className="plate-n">{PROFILE.handle}</p><p className="plate-r">{PROFILE.location}</p></div>
    </figure>
  );
}

export default function Home() {
  const t = realTalks[0];
  // 各ブロックを初めて画面に入った時にインクで出す（対応ブラウザのみ）
  useInkReveal(() => document.getElementById('view'));
  return (
    <>
      <h1 className="vh">{PROFILE.handle}（{PROFILE.brand}）のポートフォリオ</h1>
      <section className="hero" aria-label="メインメニュー">
        <div className="hero-bg" aria-hidden="true">
          <div className="dots" /><Burst n={20} seed={2} className="b1" />
          <div className="slab" /><div className="slab2" />
          <div className="ghost">{PROFILE.handle}</div>
        </div>
        <div className="hero-main">
          <p className="hero-who"><span className="tag">{PROFILE.brand}</span><span>{PROFILE.handle}・{PROFILE.role}</span></p>
          <p className="hero-tag"><Ransom text={PROFILE.tagline} seed={4} /></p>
          <CommandMenu />
        </div>
        <aside className="hero-side" aria-label="ステータス表示">
          <HudBox />
          <HeroPhotos />
        </aside>
      </section>

      <section className="sec" id="profile" aria-labelledby="h-profile">
        <SectionHead n={1} text="プロフィール" id="h-profile" focusable />
        <div className="prof" data-ink="">
          <div className="prof-icon" aria-hidden="true"><img src="/assets/mlab-icon.svg" alt="" width="160" height="160" /></div>
          <div className="prof-body">
            <p className="prof-name"><b>{PROFILE.handle}</b><span className="prof-sep">/</span><span>{PROFILE.realName}</span></p>
            <p className="prof-school">{PROFILE.school}</p>
            <p className="prof-bio">{PROFILE.bio}</p>
            <p className="prof-now"><span className="prof-now-k">いま</span>{PROFILE.now}</p>
            <p className="prof-now prof-award"><span className="prof-now-k">受賞</span><Link href="/news/n2/">{PROFILE.award}</Link></p>
          </div>
          <figure className="prof-others">
            <figcaption className="prof-others-k">他己紹介</figcaption>
            <p>{PROFILE.others}</p>
          </figure>
        </div>
      </section>

      {EV ? (
        <section className="sec" id="event" aria-labelledby="h-event">
          <SectionHead n={2} text="主催イベント" id="h-event" />
          <p className="lead" data-ink="">{PROFILE.intro} そして、つくる人を増やす場も主催しています。</p>
          <EventCard ev={EV} />
        </section>
      ) : null}

      <Status />

      <section className="sec" aria-labelledby="h-works">
        <SectionHead n={4} text="ワークス" id="h-works" />
        <p className="lead" data-ink="">最近つくったもの。ゲームからシミュレータ、VR 空間まで。</p>
        <div className="cards">{WORKS.slice(0, 2).map((w, i) => <WorkCard key={w.id} w={w} i={i} />)}</div>
        <div className="sec-foot" data-ink=""><Link className="btn" href="/works/"><span>制作物をすべて見る（{WORKS.length}件）</span></Link></div>
      </section>

      {t ? (
        <section className="sec" aria-labelledby="h-lt">
          <SectionHead n={5} text="最新の LT" id="h-lt" />
          <p className="lead" data-ink="">登壇したスライドは、すべてこのサイトで読めます。</p>
          <Link className="teaser" data-ink="" href={`/lt/${encodeURIComponent(t.slug)}/`}>
            <div className="teaser-img"><img src={t.cover} alt="" loading="lazy" width="1280" height="720" /></div>
            <div className="teaser-body">
              <span className="teaser-new">新着</span>
              <h3 className="teaser-title">{t.title}</h3>
              <p className="teaser-sub">{t.subtitle}</p>
              <p className="teaser-meta">{t.date}　{t.minutes}分　{t.slides.length}枚</p>
              <Chips list={t.tags} label="タグ" />
              <span className="teaser-go">スライドを読む</span>
            </div>
          </Link>
          <div className="sec-foot" data-ink=""><Link className="btn" href="/lt/"><span>LT 一覧へ</span></Link></div>
        </section>
      ) : null}

      <section className="sec" aria-labelledby="h-mis">
        <SectionHead n={6} text="ミッション" id="h-mis" />
        <div className="missions" style={{ marginTop: 28 }}>
          <article className="mis main" data-ink=""><span className="mis-k">目標</span><h3 className="mis-t">{PROFILE.goal}</h3><p className="mis-s">進行中</p></article>
          <article className="mis" data-ink=""><span className="mis-k">夢</span><h3 className="mis-t">{PROFILE.dream}</h3><p className="mis-s">いつか必ず</p></article>
        </div>
      </section>

      <section className="sec" id="contact" aria-labelledby="h-contact">
        <div className="contact on-red" data-ink="k">
          <Burst n={14} seed={8} />
          <div>
            <SectionHead n={7} text="コンタクト" id="h-contact" focusable />
            <p className="c-lead">制作の相談、ゲームジャムのお誘い、なんでも気軽にどうぞ。</p>
          </div>
          <div className="c-links">
            <a className="c-link" href={`mailto:${PROFILE.email}`}><small>メール</small><b>{PROFILE.email}</b></a>
            <a className="c-link" href={PROFILE.github} target="_blank" rel="noopener"><small>GitHub</small><b>{ghLabel}</b></a>
          </div>
        </div>
      </section>
    </>
  );
}

import { useSyncExternalStore } from 'react';
import type { EventItem } from '../types';

const TZ = 'Asia/Tokyo';

/** イベント開始時刻（date / time は JST） */
export function eventStart(ev: EventItem): Date {
  const [y, m, d] = ev.date.split('.').map(Number);
  const tm = (ev.time || '0:00').match(/(\d{1,2}):(\d{2})/);
  const hh = tm ? +tm[1] : 0;
  const mm = tm ? +tm[2] : 0;
  return new Date(Date.UTC(y, m - 1, d, hh - 9, mm));
}

export function eventEnd(ev: EventItem): Date {
  const tm = (ev.time || '').match(/〜\s*(\d{1,2}):(\d{2})/);
  const s = eventStart(ev);
  if (!tm) return new Date(s.getTime() + 12 * 3600e3);
  const [y, m, d] = ev.date.split('.').map(Number);
  return new Date(Date.UTC(y, m - 1, d, +tm[1] - 9, +tm[2]));
}

export type Countdown =
  | { state: 'soon'; d: number; h: number; m: number }
  | { state: 'live' }
  | { state: 'done' };

export function countdown(ev: EventItem, now: number): Countdown {
  const start = eventStart(ev).getTime();
  const ms = start - now;
  if (ms <= 0) return { state: now < eventEnd(ev).getTime() ? 'live' : 'done' };
  const mins = Math.floor(ms / 60000);
  return { state: 'soon', d: Math.floor(mins / 1440), h: Math.floor((mins % 1440) / 60), m: mins % 60 };
}

const fmtParts = new Intl.DateTimeFormat('ja-JP', {
  timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

export function jstParts(now: number): Record<string, string> {
  const o: Record<string, string> = {};
  fmtParts.formatToParts(new Date(now)).forEach((p) => { o[p.type] = p.value; });
  return o;
}

/* ---------- 1 秒ごとの時計（購読者がいる間だけ 1 本の interval を回す） ---------- */
let now = Date.now();
let timer: number | undefined;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (timer === undefined) {
    now = Date.now();
    timer = window.setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

/** 現在時刻（ms）。1 秒ごとに再描画される */
export const useNow = () => useSyncExternalStore(subscribe, () => now);

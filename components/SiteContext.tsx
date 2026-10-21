import { createContext, forwardRef, useContext, type AnchorHTMLAttributes, type MouseEvent } from 'react';

export interface CutInLabel {
  big: string;
  kick?: string;
}

/** キーボード操作の受け口（ホームのコマンドメニュー / スライドビューア） */
export interface MenuKeys {
  list: HTMLElement;
  move: (d: number) => void;
  focusSel: () => void;
}
export interface ViewerKeys {
  go: (d: number) => void;
  back: () => void;
}
export interface KeyTargets {
  menu: MenuKeys | null;
  viewer: ViewerKeys | null;
}

export interface SiteApi {
  navigate: (href: string) => void;
  cutin: (label: CutInLabel, mid?: (() => void) | null) => Promise<void>;
  keys: KeyTargets;
}

export const SiteContext = createContext<SiteApi | null>(null);

export function useSite(): SiteApi {
  const v = useContext(SiteContext);
  if (!v) throw new Error('SiteContext is missing');
  return v;
}

/** サイト内リンク。普通の <a href> だが、左クリックはクライアント側で遷移（カットイン付き） */
export const Link = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
  function Link({ onClick, ...props }, ref) {
    const { navigate } = useSite();
    const handle = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (props.target && props.target !== '_self') return;
      e.preventDefault();
      navigate(props.href);
    };
    return <a ref={ref} {...props} onClick={handle} />;
  },
);

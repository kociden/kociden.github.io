import { findNews } from '../../lib/routes';
import { LogMeta } from '../Cards';
import { Link } from '../SiteContext';
import { Missing } from './Lists';

export default function NewsDetail({ id }: { id: string }) {
  const n = findNews(id);
  if (!n) {
    return <Missing back="/news/" backLabel="ログ一覧に戻る" title="お知らせが見つかりません" text="アドレスが間違っているようです。" cta="一覧から選ぶ" />;
  }
  return (
    <article className="nd">
      <Link className="back" href="/news/"><span>ログ一覧に戻る</span></Link>
      <header className="nd-head">
        <LogMeta n={n} />
        <h1 className="nd-title" tabIndex={-1} data-focus="">{n.title}</h1>
      </header>
      {n.image ? <figure className="nd-photo"><img src={n.image} alt={n.imageAlt ?? ''} /></figure> : null}
      {/* content は constants.ts に自分で書いた HTML のみ（外部入力は入らない） */}
      {n.content ? <div className="nd-body" dangerouslySetInnerHTML={{ __html: n.content }} /> : null}
      {n.url ? (
        <div className="nd-foot">
          <a className="btn" href={n.url} target="_blank" rel="noopener noreferrer"><span>関連ページ（別タブ）</span></a>
        </div>
      ) : null}
    </article>
  );
}

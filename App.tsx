import { useEffect, useState } from 'react';
import DesignSwitcher from './components/DesignSwitcher';
import SignalSite from './designs/signal/SignalSite';
import BentoSite from './designs/bento/BentoSite';
import EditorialSite from './designs/editorial/EditorialSite';
import { DesignId, DESIGNS } from './types';

const STORAGE_KEY = 'mlab-design';

/** URL ?design=xxx → localStorage → デフォルト の順で初期デザインを決める */
function resolveInitialDesign(): DesignId {
  const ids = DESIGNS.map((d) => d.id);
  const fromUrl = new URLSearchParams(window.location.search).get('design') as DesignId | null;
  if (fromUrl && ids.includes(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as DesignId | null;
    if (saved && ids.includes(saved)) return saved;
  } catch { /* ignore */ }
  return 'signal';
}

export interface SiteProps {
  selectedNewsId: string | null;
  onSelectNews: (id: string | null) => void;
}

function App() {
  const [design, setDesign] = useState<DesignId>(resolveInitialDesign);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, design); } catch { /* ignore */ }
    const url = new URL(window.location.href);
    url.searchParams.set('design', design);
    window.history.replaceState(null, '', url.toString());
  }, [design]);

  // ニュース詳細 ↔ トップ の切替時にスクロール位置をリセット
  useEffect(() => { window.scrollTo({ top: 0 }); }, [selectedNewsId]);

  const siteProps: SiteProps = { selectedNewsId, onSelectNews: setSelectedNewsId };

  return (
    <>
      {design === 'signal' && <SignalSite {...siteProps} />}
      {design === 'bento' && <BentoSite {...siteProps} />}
      {design === 'editorial' && <EditorialSite {...siteProps} />}
      <DesignSwitcher current={design} onChange={(id) => { setSelectedNewsId(null); setDesign(id); }} />
    </>
  );
}

export default App;

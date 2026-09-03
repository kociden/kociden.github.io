import { useEffect, useState } from 'react';
import Site from './components/Site';

export interface SiteProps {
  selectedNewsId: string | null;
  onSelectNews: (id: string | null) => void;
}

function App() {
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // ニュース詳細 ↔ トップ の切替時にスクロール位置をリセット
  useEffect(() => { window.scrollTo({ top: 0 }); }, [selectedNewsId]);

  return <Site selectedNewsId={selectedNewsId} onSelectNews={setSelectedNewsId} />;
}

export default App;

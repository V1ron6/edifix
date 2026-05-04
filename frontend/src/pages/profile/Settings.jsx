import { useEffect, useState } from 'react';
import Button from '../../components/shared/Button';

const DEFAULT_PREFS = {
  compactCards: false,
  reduceMotion: false,
  showForumPreview: true,
};

export default function Settings() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    const raw = localStorage.getItem('edifix_ui_prefs');
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setPrefs((prev) => ({ ...prev, ...parsed }));
    } catch {
    }
  }, []);

  const savePrefs = () => {
    localStorage.setItem('edifix_ui_prefs', JSON.stringify(prefs));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <main className="page-main">
      <section className="card">
        <h1>Settings</h1>
        <p>Personalize your learning UI preferences.</p>
        <label>
          <input
            type="checkbox"
            checked={prefs.compactCards}
            onChange={(event) => setPrefs((prev) => ({ ...prev, compactCards: event.target.checked }))}
          />
          Use compact cards
        </label>
        <label>
          <input
            type="checkbox"
            checked={prefs.reduceMotion}
            onChange={(event) => setPrefs((prev) => ({ ...prev, reduceMotion: event.target.checked }))}
          />
          Reduce motion effects
        </label>
        <label>
          <input
            type="checkbox"
            checked={prefs.showForumPreview}
            onChange={(event) => setPrefs((prev) => ({ ...prev, showForumPreview: event.target.checked }))}
          />
          Show notification preview in navbar
        </label>
        <Button onClick={savePrefs}>Save Preferences</Button>
      </section>
    </main>
  );
}

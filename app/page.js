'use client';

import { useEffect, useState } from 'react';

const SUPPLIER_ORIGIN = 'https://khmer-topup.com';

function gameImage(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SUPPLIER_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function Home() {
  const [games, setGames] = useState([]);
  const [selected, setSelected] = useState(null);
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/games', { cache: 'no-store' })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || !Array.isArray(d.games)) throw new Error(d.error || 'Games API error');
        setGames(d.games);
        if (d.games.length) setSelected(d.games[0]);
      })
      .catch((e) => setError(e.message || 'មិនអាចទាញយកបញ្ជី Game បានទេ'))
      .finally(() => setLoading(false));
  }, []);

  function chooseGame(g) {
    setSelected(g);
    setPkg(null);
    setPlayerId('');
    setServerId('');
    setMessage('');
    requestAnimationFrame(() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  async function createOrder() {
    if (!selected || !pkg || !playerId.trim()) {
      setMessage('សូមបំពេញ Game ID និងជ្រើស Package');
      return;
    }
    setMessage('កំពុងបង្កើត Order...');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: pkg.package_id,
          player_id: playerId.trim(),
          server_id: serverId.trim() || undefined,
          reference: 'WEB-' + Date.now()
        })
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.error || 'Order failed');
      setMessage(`Order ${data.order_code} — ${data.status}`);
    } catch {
      setMessage('មានបញ្ហាក្នុងការតភ្ជាប់ Server');
    }
  }

  return (
    <main>
      <header className="nav">
        <div className="brand">
  <img
    src="/imsela_com-removed-20260902_203809.png"
    alt="MeowShop Logo"
    style={{
      width: "140px",
      height: "140px",
      objectFit: "contain",
      marginLeft: "-60px",
      marginTop: "75px"
    }}
  />

  <span style={{ position: "relative", top: "-90px", fontSize: "40px" }}>Meow MeowShop</span>
</div>
        <div className="navlinks"><span>Top Up</span><span>Track Order</span><span>Support</span></div>
      </header>

      <section className="hero">
        <div>
          <div className="badge">⚡ FAST GAME TOP UP</div>
          <h1>Top Up Diamond<br /><span>លឿន • សុវត្ថិភាព • ងាយស្រួល</span></h1>
          <p>ជ្រើសរើស Game → បញ្ចូល ID → ជ្រើស Diamond → បង់ប្រាក់</p>
        </div>
        <div className="orb">💎</div>
      </section>

      <section className="panel">
        <h2>🎮 ជ្រើសរើស Game</h2>
        {loading ? <p className="loading">កំពុងទាញយក Game...</p> : error ? <div className="error">❌ {error}</div> : (
          <div className="games">
            {games.map(g => (
              <button
                type="button"
                className={selected?.slug === g.slug ? 'game active' : 'game'}
                key={g.slug}
                onClick={() => chooseGame(g)}
              >
                <div className="game-logo-wrap">
                  {g.image ? (
                    <img className="game-logo" src={gameImage(g.image)} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : <span className="game-fallback">🎮</span>}
                </div>
                <div className="game-info">
                  <b>{g.name}</b>
                  <small>{g.id_label}{g.server_label ? ' + ' + g.server_label : ''}</small>
                </div>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className="checkout" id="checkout">
            <div className="selected-game">
              <div className="selected-logo-wrap">
                {selected.image ? <img className="selected-logo" src={gameImage(selected.image)} alt="" /> : <span>🎮</span>}
              </div>
              <div><small>Game ដែលបានជ្រើស</small><strong>{selected.name}</strong></div>
            </div>

            <div className="fields">
              <label>{selected.id_label || 'Player ID'}
                <input value={playerId} onChange={e => setPlayerId(e.target.value)} placeholder="បញ្ចូល Game ID" />
              </label>
              {selected.server_label && <label>{selected.server_label}
                <input value={serverId} onChange={e => setServerId(e.target.value)} placeholder="បញ្ចូល Zone/Server ID" />
              </label>}
            </div>

            <h3>💎 ជ្រើស Package</h3>
            <div className="packages">
              {(selected.packages || []).map(p => (
                <button type="button" key={p.package_id} className={pkg?.package_id === p.package_id ? 'package selected' : 'package'} onClick={() => setPkg(p)}>
                  <strong>{p.name}</strong><span>${Number(p.price).toFixed(2)}</span>
                </button>
              ))}
            </div>

            <div className="summary">
              <div><span>Game</span><b>{selected.name}</b></div>
              <div><span>Package</span><b>{pkg?.name || '—'}</b></div>
              <div><span>Price</span><b>${pkg ? Number(pkg.price).toFixed(2) : '0.00'}</b></div>
            </div>

            <button type="button" className="buy" onClick={createOrder}>💎 បន្ត Top Up</button>
            {message && <div className="message">{message}</div>}
          </div>
        )}
      </section>

      <footer>© 2026 MeowShop · Fast & Secure Game Top Up</footer>
    </main>
  );
}

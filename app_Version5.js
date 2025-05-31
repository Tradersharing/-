// List pair mayor, minor, XAU (emas), dan WTI oil
const allowedPairs = [
  "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD", // mayor
  "EURGBP", "EURJPY", "GBPJPY", "CHFJPY", "EURAUD", "AUDJPY",          // minor
  "XAUUSD", "WTI"
];

// Contoh data dari berbagai provider (bisa kamu ganti dengan hasil fetch API/scraping)
const allSignals = [
  {
    provider: "Sinyal A", // ganti sesuai nama sumber
    data: [
      { pair: "EURUSD", signal: "BUY", percent: 81 },
      { pair: "GBPUSD", signal: "SELL", percent: 72 },
      { pair: "XAUUSD", signal: "BUY", percent: 74 },
      { pair: "USDJPY", signal: "BUY", percent: 68 }, // < 70%, tidak tampil
      { pair: "EURGBP", signal: "SELL", percent: 69 } // < 70%, tidak tampil
    ]
  },
  {
    provider: "Sinyal B",
    data: [
      { pair: "EURUSD", signal: "BUY", percent: 78 },
      { pair: "AUDUSD", signal: "SELL", percent: 75 },
      { pair: "WTI", signal: "BUY", percent: 80 },
      { pair: "GBPJPY", signal: "SELL", percent: 70 }
    ]
  },
  // Tambah provider/sumber lain di sini...
];

// Render function
function renderSignals() {
  const container = document.getElementById('container');
  container.innerHTML = '';

  // Render setiap provider (Sinyal A, Sinyal B, dst)
  allSignals.forEach(sig => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h2>${sig.provider}</h2>
      <ul class="signal-list">
        ${
          sig.data
            .filter(item => allowedPairs.includes(item.pair) && item.percent >= 70)
            .map(item => 
              `<li>
                <span>${item.pair}:</span>
                <span class="${item.signal === 'BUY' ? 'buy' : 'sell'}">
                  ${item.signal} ${item.percent}%
                </span>
              </li>`
            ).join('') || '<li style="color: #888;">No pairs meet the criteria.</li>'
        }
      </ul>`;
    container.appendChild(card);
  });

  // Render kotak final (gabungan)
  const final = document.createElement('div');
  final.className = 'card final';
  final.innerHTML = `<h2>Final All Signal</h2>
    <ul class="signal-list">
      ${renderFinalSignal()}
    </ul>`;
  container.appendChild(final);
}

// Fungsi gabungan vote/rata-rata
function renderFinalSignal() {
  // Gabungkan semua pair unik dari semua provider yang lolos filter
  const pairSet = new Set();
  allSignals.forEach(sig => {
    sig.data.forEach(item => {
      if (allowedPairs.includes(item.pair) && item.percent >= 70)
        pairSet.add(item.pair);
    });
  });
  // Untuk setiap pair, hitung rata-rata prosentase dan majority signal
  let html = '';
  pairSet.forEach(pair => {
    let signals = [];
    allSignals.forEach(sig => {
      const found = sig.data.find(item => item.pair === pair && item.percent >= 70);
      if (found) signals.push(found);
    });
    if (signals.length > 0) {
      // voting signal
      let buy = signals.filter(s => s.signal === "BUY");
      let sell = signals.filter(s => s.signal === "SELL");
      let finalSignal = buy.length >= sell.length ? "BUY" : "SELL";
      let relevantSignals = signals.filter(s => s.signal === finalSignal);
      let avgPercent = Math.round(
        relevantSignals.reduce((a, b) => a + b.percent, 0) / relevantSignals.length
      );
      html += `
        <li>
          <span>${pair}:</span>
          <span class="${finalSignal === 'BUY' ? 'buy' : 'sell'}">${finalSignal} ${avgPercent}%</span>
        </li>
      `;
    }
  });
  if (!html) html = '<li style="color: #888;">No pairs meet the criteria.</li>';
  return html;
}

renderSignals();
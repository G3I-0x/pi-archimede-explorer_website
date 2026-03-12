// ============================================================
//  pi_archimede_pro.js
//  Logica principale: calcoli, grafico convergenza, canvas geo
// ============================================================

const slider    = document.getElementById('slider');
const nDisplay  = document.getElementById('nDisplay');
const valIns    = document.getElementById('valIns');
const valCir    = document.getElementById('valCir');
const valGap    = document.getElementById('valGap');
const gapFill   = document.getElementById('gapFill');
const gapDigits = document.getElementById('gapDigits');

// ---- Convergence Chart (Chart.js) ----
const convCtx = document.getElementById('convChart').getContext('2d');
const convChart = new Chart(convCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Inscritto',
        data: [],
        borderColor: '#1f77b4',
        backgroundColor: 'rgba(31,119,180,0.08)',
        borderWidth: 2.5,
        pointRadius: 0,
        fill: false,
        tension: 0.3
      },
      {
        label: 'Circoscritto',
        data: [],
        borderColor: '#d62728',
        backgroundColor: 'rgba(214,39,40,0.08)',
        borderWidth: 2.5,
        pointRadius: 0,
        fill: false,
        tension: 0.3
      },
      {
        label: 'π Reale',
        data: [],
        borderColor: '#2ca02c',
        borderDash: [8, 4],
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 180 },
    plugins: {
      legend: {
        labels: {
          font: { family: 'Nunito', size: 12 },
          color: '#4a5568',
          boxWidth: 18
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#a0aec0', font: { family: 'Nunito', size: 10 }, maxTicksLimit: 8 },
        grid:  { color: '#edf2f7' }
      },
      y: {
        ticks: { color: '#a0aec0', font: { family: 'Nunito', size: 10 } },
        grid:  { color: '#edf2f7' }
      }
    }
  }
});

// ---- Geometric Canvas (Canvas 2D API) ----
function drawGeo(n) {
  const canvas = document.getElementById('geoCanvas');
  // Read the CSS-rendered size (percentage-based) and apply it to canvas pixels
  const rect = canvas.getBoundingClientRect();
  const W = canvas.width  = Math.round(rect.width)  || 320;
  const H = canvas.height = Math.round(rect.height) || 240;
  const ctx = canvas.getContext('2d');

  // Leave room for the legend at the bottom and a small margin on all sides
  const LEGEND_H = 56;
  const MARGIN   = 12;
  const drawH    = H - LEGEND_H - MARGIN;
  const cx = W / 2;
  const cy = MARGIN + drawH / 2;

  // Inscribed circle radius — sized so the CIRCUMSCRIBED polygon fits inside
  // rCir = R / cos(π/n), so we reserve that extra space:
  const maxR = Math.min(W / 2, drawH / 2) * 0.82;
  const R    = maxR * Math.cos(Math.PI / n); // shrink so circum poly stays inside

  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#f7fafc';
  ctx.fillRect(0, 0, W, H);

  // ── Circumscribed polygon (drawn FIRST so inscribed appears on top) ──
  // Vertices are at distance rCir = R / cos(π/n) from centre.
  // We rotate by -π/2 so the flat edge is at the top (same orientation as inscribed).
  const rCir = R / Math.cos(Math.PI / n);
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i / n) - Math.PI / 2;
    const x = cx + rCir * Math.cos(a);
    const y = cy + rCir * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle   = 'rgba(214,39,40,0.07)';
  ctx.fill();
  ctx.strokeStyle = '#d62728';
  ctx.lineWidth   = 2;
  ctx.stroke();

  // ── Circle (dashed green) — tangent to sides of circumscribed poly ──
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, 2 * Math.PI);
  ctx.strokeStyle = '#2ca02c';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── Inscribed polygon — vertices exactly ON the circle ──
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i / n) - Math.PI / 2;
    const x = cx + R * Math.cos(a);
    const y = cy + R * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle   = 'rgba(31,119,180,0.10)';
  ctx.fill();
  ctx.strokeStyle = '#1f77b4';
  ctx.lineWidth   = 2.5;
  ctx.stroke();

  // ── Legend (bottom strip) ──
  const legendItems = [
    { color: '#1f77b4', label: 'Inscritto',    dash: false },
    { color: '#d62728', label: 'Circoscritto', dash: false },
    { color: '#2ca02c', label: 'Cerchio',      dash: true  }
  ];
  const legendY = H - LEGEND_H + 10;
  const colW    = W / 3;
  legendItems.forEach((item, i) => {
    const lx = i * colW + 10;
    const ly = legendY;
    ctx.save();
    ctx.setLineDash(item.dash ? [5, 3] : []);
    ctx.strokeStyle = item.color;
    ctx.lineWidth   = 2.5;
    ctx.beginPath();
    ctx.moveTo(lx, ly + 6);
    ctx.lineTo(lx + 20, ly + 6);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#4a5568';
    ctx.font      = 'bold 11px Nunito, sans-serif';
    ctx.fillText(item.label, lx + 26, ly + 10);
  });
}

// ---- Utilities ----

/** Trigger CSS flash animation on a result card value */
function flash(el) {
  el.classList.remove('flash');
  void el.offsetWidth; // force reflow
  el.classList.add('flash');
}

/** Update the green fill of the range input */
function updateSliderFill(val, min, max) {
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background =
    `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${pct}%, #d4edda ${pct}%, #d4edda 100%)`;
}

// ---- Main update — called on every slider move / button click ----
function update() {
  const n = parseInt(slider.value);
  nDisplay.textContent = n;
  updateSliderFill(n, 3, 100);

  // Archimedes calculations
  const ang = Math.PI / n;
  const ins = n * Math.sin(ang);
  const cir = n * Math.tan(ang);
  const gap = cir - ins;

  valIns.textContent = ins.toFixed(15);
  valCir.textContent = cir.toFixed(15);
  valGap.textContent = gap.toFixed(15);
  flash(valIns);
  flash(valCir);
  flash(valGap);

  // Precision bar — maps number of correct decimal digits to 0-100 %
  const digits = gap > 0 ? Math.max(0, -Math.log10(gap / Math.PI)) : 15;
  const pct    = Math.min(100, (digits / 6) * 100);
  gapFill.style.width      = pct.toFixed(1) + '%';
  gapDigits.textContent    = '~' + Math.floor(digits) + ' cifre';

  // Update convergence chart
  const maxPts = Math.min(n, 100);
  const labels = [], yIns = [], yCir = [], yPi = [];
  for (let i = 3; i <= maxPts; i++) {
    labels.push(i);
    yIns.push(i * Math.sin(Math.PI / i));
    yCir.push(i * Math.tan(Math.PI / i));
    yPi.push(Math.PI);
  }
  convChart.data.labels           = labels;
  convChart.data.datasets[0].data = yIns;
  convChart.data.datasets[1].data = yCir;
  convChart.data.datasets[2].data = yPi;
  convChart.update();

  // Update geometric drawing
  drawGeo(n);

  // Highlight the matching preset button
  document.querySelectorAll('.preset-btn').forEach(b => {
    const bVal = parseInt(b.textContent.replace('n=', ''));
    b.classList.toggle('active', bVal === n);
  });
}

/** Called by preset buttons in the HTML */
function setN(val) {
  slider.value = val;
  update();
}

// ---- Event listeners ----
slider.addEventListener('input', update);
window.addEventListener('resize', () => {
  if (parseInt(slider.value)) drawGeo(parseInt(slider.value));
});

// First render on page load
update();

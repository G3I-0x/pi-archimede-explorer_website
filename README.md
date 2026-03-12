# π Archimede Explorer — Web Edition

> Il mio primo progetto! Un sito interattivo che calcola π usando il metodo dei poligoni inscritti e circoscritti di Archimede (250 a.C.)

🔗 **Demo live:** `https://TUO-USERNAME.github.io/pi-archimede-explorer/pi_archimede_pro.html`

---

## 💡 Come funziona?

Archimede scoprì che π si trova **tra** il perimetro di un poligono inscritto nel cerchio e quello di un poligono circoscritto:

```
Poligono Inscritto  <  π  <  Poligono Circoscritto
```

Più lati ha il poligono, più i due valori convergono a π.
Con **n = 96 lati** (il valore di Archimede) si ottiene:

```
3.14103...  <  π  <  3.14271...
```

---

## ✨ Funzionalità

| | |
|--|--|
| 🎚️ Slider interattivo | Da 3 a 100 lati, aggiornamento in tempo reale |
| ⚡ Preset rapidi | n = 3, 6, 12, 24, 48, **96 ★**, 100 |
| 🔢 Risultati a 15 decimali | Inscritto, Circoscritto, π reale, Gap |
| 📊 Grafico di convergenza | Come i due valori si avvicinano a π |
| 🔵 Visualizzazione geometrica | Poligono inscritto + circoscritto + cerchio |
| 📱 Responsive | Funziona su telefono, tablet e desktop |

---

## 📁 File

```
pi_archimede_pro.html   ← struttura della pagina
pi_archimede_pro.css    ← stili e responsive design
pi_archimede_pro.js     ← calcoli, grafici, canvas geometrico
```

---

## 🛠️ Tecnologie

- HTML5 + CSS3 (`clamp()`, `aspect-ratio`, Grid, Flexbox)
- Vanilla JavaScript
- [Chart.js](https://www.chartjs.org/) — grafico di convergenza
- Canvas 2D API — visualizzazione geometrica
- Google Fonts: **Nunito** + **Caveat**

---

## 📐 Formula

```
Inscritto:    π ≈ n · sin(π/n)
Circoscritto: π ≈ n · tan(π/n)
```

---

*Fatto con ❤️ come primo progetto — lascia una ⭐ se ti è piaciuto!*

# CO₂ Entertainment Impact

## 🌐 Sito live

**[Apri direttamente il sito pubblicato](https://shaos94.github.io/co2-entertainment-impact/)**

> URL: https://shaos94.github.io/co2-entertainment-impact/

Single-page app statica in React, TypeScript e Vite per confrontare in modo didattico l'impatto CO₂e di dieta, attività, festival ed esperienze di intrattenimento.

## Funzioni principali

- scala comparativa in kg CO₂e;
- selezione di dieta e attività;
- configurazione del Kappa FuturFestival per durata e profilo del partecipante;
- confronto con festival, eventi low-carbon e viaggi aerei;
- fonti e metodologia accessibili dal sito.

## Stack

- React
- TypeScript
- Vite
- CSS semplice
- GitHub Pages
- GitHub Actions

## Comandi locali

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deploy

Il sito è configurato per GitHub Pages con:

```ts
base: '/co2-entertainment-impact/'
```

Il workflow `.github/workflows/deploy.yml` pubblica la cartella `dist`.

## Nota dati

I valori CO₂e includono dati documentati, proxy e scenari didattici. Le stime non ufficiali sono dichiarate nell'interfaccia e nella metodologia.

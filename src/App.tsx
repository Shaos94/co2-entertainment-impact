import { useMemo, useState } from 'react'

type DietKey = 'vegan' | 'vegetarian' | 'flexitarian' | 'omnivore' | 'carnivore'
type ActivityKey = 'gaming' | 'climbing' | 'trekking'

type DietOption = {
  key: DietKey
  label: string
  description: string
  weeklyKgCo2e: number
}

type ActivityOption = {
  key: ActivityKey
  label: string
  description: string
  kgCo2e: number
  unit: string
}

type ChartRow = {
  label: string
  value: number
  detail: string
}

const diets: DietOption[] = [
  {
    key: 'vegan',
    label: 'Vegana',
    description: 'Solo alimenti vegetali. Valore dimostrativo basso.',
    weeklyKgCo2e: 14,
  },
  {
    key: 'vegetarian',
    label: 'Vegetariana',
    description: 'Vegetale con latticini e uova. Valore dimostrativo medio-basso.',
    weeklyKgCo2e: 18,
  },
  {
    key: 'flexitarian',
    label: 'Flexitariana',
    description: 'Prevalenza vegetale, con pollo e suino in consumo moderato.',
    weeklyKgCo2e: 23,
  },
  {
    key: 'omnivore',
    label: 'Onnivora',
    description: 'Dieta mista con carne, pesce, latticini e alimenti vegetali.',
    weeklyKgCo2e: 31,
  },
  {
    key: 'carnivore',
    label: 'Carnivora',
    description: 'Forte prevalenza di prodotti animali. Scenario dimostrativo alto.',
    weeklyKgCo2e: 45,
  },
]

const activities: ActivityOption[] = [
  {
    key: 'gaming',
    label: 'Weekend gaming online',
    description: 'Due giornate con sessioni online, consumo elettrico e rete stimati.',
    kgCo2e: 4.8,
    unit: 'weekend',
  },
  {
    key: 'climbing',
    label: 'Giornata ad arrampicare',
    description: 'Palestra o falesia vicina, attrezzatura esclusa, trasporto leggero stimato.',
    kgCo2e: 6.2,
    unit: 'giornata',
  },
  {
    key: 'trekking',
    label: 'Giornata di trekking',
    description: 'Escursione giornaliera con spostamento regionale stimato.',
    kgCo2e: 8.1,
    unit: 'giornata',
  },
]

const intercontinentalTripKgCo2e = 1800

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')} kg CO₂e`
}

function formatNumber(value: number): string {
  return value.toFixed(1).replace('.', ',')
}

function getBarWidth(value: number, max: number): string {
  if (value <= 0 || max <= 0) {
    return '0%'
  }

  return `${Math.max((value / max) * 100, 3)}%`
}

function App() {
  const [selectedDietKey, setSelectedDietKey] = useState<DietKey>('flexitarian')
  const [selectedActivityKeys, setSelectedActivityKeys] = useState<ActivityKey[]>([
    'gaming',
    'climbing',
    'trekking',
  ])

  const selectedDiet = diets.find((diet) => diet.key === selectedDietKey) ?? diets[2]

  const selectedActivities = activities.filter((activity) =>
    selectedActivityKeys.includes(activity.key),
  )

  const activityTotal = selectedActivities.reduce((sum, item) => sum + item.kgCo2e, 0)
  const total = selectedDiet.weeklyKgCo2e + activityTotal
  const comparisonPercent = (total / intercontinentalTripKgCo2e) * 100
  const equivalentWeeks = intercontinentalTripKgCo2e / Math.max(total, 0.1)

  const highestActivity = selectedActivities.length
    ? [...selectedActivities].sort((a, b) => b.kgCo2e - a.kgCo2e)[0]
    : null

  const breakdownRows: ChartRow[] = useMemo(
    () => [
      {
        label: 'Dieta selezionata',
        value: selectedDiet.weeklyKgCo2e,
        detail: selectedDiet.label,
      },
      {
        label: 'Attività selezionate',
        value: activityTotal,
        detail: `${selectedActivities.length} attività`,
      },
    ],
    [activityTotal, selectedActivities.length, selectedDiet],
  )

  const comparisonRows: ChartRow[] = useMemo(
    () => [
      {
        label: 'Tuo scenario',
        value: total,
        detail: 'Dieta + attività',
      },
      {
        label: 'Viaggio intercontinentale A/R',
        value: intercontinentalTripKgCo2e,
        detail: 'Benchmark dimostrativo',
      },
    ],
    [total],
  )

  const toggleActivity = (activityKey: ActivityKey) => {
    setSelectedActivityKeys((currentKeys) =>
      currentKeys.includes(activityKey)
        ? currentKeys.filter((key) => key !== activityKey)
        : [...currentKeys, activityKey],
    )
  }

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <div className="eyebrow">Mockup desktop + mobile</div>
          <h1 id="page-title">Quanto pesa il tuo intrattenimento?</h1>
          <p>
            Confronta una settimana tipo sommando dieta, attività del tempo libero e
            benchmark di viaggio. I valori sono segnaposto: servono a validare
            interfaccia e ragionamento prima della ricerca dati definitiva.
          </p>
        </div>

        <aside className="panel hero-card" aria-label="Risultato principale">
          <span className="label">Scenario attivo</span>
          <strong>{formatKg(total)}</strong>
          <p>
            Circa {formatNumber(comparisonPercent)}% di un viaggio intercontinentale
            andata e ritorno.
          </p>
        </aside>
      </section>

      <section className="desktop-dashboard" aria-label="Calcolatore interattivo">
        <div className="control-column">
          <article className="panel control-panel">
            <div className="section-title">
              <span className="label">Paniere dieta</span>
              <h2>Scegli uno stile alimentare</h2>
              <p>Ogni pulsante aggiorna subito totale, insight e grafici.</p>
            </div>

            <div className="cards" role="list">
              {diets.map((diet) => (
                <button
                  aria-pressed={diet.key === selectedDiet.key}
                  className={`card ${diet.key === selectedDiet.key ? 'selected' : ''}`}
                  key={diet.key}
                  onClick={() => setSelectedDietKey(diet.key)}
                  type="button"
                >
                  <span>{diet.label}</span>
                  <strong>{formatKg(diet.weeklyKgCo2e)}</strong>
                  <small>{diet.description}</small>
                </button>
              ))}
            </div>
          </article>

          <article className="panel control-panel">
            <div className="section-title">
              <span className="label">Attività</span>
              <h2>Weekend e outdoor</h2>
              <p>Attiva o disattiva le attività per vedere come cambia il risultato.</p>
            </div>

            <div className="activity-list">
              {activities.map((activity) => (
                <label className="activity" key={activity.key}>
                  <input
                    checked={selectedActivityKeys.includes(activity.key)}
                    onChange={() => toggleActivity(activity.key)}
                    type="checkbox"
                  />
                  <span>
                    <strong>{activity.label}</strong>
                    <small>{activity.description}</small>
                  </span>
                  <em>{formatKg(activity.kgCo2e)}</em>
                </label>
              ))}
            </div>
          </article>
        </div>

        <div className="results-column">
          <section className="panel summary" aria-label="Sintesi impatto stimato">
            <div>
              <span className="label">Totale stimato</span>
              <h2>{formatKg(total)}</h2>
              <p>
                {selectedDiet.label}
                {selectedActivities.length > 0
                  ? ` + ${selectedActivities.map((activity) => activity.label).join(' + ')}`
                  : ' senza attività extra'}
              </p>
            </div>
            <div className="score" aria-hidden="true">
              <span>{Math.round(total)}</span>
              <small>kg</small>
            </div>
          </section>

          <section className="panel chart-panel" aria-label="Grafico composizione scenario">
            <div className="section-title compact-title">
              <span className="label">Grafico 1</span>
              <h2>Composizione dello scenario</h2>
            </div>

            <div className="bar-chart">
              {breakdownRows.map((row) => (
                <div className="bar-row" key={row.label}>
                  <div className="bar-heading">
                    <span>{row.label}</span>
                    <strong>{formatKg(row.value)}</strong>
                  </div>
                  <div className="bar-track" aria-hidden="true">
                    <div
                      className="bar-fill"
                      style={{ width: getBarWidth(row.value, total) }}
                    />
                  </div>
                  <small>{row.detail}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="panel chart-panel" aria-label="Grafico confronto viaggio intercontinentale">
            <div className="section-title compact-title">
              <span className="label">Grafico 2</span>
              <h2>Confronto con viaggio intercontinentale</h2>
              <p>
                Il benchmark è volutamente grande per dare scala al risultato.
              </p>
            </div>

            <div className="bar-chart comparison-chart">
              {comparisonRows.map((row) => (
                <div className="bar-row" key={row.label}>
                  <div className="bar-heading">
                    <span>{row.label}</span>
                    <strong>{formatKg(row.value)}</strong>
                  </div>
                  <div className="bar-track" aria-hidden="true">
                    <div
                      className="bar-fill"
                      style={{ width: getBarWidth(row.value, intercontinentalTripKgCo2e) }}
                    />
                  </div>
                  <small>{row.detail}</small>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="insight-grid" aria-label="Insight principali">
        <article className="panel insight">
          <span className="label">Lettura rapida</span>
          <h2>
            {highestActivity
              ? `Attività più pesante: ${highestActivity.label}`
              : 'Nessuna attività extra selezionata'}
          </h2>
          <p>
            Il sito ora mostra quale scelta sposta il risultato, non solo il totale.
            Questo rende il confronto più leggibile per utenti non tecnici.
          </p>
        </article>

        <article className="panel insight benchmark-card">
          <span className="label">Scala del confronto</span>
          <h2>{Math.round(equivalentWeeks)} settimane simili</h2>
          <p>
            Con questo scenario servirebbero circa {Math.round(equivalentWeeks)} settimane
            per raggiungere il benchmark dimostrativo del viaggio intercontinentale A/R.
          </p>
        </article>
      </section>

      <section className="notes" aria-label="Note metodologiche">
        <h2>Note metodologiche</h2>
        <ol>
          <li>I valori CO₂e sono dimostrativi e vanno sostituiti con fonti documentate.</li>
          <li>Il viaggio intercontinentale è un benchmark editoriale, non una stima definitiva.</li>
          <li>La priorità ora è testare UX desktop, mobile e comprensione dei grafici.</li>
        </ol>
      </section>
    </main>
  )
}

export default App

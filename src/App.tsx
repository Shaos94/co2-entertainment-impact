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

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')} kg CO₂e`
}

function App() {
  const selectedDiet = diets[2]
  const selectedActivities = activities
  const activityTotal = selectedActivities.reduce((sum, item) => sum + item.kgCo2e, 0)
  const total = selectedDiet.weeklyKgCo2e + activityTotal
  const highestActivity = [...selectedActivities].sort((a, b) => b.kgCo2e - a.kgCo2e)[0]

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow">Mockup mobile-first</div>
        <h1 id="page-title">Quanto pesa il tuo intrattenimento?</h1>
        <p>
          Confronta una settimana tipo sommando dieta e attività del tempo libero.
          I valori sono segnaposto: servono a validare interfaccia, gerarchia visiva
          e flusso utente prima della ricerca dati definitiva.
        </p>
      </section>

      <section className="panel summary" aria-label="Sintesi impatto stimato">
        <div>
          <span className="label">Scenario selezionato</span>
          <h2>{formatKg(total)}</h2>
          <p>Dieta flexitariana + gaming online + arrampicata + trekking.</p>
        </div>
        <div className="score" aria-hidden="true">
          <span>{Math.round(total)}</span>
          <small>kg</small>
        </div>
      </section>

      <section className="grid" aria-label="Scelte disponibili">
        <article className="panel">
          <div className="section-title">
            <span className="label">Paniere dieta</span>
            <h2>Scegli uno stile alimentare</h2>
          </div>
          <div className="cards">
            {diets.map((diet) => (
              <button
                className={`card ${diet.key === selectedDiet.key ? 'selected' : ''}`}
                key={diet.key}
                type="button"
              >
                <span>{diet.label}</span>
                <strong>{formatKg(diet.weeklyKgCo2e)}</strong>
                <small>{diet.description}</small>
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-title">
            <span className="label">Attività</span>
            <h2>Weekend e outdoor</h2>
          </div>
          <div className="activity-list">
            {activities.map((activity) => (
              <label className="activity" key={activity.key}>
                <input type="checkbox" checked readOnly />
                <span>
                  <strong>{activity.label}</strong>
                  <small>{activity.description}</small>
                </span>
                <em>{formatKg(activity.kgCo2e)}</em>
              </label>
            ))}
          </div>
        </article>
      </section>

      <section className="panel insight" aria-label="Insight principale">
        <span className="label">Lettura rapida</span>
        <h2>Nel mockup, l’attività più pesante è: {highestActivity.label}</h2>
        <p>
          Questo è il punto da rendere evidente nella versione finale: non solo il totale,
          ma quale scelta sposta davvero il risultato. È più utile per utenti non tecnici.
        </p>
      </section>

      <section className="notes" aria-label="Note metodologiche">
        <h2>Prossimi passaggi</h2>
        <ol>
          <li>Sostituire i valori dimostrativi con fonti documentate.</li>
          <li>Aggiungere controlli reali per durata, trasporto e mix energetico.</li>
          <li>Validare leggibilità da telefono prima di aumentare la complessità.</li>
        </ol>
      </section>
    </main>
  )
}

export default App

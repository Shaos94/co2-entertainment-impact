import { useMemo, useRef, useState } from 'react'

type DietKey = 'vegan' | 'vegetarian' | 'flexitarian' | 'omnivore' | 'carnivore'
type ActivityKey = 'gaming' | 'climbing' | 'trekking'
type ExtraKey =
  | 'festivalLocal'
  | 'kappaLocal'
  | 'kappaNational'
  | 'kappaInternational'
  | 'massiveAttackLowCarbon'
  | 'flightEurope'
  | 'flightIntercontinental'

type ScaleKey = 'diet' | ActivityKey | ExtraKey

type SourceId =
  | 'scarborough'
  | 'carbonTrust'
  | 'defra'
  | 'icao'
  | 'agf'
  | 'kappaAttendance'
  | 'tyndallLive'

type DietOption = {
  key: DietKey
  label: string
  description: string
  weeklyKgCo2e: number
  sourceId: SourceId
}

type ScaleItem = {
  key: ScaleKey
  label: string
  description: string
  kgCo2e: number
  category: 'Dieta' | 'Attività' | 'Festival' | 'Viaggi'
  sourceId: SourceId
  note: string
}

type Source = {
  id: SourceId
  title: string
  use: string
  url: string
}

const sources: Source[] = [
  {
    id: 'scarborough',
    title: 'Scarborough et al., Climatic Change / sintesi Low-carbon diet',
    use: 'Fattori dieta: kg CO₂e/giorno convertiti in kg CO₂e/settimana.',
    url: 'https://en.wikipedia.org/wiki/Low-carbon_diet',
  },
  {
    id: 'carbonTrust',
    title: 'Carbon Trust / stime streaming video',
    use: 'Ordine di grandezza per attività digitali: streaming ~55-56 g CO₂e/ora in media europea.',
    url: 'https://www.theguardian.com/tv-and-radio/2021/oct/29/streamings-dirty-secret-how-viewing-netflix-top-10-creates-vast-quantity-of-co2',
  },
  {
    id: 'defra',
    title: 'UK Government GHG Conversion Factors',
    use: 'Metodo per convertire attività fisiche in emissioni: kWh, distanza percorsa, fuel, viaggi.',
    url: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting',
  },
  {
    id: 'icao',
    title: 'ICAO Carbon Emissions Calculator',
    use: 'Riferimento metodologico per voli passeggeri e benchmark di viaggio.',
    url: 'https://www.icao.int/environmental-protection/CarbonOffset/Pages/default.aspx',
  },
  {
    id: 'agf',
    title: 'A Greener Future',
    use: 'Riferimento eventi live, festival, CO₂, net zero, certificazione e report sostenibilità.',
    url: 'https://www.agreenerfuture.com/',
  },
  {
    id: 'kappaAttendance',
    title: 'Kappa FuturFestival — dati pubblici di attendance',
    use: 'Contesto: edizione 2024 con circa 115.000 presenze da 157 nazioni; 2025 circa 120.000 da 150 paesi.',
    url: 'https://it.wikipedia.org/wiki/Kappa_FuturFestival',
  },
  {
    id: 'tyndallLive',
    title: 'Tyndall Centre / Massive Attack Act 1.5',
    use: 'Assunzione settore live: il trasporto del pubblico può pesare circa l’80% delle emissioni di un evento live.',
    url: 'https://www.musicradar.com/artists/festivals-generate-25-800-tonnes-of-waste-22-876-tonnes-of-co2-and-use-185-million-litres-of-water-annually-how-massive-attack-set-a-new-benchmark-for-the-future-of-sustainable-live-music-events',
  },
]

const diets: DietOption[] = [
  {
    key: 'vegan',
    label: 'Vegana',
    description: 'Scenario basso: 2,89 kg CO₂e/giorno × 7.',
    weeklyKgCo2e: 20.2,
    sourceId: 'scarborough',
  },
  {
    key: 'vegetarian',
    label: 'Vegetariana',
    description: 'Scenario medio-basso: 3,81 kg CO₂e/giorno × 7.',
    weeklyKgCo2e: 26.7,
    sourceId: 'scarborough',
  },
  {
    key: 'flexitarian',
    label: 'Flexitariana',
    description: 'Proxy low-meat: prevalenza vegetale, pollo e suino moderati.',
    weeklyKgCo2e: 32.7,
    sourceId: 'scarborough',
  },
  {
    key: 'omnivore',
    label: 'Onnivora',
    description: 'Proxy medium-meat: dieta mista con carne, pesce e latticini.',
    weeklyKgCo2e: 39.4,
    sourceId: 'scarborough',
  },
  {
    key: 'carnivore',
    label: 'Carnivora',
    description: 'Proxy high-meat: forte prevalenza di prodotti animali.',
    weeklyKgCo2e: 50.3,
    sourceId: 'scarborough',
  },
]

const activityItems: ScaleItem[] = [
  {
    key: 'gaming',
    label: 'Weekend gaming online',
    description: 'Stima didattica per sessioni online, dispositivo, schermo e rete.',
    kgCo2e: 2.4,
    category: 'Attività',
    sourceId: 'carbonTrust',
    note: 'Proxy prudente: streaming + consumo hardware. Da raffinare con watt reali del setup.',
  },
  {
    key: 'climbing',
    label: 'Giornata ad arrampicare',
    description: 'Palestra o falesia vicina, con spostamento regionale leggero.',
    kgCo2e: 6.2,
    category: 'Attività',
    sourceId: 'defra',
    note: 'La parte dominante è il trasporto; attrezzatura esclusa.',
  },
  {
    key: 'trekking',
    label: 'Giornata di trekking',
    description: 'Escursione giornaliera con spostamento regionale.',
    kgCo2e: 8.1,
    category: 'Attività',
    sourceId: 'defra',
    note: 'Proxy basato su chilometri percorsi; da sostituire con origine/destinazione reali.',
  },
]

const extraItems: ScaleItem[] = [
  {
    key: 'festivalLocal',
    label: 'Festival locale — 1 giorno',
    description: 'Evento locale con trasporto pubblico o breve spostamento urbano.',
    kgCo2e: 18,
    category: 'Festival',
    sourceId: 'agf',
    note: 'Scenario didattico: energia, servizi, food, rifiuti e breve mobilità.',
  },
  {
    key: 'kappaLocal',
    label: 'Kappa FuturFestival — partecipante locale',
    description: 'Scenario Torino/area vicina, senza viaggio lungo.',
    kgCo2e: 25,
    category: 'Festival',
    sourceId: 'kappaAttendance',
    note: 'Stima, non dato ufficiale Kappa: usa KFF come caso didattico e AGF/Tyndall per metodo.',
  },
  {
    key: 'kappaNational',
    label: 'Kappa FuturFestival — partecipante nazionale',
    description: 'Scenario Italia: treno/auto + quota evento.',
    kgCo2e: 90,
    category: 'Festival',
    sourceId: 'kappaAttendance',
    note: 'Stima: il trasporto pesa molto più di audio/luci/servizi.',
  },
  {
    key: 'kappaInternational',
    label: 'Kappa FuturFestival — partecipante internazionale',
    description: 'Scenario con volo europeo + quota evento.',
    kgCo2e: 420,
    category: 'Festival',
    sourceId: 'tyndallLive',
    note: 'Stima: KFF ha pubblico internazionale; non è un dato ufficiale per partecipante.',
  },
  {
    key: 'massiveAttackLowCarbon',
    label: 'Evento low-carbon locale — Act 1.5',
    description: 'Benchmark evento progettato per ridurre energia, food, rifiuti e trasporto.',
    kgCo2e: 6,
    category: 'Festival',
    sourceId: 'tyndallLive',
    note: 'Ordine di grandezza didattico per mostrare cosa cambia con vincoli di mobilità locale.',
  },
  {
    key: 'flightEurope',
    label: 'Volo europeo A/R',
    description: 'Benchmark viaggio breve-medio in Europa.',
    kgCo2e: 350,
    category: 'Viaggi',
    sourceId: 'icao',
    note: 'Valore dimostrativo; nella versione finale va calcolato per rotta.',
  },
  {
    key: 'flightIntercontinental',
    label: 'Volo intercontinentale A/R',
    description: 'Benchmark grande per dare scala al resto delle scelte.',
    kgCo2e: 1800,
    category: 'Viaggi',
    sourceId: 'icao',
    note: 'Valore dimostrativo; nella versione finale va calcolato con rotta e classe.',
  },
]

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')} kg CO₂e`
}

function formatInteger(value: number): string {
  return Math.round(value).toLocaleString('it-IT')
}

function getBarWidth(value: number, max: number): string {
  return `${Math.max((value / max) * 100, 2)}%`
}

function App() {
  const methodologyDialogRef = useRef<HTMLDialogElement>(null)
  const [selectedDietKey, setSelectedDietKey] = useState<DietKey>('flexitarian')
  const [includedKeys, setIncludedKeys] = useState<ScaleKey[]>([
    'diet',
    'gaming',
    'climbing',
    'trekking',
    'kappaLocal',
    'kappaInternational',
    'flightIntercontinental',
  ])

  const selectedDiet = diets.find((diet) => diet.key === selectedDietKey) ?? diets[2]
  const dietScaleItem: ScaleItem = {
    key: 'diet',
    label: `Dieta ${selectedDiet.label.toLowerCase()} — 1 settimana`,
    description: selectedDiet.description,
    kgCo2e: selectedDiet.weeklyKgCo2e,
    category: 'Dieta',
    sourceId: selectedDiet.sourceId,
    note: 'Valore giornaliero convertito in settimana. La dieta può essere esclusa dalla scala.',
  }

  const allScaleItems = [dietScaleItem, ...activityItems, ...extraItems]
  const activeScaleItems = allScaleItems.filter((item) => includedKeys.includes(item.key))
  const scenarioTotal = activeScaleItems.reduce((sum, item) => sum + item.kgCo2e, 0)
  const maxScaleValue = Math.max(scenarioTotal, ...activeScaleItems.map((item) => item.kgCo2e), 1)

  const groupedItems = useMemo(
    () => [
      { title: 'Dieta', items: [dietScaleItem] },
      { title: 'Attività quotidiane', items: activityItems },
      { title: 'Festival ed eventi', items: extraItems.filter((item) => item.category === 'Festival') },
      { title: 'Viaggi benchmark', items: extraItems.filter((item) => item.category === 'Viaggi') },
    ],
    [dietScaleItem],
  )

  const mainSourceIds = Array.from(new Set(activeScaleItems.map((item) => item.sourceId)))
  const selectedSources = sources.filter((source) => mainSourceIds.includes(source.id))

  const toggleScaleItem = (key: ScaleKey) => {
    setIncludedKeys((currentKeys) =>
      currentKeys.includes(key)
        ? currentKeys.filter((currentKey) => currentKey !== key)
        : [...currentKeys, key],
    )
  }

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <div className="eyebrow">Sito didattico desktop</div>
          <h1 id="page-title">Una scala per capire la CO₂ delle scelte culturali</h1>
          <p>
            Attiva o rimuovi dieta, gaming, outdoor, festival e viaggi. La scala principale
            mostra subito quanto pesa ogni scelta rispetto alle altre.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => methodologyDialogRef.current?.showModal()}>
              Apri metodologia
            </button>
            <a href="#sources">Vedi fonti</a>
          </div>
        </div>

        <aside className="panel hero-card" aria-label="Somma elementi attivi">
          <span className="label">Somma elementi attivi</span>
          <strong>{formatKg(scenarioTotal)}</strong>
          <p>{activeScaleItems.length} elementi inclusi nella scala principale.</p>
        </aside>
      </section>

      <section className="teaching-layout" aria-label="Scala didattica interattiva">
        <aside className="panel control-panel">
          <div className="section-title">
            <span className="label">Controlli</span>
            <h2>Scegli cosa entra nella scala</h2>
            <p>Puoi togliere anche la dieta: il grafico si ricalcola senza quel blocco.</p>
          </div>

          <div className="diet-picker" aria-label="Selezione dieta">
            {diets.map((diet) => (
              <button
                aria-pressed={diet.key === selectedDiet.key}
                className={`chip ${diet.key === selectedDiet.key ? 'selected' : ''}`}
                key={diet.key}
                onClick={() => setSelectedDietKey(diet.key)}
                type="button"
              >
                {diet.label}
              </button>
            ))}
          </div>

          <div className="toggle-groups">
            {groupedItems.map((group) => (
              <section className="toggle-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="toggle-list">
                  {group.items.map((item) => (
                    <label className="toggle-row" key={item.key}>
                      <input
                        checked={includedKeys.includes(item.key)}
                        onChange={() => toggleScaleItem(item.key)}
                        type="checkbox"
                      />
                      <span>
                        <strong>{item.label}</strong>
                        <small>{formatKg(item.kgCo2e)} · {item.description}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <section className="panel scale-panel" aria-label="Grafico scala principale">
          <div className="scale-header">
            <div>
              <span className="label">Scala principale</span>
              <h2>Confronto in kg CO₂e</h2>
              <p>Ogni barra resta confrontabile con il totale attivo e con il valore più grande selezionato.</p>
            </div>
            <div className="total-pill">
              <span>Totale</span>
              <strong>{formatKg(scenarioTotal)}</strong>
            </div>
          </div>

          <div className="scale-chart">
            <div className="scale-row total-row">
              <div className="scale-row-copy">
                <strong>Somma elementi attivi</strong>
                <span>{activeScaleItems.length} elementi selezionati</span>
              </div>
              <div className="scale-bar-wrap">
                <div className="scale-value">{formatKg(scenarioTotal)}</div>
                <div className="scale-track">
                  <div className="scale-fill" style={{ width: getBarWidth(scenarioTotal, maxScaleValue) }} />
                </div>
              </div>
            </div>

            {activeScaleItems.map((item) => {
              const source = sources.find((sourceItem) => sourceItem.id === item.sourceId)
              return (
                <article className="scale-row" key={item.key}>
                  <div className="scale-row-copy">
                    <strong>{item.label}</strong>
                    <span>{item.category} · {source?.title ?? 'Fonte da verificare'}</span>
                  </div>
                  <div className="scale-bar-wrap">
                    <div className="scale-value">{formatKg(item.kgCo2e)}</div>
                    <div className="scale-track">
                      <div className="scale-fill" style={{ width: getBarWidth(item.kgCo2e, maxScaleValue) }} />
                    </div>
                    <small>{item.note}</small>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </section>

      <section className="insight-grid" aria-label="Letture didattiche">
        <article className="panel insight">
          <span className="label">Lettura didattica</span>
          <h2>Il trasporto domina appena entriamo nei festival internazionali.</h2>
          <p>
            Per un festival come Kappa FuturFestival non basta guardare luci e audio:
            la differenza vera è se il partecipante arriva localmente, da un’altra città
            o da un altro paese.
          </p>
        </article>

        <article className="panel insight benchmark-card">
          <span className="label">Nota importante</span>
          <h2>Kappa è stimato, non misurato.</h2>
          <p>
            Non ho trovato un dato pubblico ufficiale “kg CO₂e per partecipante” per Kappa.
            Nel sito è indicato come scenario stimato e deve essere sostituito con report AGF/KFF se disponibile.
          </p>
        </article>
      </section>

      <section className="panel sources-panel" id="sources" aria-label="Fonti usate">
        <div className="section-title">
          <span className="label">Fonti</span>
          <h2>Fonti usate per i calcoli</h2>
          <p>Ogni dato della scala rimanda a una fonte o a una metodologia dichiarata.</p>
        </div>

        <div className="source-grid">
          {sources.map((source) => (
            <article className={`source-card ${selectedSources.includes(source) ? 'active' : ''}`} key={source.id}>
              <h3>{source.title}</h3>
              <p>{source.use}</p>
              <a href={source.url} rel="noreferrer" target="_blank">Apri fonte</a>
            </article>
          ))}
        </div>
      </section>

      <dialog className="method-dialog" ref={methodologyDialogRef}>
        <div className="dialog-content">
          <div className="dialog-header">
            <span className="label">Metodologia</span>
            <button type="button" onClick={() => methodologyDialogRef.current?.close()}>
              Chiudi
            </button>
          </div>
          <h2>Come vengono calcolati i valori</h2>
          <ol>
            <li>
              <strong>Diete.</strong> I valori giornalieri pubblicati per diversi profili alimentari
              sono convertiti in valori settimanali moltiplicando per 7. La categoria flexitariana
              usa il proxy “low meat”.
            </li>
            <li>
              <strong>Attività.</strong> Gaming, climbing e trekking sono proxy didattici.
              Per gaming si parte dall’ordine di grandezza dei consumi digitali; per outdoor
              il peso principale è il trasporto.
            </li>
            <li>
              <strong>Festival.</strong> Gli scenari festival separano quota evento e mobilità.
              Per Kappa FuturFestival i valori sono stime, perché non è emerso un dato pubblico
              ufficiale di kg CO₂e per partecipante.
            </li>
            <li>
              <strong>Viaggi.</strong> I voli sono benchmark di scala. Nella versione finale vanno calcolati
              per rotta, classe di viaggio, fattore di carico e metodo scelto.
            </li>
            <li>
              <strong>Uso didattico.</strong> Lo scopo non è dare numeri definitivi, ma mostrare ordini
              di grandezza e far capire quale scelta sposta davvero il risultato.
            </li>
          </ol>
        </div>
      </dialog>
    </main>
  )
}

export default App

import { useMemo, useRef, useState } from 'react'

type DietKey = 'vegan' | 'vegetarian' | 'flexitarian' | 'omnivore' | 'carnivore'
type ActivityKey = 'gaming' | 'climbing' | 'trekking'
type ConfigurableKey = 'kappa' | 'festivalLocal' | 'lowCarbonEvent'
type BenchmarkKey = 'flightEurope' | 'flightIntercontinental'
type ScaleKey = 'diet' | ActivityKey | ConfigurableKey | BenchmarkKey
type TravelProfileKey = 'local' | 'national' | 'international'
type DurationDays = 1 | 3

type SourceId =
  | 'scarborough'
  | 'carbonTrust'
  | 'defra'
  | 'icao'
  | 'agf'
  | 'kappaAttendance'
  | 'tyndallLive'
  | 'knowledgeSources'

type DietOption = {
  key: DietKey
  label: string
  description: string
  weeklyKgCo2e: number
  sourceId: SourceId
}

type Source = {
  id: SourceId
  title: string
  use: string
  url: string
}

type ScaleItem = {
  key: ScaleKey
  label: string
  eyebrow: string
  description: string
  kgCo2e: number
  sourceId: SourceId
  note: string
}

type StaticItem = {
  key: ActivityKey | BenchmarkKey
  label: string
  eyebrow: string
  description: string
  kgCo2e: number
  sourceId: SourceId
  note: string
}

const sources: Source[] = [
  {
    id: 'knowledgeSources',
    title: 'Knowledge interna — lista fonti utili CO₂e',
    use: 'Mappa delle fonti consigliate: IPCC EFDB, Our World in Data, ISPRA, ICAO, DEFRA, EcoPassenger, AGF, Vision:2025, JRC, Ecoinvent.',
    url: 'https://www.ipcc-nggip.iges.or.jp/EFDB/',
  },
  {
    id: 'scarborough',
    title: 'Scarborough et al. — impronta diete',
    use: 'Fattori dieta in kg CO₂e/giorno, convertiti in kg CO₂e/settimana.',
    url: 'https://en.wikipedia.org/wiki/Low-carbon_diet',
  },
  {
    id: 'carbonTrust',
    title: 'Carbon Trust — streaming e digitale',
    use: 'Ordine di grandezza per attività digitali e consumo di rete/dispositivo.',
    url: 'https://www.carbontrust.com/',
  },
  {
    id: 'defra',
    title: 'UK Government GHG Conversion Factors',
    use: 'Fattori di conversione per trasporti, energia, fuel e reporting climatico.',
    url: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting',
  },
  {
    id: 'icao',
    title: 'ICAO Carbon Emissions Calculator',
    use: 'Metodo per stimare emissioni passeggero su voli e benchmark di viaggio.',
    url: 'https://www.icao.int/environmental-protection/CarbonOffset/Pages/default.aspx',
  },
  {
    id: 'agf',
    title: 'A Greener Future / AGF',
    use: 'Riferimento per eventi, festival, certificazioni, energia, rifiuti e pubblico.',
    url: 'https://www.agreenerfuture.com/',
  },
  {
    id: 'kappaAttendance',
    title: 'Kappa FuturFestival — attendance pubblica',
    use: 'Contesto dimensionale: festival di 3 giorni, 115.000 presenze nel 2024 e 120.000 nel 2025 secondo fonti pubbliche.',
    url: 'https://it.wikipedia.org/wiki/Kappa_FuturFestival',
  },
  {
    id: 'tyndallLive',
    title: 'Tyndall Centre / Massive Attack Act 1.5',
    use: 'Metodo live event: mobilità del pubblico come driver dominante; esempio di evento low-carbon.',
    url: 'https://www.tyndall.ac.uk/',
  },
]

const diets: DietOption[] = [
  {
    key: 'vegan',
    label: 'Vegana',
    description: '2,89 kg CO₂e/giorno × 7.',
    weeklyKgCo2e: 20.2,
    sourceId: 'scarborough',
  },
  {
    key: 'vegetarian',
    label: 'Vegetariana',
    description: '3,81 kg CO₂e/giorno × 7.',
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
    description: 'Proxy medium-meat: dieta mista.',
    weeklyKgCo2e: 39.4,
    sourceId: 'scarborough',
  },
  {
    key: 'carnivore',
    label: 'Carnivora',
    description: 'Proxy high-meat: forte prevalenza animale.',
    weeklyKgCo2e: 50.3,
    sourceId: 'scarborough',
  },
]

const activityItems: StaticItem[] = [
  {
    key: 'gaming',
    label: 'Weekend gaming online',
    eyebrow: 'Attività',
    description: 'Sessioni online, dispositivo, schermo e rete.',
    kgCo2e: 2.4,
    sourceId: 'carbonTrust',
    note: 'Proxy conservativo. Da raffinare con watt reali del setup.',
  },
  {
    key: 'climbing',
    label: 'Arrampicata',
    eyebrow: 'Attività',
    description: 'Giornata in palestra o falesia vicina.',
    kgCo2e: 6.2,
    sourceId: 'defra',
    note: 'Driver principale: spostamento locale o regionale.',
  },
  {
    key: 'trekking',
    label: 'Trekking',
    eyebrow: 'Attività',
    description: 'Escursione giornaliera con spostamento regionale.',
    kgCo2e: 8.1,
    sourceId: 'defra',
    note: 'Proxy basato su trasporto; attrezzatura esclusa.',
  },
]

const benchmarkItems: StaticItem[] = [
  {
    key: 'flightEurope',
    label: 'Volo europeo A/R',
    eyebrow: 'Viaggio',
    description: 'Benchmark breve-medio in Europa.',
    kgCo2e: 350,
    sourceId: 'icao',
    note: 'Dato dimostrativo: in versione finale va calcolato per rotta.',
  },
  {
    key: 'flightIntercontinental',
    label: 'Volo intercontinentale A/R',
    eyebrow: 'Viaggio',
    description: 'Benchmark alto per dare scala agli altri valori.',
    kgCo2e: 1800,
    sourceId: 'icao',
    note: 'Dato dimostrativo: rotta e classe cambiano molto il risultato.',
  },
]

const kappaTravelProfiles: Record<TravelProfileKey, { label: string; travelKgCo2e: number; description: string }> = {
  local: {
    label: 'Locale',
    travelKgCo2e: 13,
    description: 'Torino o area vicina, trasporto urbano o regionale breve.',
  },
  national: {
    label: 'Nazionale',
    travelKgCo2e: 78,
    description: 'Partecipante dall’Italia, treno/auto + quota evento.',
  },
  international: {
    label: 'Internazionale',
    travelKgCo2e: 408,
    description: 'Partecipante estero con volo europeo + quota evento.',
  },
}

const kappaEventKgPerDay = 12
const localFestivalEventKgPerDay = 12
const localFestivalTravelKg = 6
const lowCarbonEventKgPerDay = 6

function getKappaKgCo2e(profile: TravelProfileKey, days: DurationDays): number {
  return kappaTravelProfiles[profile].travelKgCo2e + kappaEventKgPerDay * days
}

function getLocalFestivalKgCo2e(days: DurationDays): number {
  return localFestivalTravelKg + localFestivalEventKgPerDay * days
}

function getLowCarbonEventKgCo2e(days: DurationDays): number {
  return lowCarbonEventKgPerDay * days
}

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')} kg CO₂e`
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
    'kappa',
    'flightIntercontinental',
  ])
  const [kappaProfile, setKappaProfile] = useState<TravelProfileKey>('international')
  const [kappaDays, setKappaDays] = useState<DurationDays>(3)
  const [festivalDays, setFestivalDays] = useState<DurationDays>(1)
  const [lowCarbonDays, setLowCarbonDays] = useState<DurationDays>(1)

  const selectedDiet = diets.find((diet) => diet.key === selectedDietKey) ?? diets[2]
  const kappaKgCo2e = getKappaKgCo2e(kappaProfile, kappaDays)
  const localFestivalKgCo2e = getLocalFestivalKgCo2e(festivalDays)
  const lowCarbonKgCo2e = getLowCarbonEventKgCo2e(lowCarbonDays)

  const configurableItems: ScaleItem[] = [
    {
      key: 'kappa',
      label: `Kappa FuturFestival — ${kappaTravelProfiles[kappaProfile].label.toLowerCase()}, ${kappaDays} ${kappaDays === 1 ? 'giorno' : 'giorni'}`,
      eyebrow: 'Festival',
      description: kappaTravelProfiles[kappaProfile].description,
      kgCo2e: kappaKgCo2e,
      sourceId: kappaProfile === 'international' ? 'tyndallLive' : 'kappaAttendance',
      note: `Stima: ${kappaTravelProfiles[kappaProfile].travelKgCo2e} kg viaggio + ${kappaEventKgPerDay} kg/giorno × ${kappaDays}. Non è un dato ufficiale KFF.`,
    },
    {
      key: 'festivalLocal',
      label: `Festival locale — ${festivalDays} ${festivalDays === 1 ? 'giorno' : 'giorni'}`,
      eyebrow: 'Festival',
      description: 'Evento locale con breve mobilità urbana o regionale.',
      kgCo2e: localFestivalKgCo2e,
      sourceId: 'agf',
      note: `Stima: ${localFestivalTravelKg} kg viaggio + ${localFestivalEventKgPerDay} kg/giorno × ${festivalDays}.`,
    },
    {
      key: 'lowCarbonEvent',
      label: `Evento low-carbon — ${lowCarbonDays} ${lowCarbonDays === 1 ? 'giorno' : 'giorni'}`,
      eyebrow: 'Festival',
      description: 'Scenario ispirato a eventi con energia pulita, mobilità vincolata e food plant-based.',
      kgCo2e: lowCarbonKgCo2e,
      sourceId: 'tyndallLive',
      note: `Scenario didattico: ${lowCarbonEventKgPerDay} kg/giorno × ${lowCarbonDays}.`,
    },
  ]

  const dietScaleItem: ScaleItem = {
    key: 'diet',
    label: `Dieta ${selectedDiet.label.toLowerCase()} — 1 settimana`,
    eyebrow: 'Dieta',
    description: selectedDiet.description,
    kgCo2e: selectedDiet.weeklyKgCo2e,
    sourceId: selectedDiet.sourceId,
    note: 'Valore giornaliero convertito in settimana. La dieta può essere esclusa dalla scala.',
  }

  const allScaleItems: ScaleItem[] = [
    dietScaleItem,
    ...activityItems,
    ...configurableItems,
    ...benchmarkItems,
  ]
  const activeScaleItems = allScaleItems
    .filter((item) => includedKeys.includes(item.key))
    .sort((a, b) => b.kgCo2e - a.kgCo2e)
  const scenarioTotal = activeScaleItems.reduce((sum, item) => sum + item.kgCo2e, 0)
  const maxScaleValue = Math.max(scenarioTotal, ...activeScaleItems.map((item) => item.kgCo2e), 1)

  const activeSourceIds = Array.from(new Set(activeScaleItems.map((item) => item.sourceId)))
  const selectedSources = sources.filter((source) => activeSourceIds.includes(source.id))

  const toggleScaleItem = (key: ScaleKey) => {
    setIncludedKeys((currentKeys) =>
      currentKeys.includes(key)
        ? currentKeys.filter((currentKey) => currentKey !== key)
        : [...currentKeys, key],
    )
  }

  const isIncluded = (key: ScaleKey) => includedKeys.includes(key)

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <div className="eyebrow">CO₂e cultural scale</div>
          <h1 id="page-title">Una scala pulita per leggere impatti molto diversi.</h1>
          <p>
            Un sito didattico desktop: selezioni cosa includere, configuri durata e tipo di partecipazione,
            poi confronti tutto su una sola scala in kg CO₂e.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => methodologyDialogRef.current?.showModal()}>
              Metodologia
            </button>
            <a href="#sources">Fonti</a>
          </div>
        </div>

        <aside className="panel hero-card" aria-label="Somma elementi attivi">
          <span className="label">Totale scala</span>
          <strong>{formatKg(scenarioTotal)}</strong>
          <p>{activeScaleItems.length} elementi attivi. Kappa è impostato su {kappaDays} {kappaDays === 1 ? 'giorno' : 'giorni'}.</p>
        </aside>
      </section>

      <section className="workspace" aria-label="Dashboard didattica">
        <aside className="panel controls-panel">
          <div className="section-title">
            <span className="label">Selezione</span>
            <h2>Oggetti della scala</h2>
            <p>Ogni card contiene anche le proprie opzioni. Nessun menu nascosto.</p>
          </div>

          <section className={`object-card ${isIncluded('diet') ? 'active' : ''}`}>
            <label className="object-toggle">
              <input checked={isIncluded('diet')} onChange={() => toggleScaleItem('diet')} type="checkbox" />
              <span>
                <small>Dieta</small>
                <strong>{dietScaleItem.label}</strong>
              </span>
              <em>{formatKg(dietScaleItem.kgCo2e)}</em>
            </label>
            <div className="segmented" aria-label="Tipo dieta">
              {diets.map((diet) => (
                <button
                  aria-pressed={diet.key === selectedDiet.key}
                  key={diet.key}
                  onClick={() => setSelectedDietKey(diet.key)}
                  type="button"
                >
                  {diet.label}
                </button>
              ))}
            </div>
          </section>

          <section className="card-cluster" aria-label="Attività quotidiane">
            {activityItems.map((item) => (
              <label className={`object-card compact ${isIncluded(item.key) ? 'active' : ''}`} key={item.key}>
                <span className="object-toggle inline">
                  <input checked={isIncluded(item.key)} onChange={() => toggleScaleItem(item.key)} type="checkbox" />
                  <span>
                    <small>{item.eyebrow}</small>
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </span>
                  <em>{formatKg(item.kgCo2e)}</em>
                </span>
              </label>
            ))}
          </section>

          <section className={`object-card ${isIncluded('kappa') ? 'active' : ''}`}>
            <label className="object-toggle">
              <input checked={isIncluded('kappa')} onChange={() => toggleScaleItem('kappa')} type="checkbox" />
              <span>
                <small>Kappa FuturFestival</small>
                <strong>{configurableItems[0].label}</strong>
                <span>{configurableItems[0].description}</span>
              </span>
              <em>{formatKg(kappaKgCo2e)}</em>
            </label>
            <div className="option-block">
              <small>Durata</small>
              <div className="segmented two">
                {[1, 3].map((days) => (
                  <button
                    aria-pressed={kappaDays === days}
                    key={days}
                    onClick={() => setKappaDays(days as DurationDays)}
                    type="button"
                  >
                    {days} {days === 1 ? 'giorno' : 'giorni'}
                  </button>
                ))}
              </div>
            </div>
            <div className="option-block">
              <small>Profilo partecipante</small>
              <div className="segmented three">
                {(Object.keys(kappaTravelProfiles) as TravelProfileKey[]).map((profile) => (
                  <button
                    aria-pressed={kappaProfile === profile}
                    key={profile}
                    onClick={() => setKappaProfile(profile)}
                    type="button"
                  >
                    {kappaTravelProfiles[profile].label}
                  </button>
                ))}
              </div>
            </div>
            <p className="microcopy">{configurableItems[0].note}</p>
          </section>

          <section className="card-cluster" aria-label="Altri eventi configurabili">
            <article className={`object-card ${isIncluded('festivalLocal') ? 'active' : ''}`}>
              <label className="object-toggle">
                <input checked={isIncluded('festivalLocal')} onChange={() => toggleScaleItem('festivalLocal')} type="checkbox" />
                <span>
                  <small>Festival</small>
                  <strong>{configurableItems[1].label}</strong>
                </span>
                <em>{formatKg(localFestivalKgCo2e)}</em>
              </label>
              <div className="segmented two">
                {[1, 3].map((days) => (
                  <button aria-pressed={festivalDays === days} key={days} onClick={() => setFestivalDays(days as DurationDays)} type="button">
                    {days} {days === 1 ? 'giorno' : 'giorni'}
                  </button>
                ))}
              </div>
            </article>

            <article className={`object-card ${isIncluded('lowCarbonEvent') ? 'active' : ''}`}>
              <label className="object-toggle">
                <input checked={isIncluded('lowCarbonEvent')} onChange={() => toggleScaleItem('lowCarbonEvent')} type="checkbox" />
                <span>
                  <small>Evento low-carbon</small>
                  <strong>{configurableItems[2].label}</strong>
                </span>
                <em>{formatKg(lowCarbonKgCo2e)}</em>
              </label>
              <div className="segmented two">
                {[1, 3].map((days) => (
                  <button aria-pressed={lowCarbonDays === days} key={days} onClick={() => setLowCarbonDays(days as DurationDays)} type="button">
                    {days} {days === 1 ? 'giorno' : 'giorni'}
                  </button>
                ))}
              </div>
            </article>
          </section>

          <section className="card-cluster" aria-label="Viaggi benchmark">
            {benchmarkItems.map((item) => (
              <label className={`object-card compact ${isIncluded(item.key) ? 'active' : ''}`} key={item.key}>
                <span className="object-toggle inline">
                  <input checked={isIncluded(item.key)} onChange={() => toggleScaleItem(item.key)} type="checkbox" />
                  <span>
                    <small>{item.eyebrow}</small>
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </span>
                  <em>{formatKg(item.kgCo2e)}</em>
                </span>
              </label>
            ))}
          </section>
        </aside>

        <section className="panel scale-panel" aria-label="Scala principale in kg CO2e">
          <div className="scale-header">
            <div>
              <span className="label">Scala principale</span>
              <h2>Confronto in kg CO₂e</h2>
              <p>Le barre sono ordinate dal valore più alto al più basso. Il totale resta separato per non falsare la lettura.</p>
            </div>
            <div className="total-pill">
              <span>Totale attivo</span>
              <strong>{formatKg(scenarioTotal)}</strong>
            </div>
          </div>

          <div className="scale-chart">
            {activeScaleItems.map((item) => {
              const source = sources.find((sourceItem) => sourceItem.id === item.sourceId)
              return (
                <article className="scale-row" key={item.key}>
                  <div className="scale-row-copy">
                    <small>{item.eyebrow}</small>
                    <strong>{item.label}</strong>
                    <span>{source?.title ?? 'Fonte da verificare'}</span>
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

      <section className="panel sources-panel" id="sources" aria-label="Fonti usate">
        <div className="section-title">
          <span className="label">Fonti</span>
          <h2>Fonti usate per i calcoli</h2>
          <p>Le schede evidenziate sono quelle usate dagli elementi attivi nella scala.</p>
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
          <h2>Come leggere questi numeri</h2>
          <ol>
            <li>
              <strong>Kappa FuturFestival.</strong> Ora è esplicito: puoi scegliere 1 giorno o 3 giorni.
              Il viaggio è conteggiato una volta, mentre la quota evento viene moltiplicata per i giorni.
            </li>
            <li>
              <strong>Festival.</strong> I valori Kappa sono scenari didattici, non dati ufficiali KFF.
              Il punto metodologico è mostrare che la mobilità del pubblico domina l’impatto.
            </li>
            <li>
              <strong>Diete.</strong> I valori giornalieri sono convertiti in settimana. Flexitariana,
              onnivora e carnivora sono proxy ricavati da categorie di consumo carne.
            </li>
            <li>
              <strong>Viaggi.</strong> I voli sono benchmark di scala. Nella versione finale vanno calcolati
              per rotta, classe, fattore di carico e metodo scelto.
            </li>
            <li>
              <strong>Uso didattico.</strong> Lo scopo è confrontare ordini di grandezza, non dichiarare
              un inventario carbonico definitivo.
            </li>
          </ol>
        </div>
      </dialog>
    </main>
  )
}

export default App

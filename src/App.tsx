import { useRef, useState } from 'react'

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
  description: string
  kgCo2e: number
  sourceId: SourceId
  note: string
}

type StaticItem = {
  key: ActivityKey | BenchmarkKey
  label: string
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
    use: 'Contesto dimensionale del festival e delle sue tre giornate.',
    url: 'https://it.wikipedia.org/wiki/Kappa_FuturFestival',
  },
  {
    id: 'tyndallLive',
    title: 'Tyndall Centre / Massive Attack Act 1.5',
    use: 'Metodo live event: mobilità del pubblico come driver dominante.',
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
    description: 'Sessioni online, dispositivo, schermo e rete.',
    kgCo2e: 2.4,
    sourceId: 'carbonTrust',
    note: 'Proxy conservativo da raffinare con i consumi reali del setup.',
  },
  {
    key: 'climbing',
    label: 'Arrampicata',
    description: 'Giornata in palestra o falesia vicina.',
    kgCo2e: 6.2,
    sourceId: 'defra',
    note: 'Il driver principale è lo spostamento locale o regionale.',
  },
  {
    key: 'trekking',
    label: 'Trekking',
    description: 'Escursione giornaliera con spostamento regionale.',
    kgCo2e: 8.1,
    sourceId: 'defra',
    note: 'Proxy basato sul trasporto; attrezzatura esclusa.',
  },
]

const benchmarkItems: StaticItem[] = [
  {
    key: 'flightEurope',
    label: 'Volo europeo A/R',
    description: 'Benchmark breve-medio in Europa.',
    kgCo2e: 350,
    sourceId: 'icao',
    note: 'Dato dimostrativo: nella versione finale va calcolato per rotta.',
  },
  {
    key: 'flightIntercontinental',
    label: 'Volo intercontinentale A/R',
    description: 'Benchmark alto per dare scala agli altri valori.',
    kgCo2e: 1800,
    sourceId: 'icao',
    note: 'Rotta e classe possono modificare molto il risultato.',
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
    description: 'Partecipante dall’Italia, treno o auto più quota evento.',
  },
  international: {
    label: 'Internazionale',
    travelKgCo2e: 408,
    description: 'Partecipante estero con volo europeo più quota evento.',
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
      label: `Kappa FuturFestival — ${kappaDays} ${kappaDays === 1 ? 'giorno' : 'giorni'}, ${kappaTravelProfiles[kappaProfile].label.toLowerCase()}`,
      description: kappaTravelProfiles[kappaProfile].description,
      kgCo2e: kappaKgCo2e,
      sourceId: kappaProfile === 'international' ? 'tyndallLive' : 'kappaAttendance',
      note: `Stima: ${kappaTravelProfiles[kappaProfile].travelKgCo2e} kg viaggio + ${kappaEventKgPerDay} kg/giorno × ${kappaDays}.`,
    },
    {
      key: 'festivalLocal',
      label: `Festival locale — ${festivalDays} ${festivalDays === 1 ? 'giorno' : 'giorni'}`,
      description: 'Evento locale con mobilità urbana o regionale breve.',
      kgCo2e: localFestivalKgCo2e,
      sourceId: 'agf',
      note: `Stima: ${localFestivalTravelKg} kg viaggio + ${localFestivalEventKgPerDay} kg/giorno × ${festivalDays}.`,
    },
    {
      key: 'lowCarbonEvent',
      label: `Evento low-carbon — ${lowCarbonDays} ${lowCarbonDays === 1 ? 'giorno' : 'giorni'}`,
      description: 'Scenario con energia pulita, mobilità vincolata e food plant-based.',
      kgCo2e: lowCarbonKgCo2e,
      sourceId: 'tyndallLive',
      note: `Scenario didattico: ${lowCarbonEventKgPerDay} kg/giorno × ${lowCarbonDays}.`,
    },
  ]

  const dietScaleItem: ScaleItem = {
    key: 'diet',
    label: `Dieta ${selectedDiet.label.toLowerCase()} — 1 settimana`,
    description: selectedDiet.description,
    kgCo2e: selectedDiet.weeklyKgCo2e,
    sourceId: selectedDiet.sourceId,
    note: 'Valore giornaliero convertito in settimana.',
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
  const maxScaleValue = Math.max(...activeScaleItems.map((item) => item.kgCo2e), 1)
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
  const countIncluded = (keys: ScaleKey[]) => keys.filter((key) => isIncluded(key)).length

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <div className="eyebrow">CO₂e cultural scale</div>
          <h1 id="page-title">Confronta l’impatto, senza perdere la scala.</h1>
          <p>
            La comparazione resta in primo piano. Apri i menu solo quando devi cambiare dieta,
            attività, evento o viaggio.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => methodologyDialogRef.current?.showModal()}>
              Metodologia
            </button>
            <a href="#sources">Fonti</a>
          </div>
        </div>

        <aside className="panel hero-card" aria-label="Somma elementi attivi">
          <span className="label">Totale selezionato</span>
          <strong>{formatKg(scenarioTotal)}</strong>
          <p>{activeScaleItems.length} elementi nella comparazione.</p>
        </aside>
      </section>

      <section className="workspace" aria-label="Dashboard didattica">
        <aside className="controls-column" aria-label="Configurazione oggetti">
          <div className="controls-intro">
            <span className="label">Configura</span>
            <h2>Oggetti della scala</h2>
            <p>Ogni sezione mostra lo stato corrente e si apre solo quando serve.</p>
          </div>

          <details className="control-menu">
            <summary>
              <span className="menu-copy">
                <strong>Dieta</strong>
                <small>{selectedDiet.label} · {formatKg(selectedDiet.weeklyKgCo2e)}</small>
              </span>
              <span className={`menu-status ${isIncluded('diet') ? 'active' : ''}`}>
                {isIncluded('diet') ? 'Inclusa' : 'Esclusa'}
              </span>
              <span className="menu-chevron" aria-hidden="true">⌄</span>
            </summary>
            <div className="menu-content">
              <label className={`select-row ${isIncluded('diet') ? 'active' : ''}`}>
                <input checked={isIncluded('diet')} onChange={() => toggleScaleItem('diet')} type="checkbox" />
                <span>
                  <strong>Includi la dieta</strong>
                  <small>Periodo di confronto: una settimana</small>
                </span>
              </label>

              <div className="choice-grid" aria-label="Tipo dieta">
                {diets.map((diet) => (
                  <button
                    className="choice-button"
                    aria-pressed={diet.key === selectedDiet.key}
                    key={diet.key}
                    onClick={() => setSelectedDietKey(diet.key)}
                    type="button"
                  >
                    <strong>{diet.label}</strong>
                    <small>{formatKg(diet.weeklyKgCo2e)} / settimana</small>
                  </button>
                ))}
              </div>
            </div>
          </details>

          <details className="control-menu">
            <summary>
              <span className="menu-copy">
                <strong>Attività</strong>
                <small>Gaming, arrampicata e trekking</small>
              </span>
              <span className="menu-status active">
                {countIncluded(['gaming', 'climbing', 'trekking'])} attive
              </span>
              <span className="menu-chevron" aria-hidden="true">⌄</span>
            </summary>
            <div className="menu-content selection-list">
              {activityItems.map((item) => (
                <label className={`select-row ${isIncluded(item.key) ? 'active' : ''}`} key={item.key}>
                  <input checked={isIncluded(item.key)} onChange={() => toggleScaleItem(item.key)} type="checkbox" />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  <em>{formatKg(item.kgCo2e)}</em>
                </label>
              ))}
            </div>
          </details>

          <details className="control-menu">
            <summary>
              <span className="menu-copy">
                <strong>Festival ed eventi</strong>
                <small>Kappa, festival locale e scenario low-carbon</small>
              </span>
              <span className="menu-status active">
                {countIncluded(['kappa', 'festivalLocal', 'lowCarbonEvent'])} attivi
              </span>
              <span className="menu-chevron" aria-hidden="true">⌄</span>
            </summary>
            <div className="menu-content config-stack">
              <article className="config-object">
                <label className={`select-row ${isIncluded('kappa') ? 'active' : ''}`}>
                  <input checked={isIncluded('kappa')} onChange={() => toggleScaleItem('kappa')} type="checkbox" />
                  <span>
                    <strong>Kappa FuturFestival</strong>
                    <small>{kappaDays} {kappaDays === 1 ? 'giorno' : 'giorni'} · {kappaTravelProfiles[kappaProfile].label}</small>
                  </span>
                  <em>{formatKg(kappaKgCo2e)}</em>
                </label>

                <fieldset>
                  <legend>Durata</legend>
                  <div className="choice-grid compact">
                    {[1, 3].map((days) => (
                      <button
                        className="choice-button"
                        aria-pressed={kappaDays === days}
                        key={days}
                        onClick={() => setKappaDays(days as DurationDays)}
                        type="button"
                      >
                        <strong>{days} {days === 1 ? 'giorno' : 'giorni'}</strong>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Provenienza</legend>
                  <div className="choice-grid compact three-columns">
                    {(Object.keys(kappaTravelProfiles) as TravelProfileKey[]).map((profile) => (
                      <button
                        className="choice-button"
                        aria-pressed={kappaProfile === profile}
                        key={profile}
                        onClick={() => setKappaProfile(profile)}
                        type="button"
                      >
                        <strong>{kappaTravelProfiles[profile].label}</strong>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </article>

              <article className="config-object">
                <label className={`select-row ${isIncluded('festivalLocal') ? 'active' : ''}`}>
                  <input checked={isIncluded('festivalLocal')} onChange={() => toggleScaleItem('festivalLocal')} type="checkbox" />
                  <span>
                    <strong>Festival locale</strong>
                    <small>{festivalDays} {festivalDays === 1 ? 'giorno' : 'giorni'} · mobilità breve</small>
                  </span>
                  <em>{formatKg(localFestivalKgCo2e)}</em>
                </label>
                <div className="choice-grid compact">
                  {[1, 3].map((days) => (
                    <button
                      className="choice-button"
                      aria-pressed={festivalDays === days}
                      key={days}
                      onClick={() => setFestivalDays(days as DurationDays)}
                      type="button"
                    >
                      <strong>{days} {days === 1 ? 'giorno' : 'giorni'}</strong>
                    </button>
                  ))}
                </div>
              </article>

              <article className="config-object">
                <label className={`select-row ${isIncluded('lowCarbonEvent') ? 'active' : ''}`}>
                  <input checked={isIncluded('lowCarbonEvent')} onChange={() => toggleScaleItem('lowCarbonEvent')} type="checkbox" />
                  <span>
                    <strong>Evento low-carbon</strong>
                    <small>{lowCarbonDays} {lowCarbonDays === 1 ? 'giorno' : 'giorni'} · scenario ottimizzato</small>
                  </span>
                  <em>{formatKg(lowCarbonKgCo2e)}</em>
                </label>
                <div className="choice-grid compact">
                  {[1, 3].map((days) => (
                    <button
                      className="choice-button"
                      aria-pressed={lowCarbonDays === days}
                      key={days}
                      onClick={() => setLowCarbonDays(days as DurationDays)}
                      type="button"
                    >
                      <strong>{days} {days === 1 ? 'giorno' : 'giorni'}</strong>
                    </button>
                  ))}
                </div>
              </article>
            </div>
          </details>

          <details className="control-menu">
            <summary>
              <span className="menu-copy">
                <strong>Viaggi benchmark</strong>
                <small>Voli separati dagli eventi</small>
              </span>
              <span className="menu-status active">
                {countIncluded(['flightEurope', 'flightIntercontinental'])} attivi
              </span>
              <span className="menu-chevron" aria-hidden="true">⌄</span>
            </summary>
            <div className="menu-content selection-list">
              {benchmarkItems.map((item) => (
                <label className={`select-row ${isIncluded(item.key) ? 'active' : ''}`} key={item.key}>
                  <input checked={isIncluded(item.key)} onChange={() => toggleScaleItem(item.key)} type="checkbox" />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  <em>{formatKg(item.kgCo2e)}</em>
                </label>
              ))}
            </div>
          </details>
        </aside>

        <section className="panel scale-panel" aria-label="Scala principale in kg CO2e">
          <div className="scale-header">
            <div>
              <span className="label">Comparazione</span>
              <h2>Impatto in kg CO₂e</h2>
              <p>Gli elementi selezionati sono ordinati dal valore più alto al più basso.</p>
            </div>
            <div className="total-block">
              <span>Totale</span>
              <strong>{formatKg(scenarioTotal)}</strong>
            </div>
          </div>

          {activeScaleItems.length > 0 ? (
            <div className="scale-chart">
              {activeScaleItems.map((item) => {
                const source = sources.find((sourceItem) => sourceItem.id === item.sourceId)
                return (
                  <article className="scale-row" key={item.key}>
                    <div className="scale-row-heading">
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </div>
                    <div className="scale-value">{formatKg(item.kgCo2e)}</div>
                    <div className="scale-track" aria-hidden="true">
                      <div className="scale-fill" style={{ width: getBarWidth(item.kgCo2e, maxScaleValue) }} />
                    </div>
                    <div className="scale-footnote">
                      <span>{item.note}</span>
                      <small>{source?.title ?? 'Fonte da verificare'}</small>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <strong>Nessun oggetto selezionato</strong>
              <p>Apri uno dei menu e aggiungi almeno un elemento alla comparazione.</p>
            </div>
          )}
        </section>
      </section>

      <section className="panel sources-panel" id="sources" aria-label="Fonti usate">
        <div className="section-title">
          <span className="label">Fonti</span>
          <h2>Riferimenti usati</h2>
          <p>Le schede evidenziate alimentano gli elementi attualmente selezionati.</p>
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
              <strong>Kappa FuturFestival.</strong> Il viaggio è conteggiato una volta; la quota evento viene moltiplicata per uno o tre giorni.
            </li>
            <li>
              <strong>Festival.</strong> I valori Kappa sono scenari didattici, non un dato ufficiale del festival.
            </li>
            <li>
              <strong>Diete.</strong> I valori giornalieri sono convertiti in una settimana comparabile.
            </li>
            <li>
              <strong>Viaggi.</strong> I voli sono benchmark: rotta e classe possono cambiare molto il risultato.
            </li>
          </ol>
        </div>
      </dialog>
    </main>
  )
}

export default App

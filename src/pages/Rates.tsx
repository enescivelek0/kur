import { MarketCards } from '../components/MarketCards'
import { Movers } from '../components/Movers'
import { PageHeader } from '../components/PageHeader'
import { RatesBoard } from '../components/RatesBoard'
import { useT } from '../i18n'

export default function Rates() {
  const t = useT().rates
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} desc={t.desc} />
      <div className="space-y-6">
        <MarketCards codes={['USD', 'EUR', 'GBP', 'JPY']} />
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <RatesBoard initialAll />
          <Movers />
        </div>
      </div>
    </>
  )
}

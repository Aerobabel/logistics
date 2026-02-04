import { getOffers } from './actions'
import OffersClient from './offers-client'

export const dynamic = 'force-dynamic'

export default async function OffersPage() {
  const data = await getOffers()
  const offers = data.map(o => ({
    ...o,
    date: o.date.toISOString(),
  }))
  return <OffersClient initialOffers={offers} />
}

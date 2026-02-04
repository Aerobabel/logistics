import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function AccountingPage() {
  const documents = await prisma.document.findMany({
    orderBy: { date: 'desc' }
  })

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Бухгалтерия</h1>
        <p className="text-slate-500 mt-1">Документы и учетные операции.</p>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4 border-slate-200 flex justify-between items-center">
            <div>
              <div className="font-medium">{doc.number}</div>
              <div className="text-xs text-slate-500">{doc.type} - {new Date(doc.date).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">{doc.status}</Badge>
              <div className="font-bold text-[#E66400]">{doc.sum.toLocaleString()} ₽</div>
            </div>
          </Card>
        ))}
        {documents.length === 0 && (
          <p className="text-sm text-slate-500">Документов пока нет.</p>
        )}
      </div>
    </div>
  )
}

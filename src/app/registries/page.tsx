import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function RegistriesPage() {
    const registries = await prisma.registry.findMany({
        include: {
            requests: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Реестры</h1>
            <p className="text-muted-foreground">Сгруппированные заявки для выставления документов и отгрузки.</p>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {registries.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-muted-foreground border rounded-lg bg-muted/10">
                        Реестры пока не созданы. Создайте их на странице заявок.
                    </div>
                ) : (
                    registries.map((reg) => (
                        <Card key={reg.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold">
                                    {reg.number || `Registry #${reg.id}`}
                                </CardTitle>
                                <Badge variant={reg.status === 'DRAFT' ? 'outline' : 'default'}>
                                    {reg.status}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground mb-4">
                                    Создан: {new Date(reg.createdAt).toLocaleDateString()}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Заявки в реестре:</h4>
                                    <ul className="text-sm space-y-1">
                                        {reg.requests.map(req => (
                                            <li key={req.id} className="flex justify-between">
                                                <span>{req.cargo}</span>
                                                <span className="text-muted-foreground">{req.weight} кг</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-2 border-t mt-2 flex justify-between font-medium">
                                        <span>Итого вес:</span>
                                        <span>{reg.requests.reduce((acc, r) => acc + (r.weight || 0), 0)} кг</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

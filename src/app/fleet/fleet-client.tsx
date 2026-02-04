'use client'

import { useState, useActionState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { toggleVehicleStatus, createVehicle } from './actions'

type Vehicle = {
  id: number
  plate: string
  driver: string
  type: string
  status: string
}

export default function FleetClient({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [state, formAction] = useActionState(createVehicle, null)

  useEffect(() => {
    if (state?.success) {
      setIsAddModalOpen(false)
    }
  }, [state])

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Управление автопарком</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 font-medium">
              <Plus className="w-4 h-4" /> Добавить автомобиль
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить автомобиль</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plate">Гос. номер</Label>
                <Input id="plate" name="plate" placeholder="A 000 AA 777" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver">Водитель</Label>
                <Input id="driver" name="driver" placeholder="Иванов И.И." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Тип ТС</Label>
                <Input id="type" name="type" placeholder="Фура 20т" required />
              </div>
              <Button type="submit" className="w-full bg-[#E66400] hover:bg-orange-700">Добавить</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-slate-900">{vehicle.plate}</CardTitle>
              <Badge variant={vehicle.status === 'AVAILABLE' ? 'default' : 'secondary'} className={vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-700'}>
                {vehicle.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500 mb-4 space-y-1">
                <div><span className="font-medium text-slate-700">Водитель:</span> {vehicle.driver}</div>
                <div><span className="font-medium text-slate-700">Тип:</span> {vehicle.type}</div>
              </div>
              <form action={toggleVehicleStatus.bind(null, vehicle.id, vehicle.status)}>
                <Button
                  variant={vehicle.status === 'AVAILABLE' ? 'outline' : 'default'}
                  size="sm"
                  className="w-full"
                >
                  {vehicle.status === 'AVAILABLE' ? 'Поставить в работу' : 'Освободить'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
      {initialVehicles.length === 0 && (
        <div className="text-center p-12 border-2 border-dashed border-slate-300 rounded-lg">
          <p className="text-slate-500">Нет автомобилей. Добавьте новую запись!</p>
        </div>
      )}
    </div>
  )
}

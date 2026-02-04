'use client'

import { createRequest } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useActionState } from 'react'
// import { useFormState } from 'react-dom' // Next.js 14+ specific, we'll use simple form action for now

export function RequestForm({ initialData, action = createRequest, onSuccess }: { initialData?: any, action?: any, onSuccess?: () => void }) {
  const initialState: any = { message: '', errors: {} }
  const [state, formAction] = useActionState(action, initialState)

  if (state?.success && onSuccess) {
    onSuccess()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle>{initialData ? 'Edit Request' : 'Create New Loading Request'}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" required defaultValue={initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input type="number" step="0.1" id="weight" name="weight" placeholder="e.g. 20000" defaultValue={initialData?.weight || ''} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo Details</Label>
            <Input id="cargo" name="cargo" placeholder="e.g. Wheat, 3rd class" required defaultValue={initialData?.cargo || ''} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="routeFrom">From</Label>
              <Input id="routeFrom" name="routeFrom" placeholder="Warehouse A" required defaultValue={initialData?.routeFrom || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routeTo">To</Label>
              <Input id="routeTo" name="routeTo" placeholder="Port terminal" required defaultValue={initialData?.routeTo || ''} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client</Label>
              <Input id="clientName" name="clientName" placeholder="Client Name" defaultValue={initialData?.clientName || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost (₽)</Label>
              <Input type="number" id="cost" name="cost" placeholder="10000" defaultValue={initialData?.cost || ''} />
            </div>
          </div>

          {initialData && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" placeholder="PENDING" defaultValue={initialData?.status || 'PENDING'} />
            </div>
          )}

          <Button type="submit" className="w-full bg-[#E66400] hover:bg-orange-700">{initialData ? 'Save Changes' : 'Create Request'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

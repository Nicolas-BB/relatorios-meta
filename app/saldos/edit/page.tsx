'use client'

import { PgAccount } from "@/src/types/business"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Save } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

function EditRow({ data, onChange }: { data: PgAccount, onChange: (updated: PgAccount) => void }) {
    const [minimum, setMinimum] = useState<number | ''>(data.minimum ?? '')
    const [type, setType] = useState<string>(data.type ?? '')
    const [show, setShow] = useState<boolean>(data.show ?? true)

    const update = (m: number | '', t: string, s: boolean) => {
        onChange({ ...data, minimum: m === '' ? null : m, type: t, show: s })
    }

    return (
        <TableRow>
            <TableCell className="px-4 py-4 font-mono text-[10px] text-muted-foreground">{data.id}</TableCell>
            <TableCell className="px-4 py-4 text-sm font-semibold">{data.name}</TableCell>
            <TableCell className="px-4 py-4 text-right">
                <input
                    type="number"
                    className="w-full max-w-[120px] px-3 py-1.5 text-xs bg-muted border rounded-md text-right focus:ring-1 focus:ring-primary outline-none"
                    value={minimum}
                    placeholder='Mínimo'
                    onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value)
                        setMinimum(val)
                        update(val, type, show)
                    }}
                />
            </TableCell>
            <TableCell className="px-4 py-4 text-center">
                <select
                    className="px-2 py-1.5 text-xs bg-muted border rounded-md focus:ring-1 focus:ring-primary outline-none"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value)
                        update(minimum, e.target.value, show)
                    }}
                >
                    <option value="" disabled>Tipo</option>
                    <option value="Pix">Pix</option>
                    <option value="Cartão">Cartão</option>
                </select>
            </TableCell>
            <TableCell className="px-4 py-4 text-center">
                <input
                    type="checkbox"
                    checked={show}
                    onChange={(e) => {
                        setShow(e.target.checked)
                        update(minimum, type, e.target.checked)
                    }}
                    className="w-4 h-4 cursor-pointer"
                />
            </TableCell>
        </TableRow>
    )
}

export default function EditContas() {
    const [businessList, setBusinessList] = useState<PgAccount[]>([])
    const [loading, setLoading] = useState(false)

    const sortedList = [...businessList].sort((a, b) => a.name.localeCompare(b.name))

    async function listBalances() {
        const res = await fetch('/api/list-balances')
        const data = await res.json()
        setBusinessList(data)
    }

    useEffect(() => { listBalances() }, [])

    async function upsertAccounts() {
        setLoading(true)
        try {
            await fetch('/api/upsert-accounts', {
                method: 'POST',
                body: JSON.stringify(businessList)
            })
            alert('Configurações salvas!')
        } finally {
            setLoading(false)
        }
    }

    const handleRowChange = (updatedRow: PgAccount) => {
        setBusinessList(prev => prev.map(d => d.id === updatedRow.id ? updatedRow : d))
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/saldos">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Configurar Contas</h1>
                        <p className="text-muted-foreground">Gerencie parâmetros de visibilidade e saldo mínimo.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={upsertAccounts} disabled={loading} className="font-bold shadow-sm">
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b flex items-center justify-between">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Editor de Parâmetros</h4>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">{businessList.length} contas configuradas</span>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Id</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Nome</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Mínimo</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Tipo</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Mostrar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedList.map((account) => (
                                <EditRow key={account.id} data={account} onChange={handleRowChange} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

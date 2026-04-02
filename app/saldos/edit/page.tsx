'use client'

import { PgAccount } from "@/src/types/business"
import { useEffect, useState } from "react"
import { Button } from "../../components/Button"
import EditTable from "../../components/EditTable"

export default function Dashboard() {
    const [businessList, setBusinessList] = useState<PgAccount[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const sortedList: PgAccount[] = [...businessList].sort((a, b) => (
        a.name.localeCompare(b.name)
    ))

    async function listBalances() {
        const res = await fetch('/api/list-balances')
        const data = await res.json()
        setBusinessList(data)
    }

    async function upsertAccounts() {
        try {
            setLoading(true)

            await fetch('/api/upsert-accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(businessList)
            })
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        listBalances()
    }, [])

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-on-surface tracking-tight leading-none mb-2">Edição de Saldos</h1>
                    <p className="text-on-surface-variant font-medium">Configure os parâmetros operacionais de limite e exibição.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={upsertAccounts} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</Button>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_32px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-6 py-5 border-b border-outline-variant/10 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Configuração Analítica</h4>
                    <div className="flex gap-4">
                        <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">Exibindo {sortedList.length} contas totais</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <EditTable data={sortedList} onChange={setBusinessList}></EditTable>
                </div>
            </div>
        </div>
    )
}

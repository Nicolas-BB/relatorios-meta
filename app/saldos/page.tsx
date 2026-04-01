'use client'

import { PgAccount } from "@/src/types/business"
import { useEffect, useState } from "react"
import Table from "../components/Table"

export default function Dashboard() {
    const [businessList, setBusinessList] = useState<PgAccount[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const sortedList: PgAccount[] = [...businessList].sort((a, b) => (
        a.name.localeCompare(b.name)
    ))

    async function getBalances() {
        const res = await fetch('/api/get-balances')
        const data = await res.json()
        setBusinessList(data)
    }

    useEffect(() => {
        getBalances()
    }, [])

    async function updateBalances() {
        try {
            setLoading(true)
            await fetch('/api/sync-balances')
            await getBalances()
        }
        finally {
            setLoading(false)
        }
    }

    const totalBalance = businessList.reduce((acc, curr) => acc + Number(curr.balance), 0);
    const contasOk = businessList.filter(acc => acc.minimum !== 0 && Number(acc.balance) >= Number(acc.minimum) && acc.show === true).length;
    const contasWarning = businessList.filter(acc => acc.minimum !== null && Number(acc.balance) < Number(acc.minimum) && acc.show === true).length;
    const updatedAt = businessList.length > 0 ? new Date(Math.max(...businessList.map(a => new Date(a.updated).getTime()))) : null;

    const formattedTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(totalBalance);

    const formattedTime = updatedAt ? updatedAt.toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) : '--:--:--';

    return (
        <div className="space-y-8">
            {/* Editorial Header Section */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-on-surface tracking-tight leading-none mb-2">Relatório de Saldos</h1>
                    <p className="text-on-surface-variant font-medium">Visão consolidada das contas e saúde financeira operacional.</p>
                </div>
            </div>

            {/* Bento Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Summary Card 2: Contas OK */}
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[4px_0_24px_-4px_rgba(44,52,55,0.06)] group">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Contas OK</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-black text-on-surface">{contasOk.toString().padStart(2, '0')}</h3>
                        <div className="w-12 h-12 bg-tertiary-container/30 rounded-full flex items-center justify-center text-tertiary">
                            <span className="material-symbols-outlined" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-on-surface-variant">Todas as contas acima do mínimo estabelecido.</p>
                </div>

                {/* Summary Card 3: Contas em Atenção */}
                <div className={`bg-surface-container-lowest p-6 rounded-xl shadow-[4px_0_24px_-4px_rgba(44,52,55,0.06)] group ${contasWarning > 0 ? 'border-l-4 border-error' : ''}`}>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Em Atenção</p>
                    <div className="flex items-center justify-between">
                        <h3 className={`text-3xl font-black ${contasWarning > 0 ? 'text-error' : 'text-on-surface'}`}>{contasWarning.toString().padStart(2, '0')}</h3>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${contasWarning > 0 ? 'bg-error-container/30 text-error' : 'bg-surface-container text-on-surface-variant'}`}>
                            <span className="material-symbols-outlined" data-icon="warning" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-on-surface-variant">
                        {contasWarning > 0 ? 'Existem contas requerendo atenção.' : 'Sem contas em estado de alerta.'}
                    </p>
                </div>

                {/* Summary Card 4: Próxima Atualização */}
                <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <div>
                        <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-4">Status do Sistema</p>
                        <h3 className="text-xl font-bold mb-2">{loading ? 'Sincronizando...' : 'Sincronizado'}</h3>
                        <div className="flex items-center gap-2 text-sm opacity-90">
                            <span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
                            Última: {formattedTime}
                        </div>
                    </div>
                    <button
                        onClick={updateBalances}
                        disabled={loading}
                        className="mt-4 w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 py-2 rounded-lg text-xs font-bold uppercase transition-colors"
                    >
                        {loading ? 'Sincronizando...' : 'Forçar Sync'}
                    </button>
                </div>
            </div>

            {/* Main Data Table Container */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_32px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-6 py-5 border-b border-outline-variant/10 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Listagem de Saldos Analítica</h4>
                    <div className="flex gap-4">
                        <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">Exibindo {sortedList.filter(a => a.show).length} registros</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table data={sortedList} />
                </div>
            </div>
        </div>
    )
}

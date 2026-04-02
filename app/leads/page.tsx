'use client'

import { useEffect, useState } from "react"
import LeadsTable from "../components/LeadsTable"
import type { LeadData } from "@/src/types/business"

export default function Leads() {
    const defaultDate = (() => {
        const d = new Date()
        d.setDate(d.getDate() - 1)
        return d.toISOString().split('T')[0]
    })()

    const [leadsList, setLeadsList] = useState<LeadData[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [isSyncing, setIsSyncing] = useState<boolean>(false)

    // Filters
    const [startDate, setStartDate] = useState<string>(defaultDate)
    const [endDate, setEndDate] = useState<string>(defaultDate)
    const [bmFilter, setBmFilter] = useState<string>('')

    async function getLeadsList() {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)
            if (bmFilter) params.append('bm', bmFilter)

            const res = await fetch(`/api/list-leads?${params.toString()}`)
            const data = await res.json()
            setLeadsList(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getLeadsList()
    }, [startDate, endDate]) // Refetch when dates change

    // Delayed fetch when typing BM to avoid spamming the API
    useEffect(() => {
        const timeout = setTimeout(() => {
            getLeadsList()
        }, 500)
        return () => clearTimeout(timeout)
    }, [bmFilter])

    async function updateLeads() {
        try {
            setIsSyncing(true)
            await fetch('/api/get-leads')
            await getLeadsList() // Refresh the table after inserting new ones
        } finally {
            setIsSyncing(false)
        }
    }

    const totalLeads = leadsList.reduce((acc, curr) => acc + Number(curr.total), 0)
    const updatedAt = leadsList.length > 0 ? new Date(Math.max(...leadsList.map(a => new Date(a.date).getTime()))) : null;

    const formattedTime = updatedAt ? updatedAt.toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) : '--:--:--';

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-on-surface tracking-tight leading-none mb-2">Relatório de Leads</h1>
                    <p className="text-on-surface-variant font-medium">Desempenho de captação de leads por conta (BM).</p>
                </div>
            </div>

            {/* Metrics & Sync Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Summary Card 1: Total de Leads */}
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[4px_0_24px_-4px_rgba(44,52,55,0.06)] group">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Total de Leads</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-4xl font-black text-on-surface">{totalLeads}</h3>
                        <div className="w-12 h-12 bg-primary-container/30 rounded-full flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined" data-icon="group" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                        </div>
                    </div>
                </div>

                {/* Summary Card 2: Contas Listadas */}
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[4px_0_24px_-4px_rgba(44,52,55,0.06)] group">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Registros Exibidos</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-black text-on-surface">{leadsList.length.toString().padStart(2, '0')}</h3>
                        <div className="w-12 h-12 bg-tertiary-container/30 rounded-full flex items-center justify-center text-tertiary">
                            <span className="material-symbols-outlined" data-icon="list" style={{ fontVariationSettings: "'FILL' 1" }}>list</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 border-none bg-transparent shadow-none hidden lg:block"></div>

                {/* Summary Card 3: Sync System */}
                {/* <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <div>
                        <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-4">Sincronização Meta</p>
                        <h3 className="text-xl font-bold mb-2">{isSyncing ? 'Buscando API...' : 'Leads Atualizados'}</h3>
                        <div className="flex items-center gap-2 text-sm opacity-90">
                            {loading ? (
                                <span className="text-white/80 animate-pulse">Carregando dados locais...</span>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
                                    Última ref: {formattedTime}
                                </>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={updateLeads}
                        disabled={isSyncing}
                        className="mt-4 w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 py-2 rounded-lg text-xs font-bold uppercase transition-colors"
                    >
                        {isSyncing ? 'Sincronizando...' : 'Forçar Sync c/ Meta'}
                    </button>
                </div> */}
            </div>

            {/* Table and Filters Section */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_32px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-6 py-5 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Listagem de Leads</h4>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center w-full justify-end">
                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Buscar Conta</label>
                            <input
                                type="text"
                                placeholder="Nome da conta (BM)"
                                value={bmFilter}
                                onChange={(e) => setBmFilter(e.target.value)}
                                className="bg-surface-container focus:bg-surface-container-high transition-colors text-sm px-4 py-2 rounded-lg text-on-surface placeholder:text-on-surface-variant/50 outline-none w-full min-w-[200px]"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">De</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="bg-surface-container focus:bg-surface-container-high transition-colors text-sm px-4 py-2 rounded-lg text-on-surface outline-none"
                                />
                            </div>
                            <span className="text-on-surface-variant self-end mb-2">-</span>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Até</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="bg-surface-container focus:bg-surface-container-high transition-colors text-sm px-4 py-2 rounded-lg text-on-surface outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto relative min-h-[200px]">
                    <LeadsTable data={leadsList} />
                    {loading && (
                        <div className="absolute inset-0 bg-surface-container-lowest/50 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl" data-icon="progress_activity">progress_activity</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

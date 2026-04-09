'use client'

import { PgAccount } from "@/src/types/business"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pen, CheckCircle, AlertTriangle, RefreshCw, Clock } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

function BalanceRow({ data }: { data: PgAccount }) {
    const balanceBrl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.balance)
    const minimumBrl = data.minimum === null ? '-' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.minimum)
    const date = new Date(data.updated).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
    const status = data.minimum !== 0 && Number(data.balance) >= Number(data.minimum) ? 'Ok' : 'Atenção'
    const isError = status === 'Atenção'

    return (
        <TableRow className={isError ? "bg-destructive/5" : ""}>
            <TableCell className="px-4 py-4 font-mono text-[10px] text-muted-foreground">{data.id}</TableCell>
            <TableCell className="px-4 py-4 text-sm font-semibold">{data.name}</TableCell>
            <TableCell className="px-4 py-4 text-sm text-muted-foreground text-right">{minimumBrl}</TableCell>
            <TableCell className={`px-4 py-4 text-sm font-bold text-right ${isError ? 'text-destructive' : ''}`}>{balanceBrl}</TableCell>
            <TableCell className="px-4 py-4 text-center">
                <Badge variant={isError ? "destructive" : "default"} className={!isError ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" : ""}>
                    {status}
                </Badge>
            </TableCell>
            <TableCell className="px-4 py-4 text-[10px] text-muted-foreground">{date}</TableCell>
            <TableCell className="px-4 py-4">
                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-1 rounded">{data.type ?? '-'}</span>
            </TableCell>
        </TableRow>
    )
}

export default function Saldos() {
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

    useEffect(() => { listBalances() }, [])

    async function getBalances() {
        try {
            setLoading(true)
            await fetch('/api/get-balances')
            await listBalances()
        }
        finally { setLoading(false) }
    }

    const contasOk = businessList.filter(acc => acc.minimum !== 0 && Number(acc.balance) >= Number(acc.minimum) && acc.show === true).length;
    const contasWarning = businessList.filter(acc => acc.minimum !== null && Number(acc.balance) < Number(acc.minimum) && acc.show === true).length;
    const updatedAt = businessList.length > 0 ? new Date(Math.max(...businessList.map(a => new Date(a.updated).getTime()))) : null;
    const formattedTime = updatedAt ? updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--';

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Relatório de Saldos</h1>
                    <p className="text-muted-foreground">Visão consolidada das contas e saúde financeira.</p>
                </div>
                <Button asChild variant="outline" className="shadow-sm font-bold">
                    <Link href="/saldos/edit" className="flex items-center gap-2">
                        <Pen className="h-4 w-4" />
                        Editar Contas
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    title="Contas OK" 
                    value={contasOk.toString().padStart(2, '0')} 
                    icon={<CheckCircle className="h-5 w-5" />} 
                    desc="Todas as contas acima do mínimo." 
                />
                
                <div className={`bg-card border p-6 rounded-xl shadow-sm group ${contasWarning > 0 ? 'border-error border-l-4' : ''}`}>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Em Atenção</p>
                    <div className="flex items-center justify-between">
                        <h3 className={`text-3xl font-black ${contasWarning > 0 ? 'text-destructive' : ''}`}>{contasWarning.toString().padStart(2, '0')}</h3>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${contasWarning > 0 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                        {contasWarning > 0 ? 'Existem contas requerendo atenção.' : 'Sem contas em estado de alerta.'}
                    </p>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl shadow-sm group flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Status do Sistema</p>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold">{loading ? 'Sincronizando...' : 'Sincronizado'}</h3>
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Última: {formattedTime}
                        </div>
                    </div>
                    <Button onClick={getBalances} disabled={loading} variant="outline" size="sm" className="mt-4 w-full font-bold">
                        {loading ? 'Sincronizando...' : 'Forçar Sync'}
                    </Button>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b flex items-center justify-between">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Listagem de Saldos Analítica</h4>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">Exibindo {sortedList.filter(a => a.show).length} registros</span>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Id da Conta</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Nome da Campanha</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Mínimo</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Saldo Atual</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Status</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Atualizado</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Tipo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedList.map((account) => (
                                account.show && <BalanceRow key={account.id} data={account} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, value, icon, desc }: { title: string, value: string, icon: React.ReactNode, desc?: string }) {
    return (
        <div className="bg-card border p-6 rounded-xl shadow-sm group">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">{title}</p>
            <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black">{value}</h3>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {icon}
                </div>
            </div>
            {desc && <p className="mt-4 text-xs text-muted-foreground">{desc}</p>}
        </div>
    )
}

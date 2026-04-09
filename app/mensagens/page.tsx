'use client'

import { useEffect, useState } from "react"
import type { dbBusinessMessaging, FetchGroups } from "@/src/types/evolution"
import type { Business } from "@/src/types/business"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MessageSquare, List, Zap, Save, RefreshCw, X, Edit3 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function MessagingRow({ data, groups }: { data: dbBusinessMessaging, groups: FetchGroups[] }) {
    const [persistedData, setPersistedData] = useState(data)
    const [message, setMessage] = useState(data.message || "")
    const [phone, setPhone] = useState(data.phone || "")
    const [format, setFormat] = useState<'semanal' | 'diario'>(data.format || "diario")
    const [weekdays, setWeekdays] = useState<number[]>(data.weekdays || [])
    const [active, setActive] = useState(data.active ?? false)
    const [isSaving, setIsSaving] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const isDirty = 
        message !== (persistedData.message || "") ||
        phone !== (persistedData.phone || "") ||
        format !== (persistedData.format || "diario") ||
        active !== (persistedData.active ?? false) ||
        JSON.stringify(weekdays) !== JSON.stringify(persistedData.weekdays || [])

    const daysOptions = [
        { label: 'D', value: 0 }, { label: 'S', value: 1 }, { label: 'T', value: 2 },
        { label: 'Q', value: 3 }, { label: 'Q', value: 4 }, { label: 'S', value: 5 }, { label: 'S', value: 6 }
    ]

    const handleDayToggle = (day: number) => {
        setWeekdays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort())
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const payload = { id: data.id, business: data.business, message, phone, format, weekdays, active }
            await fetch('/api/upsert-messaging', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            setPersistedData(payload)
        } finally {
            setIsSaving(false)
        }
    }

    const renderFormattedMessage = (text: string, isPreview: boolean) => {
        const parts = text.split(/(\*.*?\*|\{\{leads\}\})/g)
        return parts.map((part, i) => {
            if (part === '{{leads}}') return isPreview ? '127' : <span key={i} className="text-primary bg-primary/20 rounded-sm">{part}</span>
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                const content = part.slice(1, -1)
                return <strong key={i} className="font-bold">{isPreview ? content : part}</strong>
            }
            return part
        })
    }

    return (
        <TableRow className={isDirty ? "bg-amber-500/[0.02]" : ""}>
            <TableCell className="px-4 py-4 font-mono text-[10px] text-muted-foreground">{data.id}</TableCell>
            <TableCell className="px-4 py-4 font-semibold text-sm">{data.business}</TableCell>
            <TableCell className="px-4 py-4">
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="w-full justify-start truncate max-w-[200px] text-xs">
                    <Edit3 className="h-3 w-3 mr-2" />
                    {message || "Sua mensagem..."}
                </Button>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-background p-6 rounded-xl border w-full max-w-2xl shadow-xl">
                            <div className="flex justify-between mb-4">
                                <h3 className="font-bold">Editar Mensagem</h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="relative h-40 bg-muted rounded-lg p-4 mb-4 overflow-y-auto">
                                <div className="absolute inset-0 p-4 whitespace-pre-wrap break-words pointer-events-none text-sm">
                                    {renderFormattedMessage(message, false)}
                                </div>
                                <textarea
                                    className="absolute inset-0 w-full h-full p-4 bg-transparent border-none text-transparent caret-foreground outline-none resize-none text-sm"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Sua mensagem..."
                                />
                            </div>
                            <div className="mb-4">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">WhatsApp Preview</h4>
                                <div className="bg-[#e5ddd5] dark:bg-[#0b141a] p-4 rounded-lg flex flex-col items-end border">
                                    <div className="bg-[#dcf8c6] dark:bg-[#005c4b] text-[#303030] dark:text-[#e9edef] p-3 rounded-lg rounded-tr-none max-w-[90%] shadow-sm text-[13px] leading-relaxed">
                                        <div className="whitespace-pre-wrap break-words">{renderFormattedMessage(message || "Sua mensagem...", true)}</div>
                                        <div className="text-[9px] opacity-60 text-right mt-1 flex items-center justify-end gap-1">12:45 <span className="font-bold text-[#53bdeb] ml-1">✓✓</span></div>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => setIsModalOpen(false)}>Confirmar</Button>
                        </div>
                    </div>
                )}
            </TableCell>
            <TableCell className="px-4 py-4">
                <Select value={phone} onValueChange={setPhone}>
                    <SelectTrigger className="w-full text-xs h-8">
                        <SelectValue placeholder="Grupo..." />
                    </SelectTrigger>
                    <SelectContent>
                        {groups.map(g => (
                            <SelectItem key={g.id} value={g.id}>{g.name || (g as any).subject}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell className="px-4 py-4">
                <Select value={format} onValueChange={(val: any) => setFormat(val)}>
                    <SelectTrigger className="w-full text-xs h-8">
                        <SelectValue placeholder="Formato..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="diario">Diário</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell className="px-4 py-4">
                <div className="flex gap-1 flex-wrap">
                    {daysOptions.map((day) => (
                        <button key={day.value} onClick={() => handleDayToggle(day.value)} className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${weekdays.includes(day.value) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{day.label}</button>
                    ))}
                </div>
            </TableCell>
            <TableCell className="px-4 py-4 text-center">
                <Switch 
                    checked={active} 
                    onCheckedChange={(checked) => setActive(checked)} 
                />
            </TableCell>
            <TableCell className="px-4 py-4 text-center">
                <Button size="icon" onClick={handleSave} disabled={isSaving} variant={isDirty ? "default" : "outline"} className={isDirty ? "bg-amber-500 hover:bg-amber-600 h-8 w-8" : "h-8 w-8"}>
                    {isSaving ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default function Mensagens() {
    const [combinedData, setCombinedData] = useState<dbBusinessMessaging[]>([])
    const [groups, setGroups] = useState<FetchGroups[]>([])
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            const [bmsRes, groupsRes, configsRes] = await Promise.all([
                fetch('/api/list-businesses'), fetch('/api/list-groups'), fetch('/api/list-messaging')
            ])
            const bms: Business[] = bmsRes.ok ? await bmsRes.json() : []
            const groups: FetchGroups[] = groupsRes.ok ? await groupsRes.json() : []
            const configs: dbBusinessMessaging[] = configsRes.ok ? await configsRes.json() : []
            setGroups(groups)
            const merged = bms.map(bm => {
                const config = configs.find(c => c.id === bm.id)
                return {
                    id: bm.id, business: bm.name,
                    phone: config?.phone || "", message: config?.message || "",
                    weekdays: config?.weekdays || [], format: config?.format || "diario",
                    active: config?.active ?? false
                }
            })
            setCombinedData(merged.sort((a, b) => a.business.localeCompare(b.business)))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const syncGroups = async () => {
        setSyncing(true)
        try {
            await fetch('/api/get-groups')
            await fetchData()
        } finally {
            setSyncing(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Mensagens Automáticas</h1>
                    <p className="text-muted-foreground">Configure os envios para cada conta.</p>
                </div>
                <Button variant="outline" onClick={syncGroups} disabled={syncing} className="font-bold shadow-sm">
                    <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Sincronizando...' : 'Sincronizar Grupos'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="Configuradas" value={combinedData.length} icon={<MessageSquare className="h-5 w-5" />} />
                <MetricCard title="Grupos" value={groups.length} icon={<List className="h-5 w-5" />} />
                <MetricCard title="Ativos" value={combinedData.filter(d => d.active).length} icon={<Zap className="h-5 w-5" />} />
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Gerenciador de Envio</h4>
                    {loading && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">ID BM</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Conta</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Mensagem</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Grupo</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Formato</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Dias</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Ativo</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Salvar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {combinedData.map((msg) => (
                                <MessagingRow key={msg.id} data={msg} groups={groups} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
    return (
        <div className="bg-card border p-6 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">{title}</p>
            <div className="flex items-center justify-between">
                <h3 className="text-4xl font-black">{value}</h3>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">{icon}</div>
            </div>
        </div>
    )
}

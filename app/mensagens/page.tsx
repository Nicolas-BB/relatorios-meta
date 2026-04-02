'use client'

import { useEffect, useState } from "react";
import MensagensTable from "../components/MensagensTable";
import type { dbBusinessMessaging, FetchGroups } from "@/src/types/evolution";
import type { Business } from "@/src/types/business";

export default function Mensagens() {
    const [combinedData, setCombinedData] = useState<dbBusinessMessaging[]>([]);
    const [groups, setGroups] = useState<FetchGroups[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Parallel fetching - now using list-groups (local DB) instead of get-groups (external API)
            const [bmsRes, groupsRes, configsRes] = await Promise.all([
                fetch('/api/list-bms'),
                fetch('/api/list-groups'),
                fetch('/api/list-messaging')
            ]);

            const bms: Business[] = bmsRes.ok ? await bmsRes.json() : [];
            const groups: FetchGroups[] = groupsRes.ok ? await groupsRes.json() : [];
            const configs: dbBusinessMessaging[] = configsRes.ok ? await configsRes.json() : [];

            setGroups(groups);

            // Merge BMs with their configurations
            const merged = bms.map(bm => {
                const config = configs.find(c => c.id === bm.id);
                return {
                    id: bm.id,
                    business: bm.name,
                    phone: config?.phone || "",
                    message: config?.message || "",
                    weekdays: config?.weekdays || [],
                    format: config?.format || "diario",
                    active: config?.active ?? false
                };
            });

            const sorted = merged.sort((a, b) => a.business.localeCompare(b.business));

            setCombinedData(sorted);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        try {
            setIsSyncing(true);
            // Sincronizar grupos a partir da API do Evolution e salvar no banco
            const res = await fetch('/api/get-groups');
            if (res.ok) {
                // Após o sync, recarregar os dados do banco local
                await fetchData();
            }
        } catch (error) {
            console.error("Erro ao sincronizar grupos:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-on-surface tracking-tight leading-none mb-2">Mensagens Automáticas</h1>
                    <p className="text-on-surface-variant font-medium">Configure as mensagens enviadas aos grupos para cada conta de anúncio.</p>
                </div>
                <button 
                    onClick={handleSync}
                    disabled={loading || isSyncing}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-bold rounded-lg transition-colors border border-outline-variant/10 shadow-sm"
                >
                    <span className={`material-symbols-outlined text-lg ${isSyncing ? 'animate-spin' : ''}`}>
                        {isSyncing ? 'progress_activity' : 'sync'}
                    </span>
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar Grupos'}
                </button>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[4px_0_24px_-4px_rgba(44,52,55,0.06)] group">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Total de BMs</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-4xl font-black text-on-surface">{combinedData.length}</h3>
                        <div className="w-12 h-12 bg-primary-container/30 rounded-full flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined" data-icon="business_center" style={{ fontVariationSettings: "'FILL' 1" }}>business_center</span>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[4px_0_24px_-4px_rgba(44,52,55,0.06)] group">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Grupos Disponíveis</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-4xl font-black text-on-surface">{groups.length}</h3>
                        <div className="w-12 h-12 bg-tertiary-container/30 rounded-full flex items-center justify-center text-tertiary">
                            <span className="material-symbols-outlined" data-icon="groups" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[4px_0_24px_-4px_rgba(44,52,55,0.06)] group">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Envios Ativos</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-4xl font-black text-on-surface">{combinedData.filter(d => d.active).length}</h3>
                        <div className="w-12 h-12 bg-primary-container/30 rounded-full flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined" data-icon="flash_on" style={{ fontVariationSettings: "'FILL' 1" }}>flash_on</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_32px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-6 py-5 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Gerenciador de Envio</h4>
                        {loading && <span className="material-symbols-outlined animate-spin text-primary text-sm">progress_activity</span>}
                    </div>
                </div>

                <div className="overflow-x-auto relative min-h-[300px]">
                    {loading && combinedData.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                        </div>
                    ) : (
                        <MensagensTable data={combinedData} groups={groups} />
                    )}
                </div>
            </div>
        </div>
    );
}

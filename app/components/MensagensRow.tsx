'use client'

import { useState, useEffect } from "react";
import type { dbBusinessMessaging, FetchGroups } from "@/src/types/evolution";

interface MensagensRowProps {
    data: dbBusinessMessaging;
    groups: FetchGroups[];
}

export default function MensagensRow({ data, groups }: MensagensRowProps) {
    const [message, setMessage] = useState(data.message || "");
    const [phone, setPhone] = useState(data.phone || "");
    const [format, setFormat] = useState<'semanal' | 'diario'>(data.format || "diario");
    const [weekdays, setWeekdays] = useState<number[]>(data.weekdays || []);
    const [active, setActive] = useState(data.active ?? false);
    const [isSaving, setIsSaving] = useState(false);

    const daysOptions = [
        { label: 'dom', value: 0 },
        { label: 'seg', value: 1 },
        { label: 'ter', value: 2 },
        { label: 'qua', value: 3 },
        { label: 'qui', value: 4 },
        { label: 'sex', value: 5 },
        { label: 'sab', value: 6 },
    ];

    const handleDayToggle = (day: number) => {
        if (format === 'semanal') {
            setWeekdays([day]);
        } else {
            if (weekdays.includes(day)) {
                setWeekdays(weekdays.filter(d => d !== day));
            } else {
                setWeekdays([...weekdays, day].sort());
            }
        }
    };

    // When switching to semanal, if more than 1 day is selected, keep only the first one
    useEffect(() => {
        if (format === 'semanal' && weekdays.length > 1) {
            setWeekdays([weekdays[0]]);
        }
    }, [format]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const payload: dbBusinessMessaging = {
                id: data.id,
                business: data.business,
                message,
                phone,
                format,
                weekdays,
                active
            };

            const res = await fetch('/api/upsert-messaging', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Falha ao salvar');

            // Optional: visual feedback for success
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar as configurações');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <tr className="hover:bg-surface-container-high transition-colors">
            <td className="px-4 py-5 font-mono text-[10px] text-on-surface-variant font-medium">{data.id}</td>
            <td className="px-4 py-5 text-sm font-semibold text-on-surface whitespace-nowrap">{data.business}</td>

            {/* Mensagem Botão / Modal */}
            <td className="px-4 py-5">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 rounded-lg hover:bg-surface-container-low hover:border-outline transition-colors w-full text-left overflow-hidden whitespace-nowrap text-ellipsis max-w-[250px]"
                    title={message || "Clique para adicionar uma mensagem"}
                >
                    <span className="material-symbols-outlined text-base min-w-[16px]">edit_note</span>
                    {message ? (
                        <span className="truncate">{message}</span>
                    ) : (
                        <span className="text-on-surface-variant/50 italic truncate">Sua mensagem...</span>
                    )}
                </button>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-2xl w-full max-w-2xl border border-outline-variant/10 text-left">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-on-surface">Editar Mensagem</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 hover:bg-surface-container-highest rounded-full transition-colors text-on-surface-variant"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <p className="text-xs text-on-surface-variant mb-4">
                                Dica: Utilize <span className="font-mono bg-primary/10 text-primary px-1 rounded whitespace-nowrap">{'{{leads}}'}</span> para injetar a quantidade de leads capturados na mensagem enviada.
                            </p>

                            <div className="relative w-full h-48 bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden mb-6">
                                {/* Highlighter Layer */}
                                <div
                                    className="absolute inset-0 p-4 text-sm font-sans pointer-events-none whitespace-pre-wrap overflow-hidden break-words"
                                    aria-hidden="true"
                                >
                                    {message.split(/(\{\{leads\}\})/g).map((part, i) => (
                                        part === '{{leads}}'
                                            ? <span key={i} className="text-primary bg-primary/20 rounded-sm outline outline-1 outline-primary/10">{part}</span>
                                            : <span key={i} className="text-on-surface">{part}</span>
                                    ))}
                                    {!message && <span className="text-on-surface-variant opacity-50">Sua mensagem...</span>}
                                </div>
                                {/* Input Layer */}
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Sua mensagem..."
                                    className="absolute inset-0 w-full h-full p-4 text-sm font-sans bg-transparent border-none focus:ring-2 focus:ring-primary/50 focus:outline-none text-transparent caret-on-surface placeholder:text-transparent resize-none z-10"
                                    spellCheck={false}
                                />
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-sm font-bold bg-primary text-on-primary shadow-sm hover:shadow-md rounded-lg transition-all"
                                >
                                    Concluído
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </td>

            {/* Grupo Dropdown */}
            <td className="px-4 py-5">
                <select
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-on-surface"
                >
                    <option value="">Selecione o Grupo</option>
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name || (g as any).subject}</option>
                    ))}
                </select>
            </td>

            {/* Formato Dropdown */}
            <td className="px-4 py-5">
                <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as 'semanal' | 'diario')}
                    className="w-full px-3 py-2 text-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-on-surface"
                >
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                </select>
            </td>

            {/* Dias da Semana Selection */}
            <td className="px-4 py-5">
                <div className="flex gap-1 flex-wrap min-w-[140px]">
                    {daysOptions.map((day) => (
                        <button
                            key={day.value}
                            onClick={() => handleDayToggle(day.value)}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${weekdays.includes(day.value)
                                ? 'bg-primary text-on-primary border-primary'
                                : 'bg-surface-container-low text-on-surface-variant hover:border-outline border-transparent'
                                }`}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>
            </td>

            {/* Ativo Slider/Toggle */}
            <td className="px-4 py-5 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </td>

            {/* Action Column (Save) */}
            <td className="px-4 py-5 text-center">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`p-2 rounded-full transition-all ${isSaving
                        ? 'bg-surface-container-highest text-on-surface-variant animate-pulse'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary shadow-sm hover:shadow-md'
                        }`}
                    title="Salvar"
                >
                    <span className="material-symbols-outlined text-lg">
                        {isSaving ? 'progress_activity' : 'save'}
                    </span>
                </button>
            </td>
        </tr>
    );
}

'use client'

import { useState, useEffect, useRef } from "react";
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
    const [savedData, setSavedData] = useState(data);

    const isDirty = 
        message !== (savedData.message || "") ||
        phone !== (savedData.phone || "") ||
        format !== (savedData.format || "diario") ||
        JSON.stringify([...weekdays].sort()) !== JSON.stringify([...(savedData.weekdays || [])].sort()) ||
        active !== (savedData.active ?? false);

    const highlighterRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (highlighterRef.current) {
            highlighterRef.current.scrollTop = e.currentTarget.scrollTop;
        }
    };

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

    const renderFormattedMessage = (text: string, isPreview: boolean) => {
        const parts = text.split(/(\*.*?\*|\{\{leads\}\})/g);
        return parts.map((part, i) => {
            if (part === '{{leads}}') {
                if (isPreview) return '127';
                return (
                    <span key={i} className="text-primary bg-primary/20 rounded-sm outline outline-1 outline-primary/10">
                        {part}
                    </span>
                );
            }
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                const content = part.slice(1, -1);
                return (
                    <strong key={i} className="font-bold">
                        {isPreview ? content : part}
                    </strong>
                );
            }
            return part;
        });
    };

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

            setSavedData(payload);
            // Optional: visual feedback for success
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar as configurações');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <tr className={`hover:bg-surface-container-high transition-all border-l-4 ${isDirty ? 'border-amber-500 bg-amber-500/[0.02]' : 'border-transparent'}`}>
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
                    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 py-8 overflow-y-auto">
                        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-2xl w-full max-w-2xl border border-outline-variant/10 text-left my-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-on-surface">Editar Mensagem</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 hover:bg-surface-container-highest rounded-full transition-colors text-on-surface-variant"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <p className="text-xs text-on-surface-variant mb-4 font-medium italic">
                                Dica: Utilize <span className="font-mono bg-primary/10 text-primary px-1 rounded whitespace-nowrap">{'{{leads}}'}</span> para dinâmico e <span className="font-mono bg-surface-container-highest text-on-surface px-1 rounded whitespace-nowrap">*texto*</span> para <span className="font-bold">negrito</span>.
                            </p>

                            <div className="relative w-full h-48 bg-surface-container-low border border-outline-variant/30 rounded-xl mb-6 overflow-hidden">
                                {/* Highlighter Layer */}
                                <div
                                    ref={highlighterRef}
                                    className="absolute inset-0 p-4 text-sm font-sans pointer-events-none whitespace-pre-wrap overflow-hidden break-words text-on-surface"
                                    aria-hidden="true"
                                >
                                    {renderFormattedMessage(message, false)}
                                    {!message && <span className="text-on-surface-variant opacity-50">Sua mensagem...</span>}
                                </div>
                                {/* Input Layer */}
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onScroll={handleScroll}
                                    placeholder="Sua mensagem..."
                                    className="absolute inset-0 w-full h-full p-4 text-sm font-sans bg-transparent border-none focus:ring-2 focus:ring-primary/50 focus:outline-none text-transparent caret-on-surface placeholder:text-transparent resize-none z-10 overflow-y-auto"
                                    spellCheck={false}
                                />
                            </div>

                            <div className="mb-2">
                                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">Visualização no WhatsApp</h4>
                                <div className="bg-[#e5ddd5] dark:bg-[#0b141a] p-6 rounded-xl relative overflow-hidden min-h-[120px] flex flex-col justify-center border border-outline-variant/5">
                                    {/* Simulating WhatsApp Background Pattern */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://whatsapp-clone-react-js.netlify.app/static/media/bg-chat-light.6ef99017.png')] bg-repeat"></div>
                                    
                                    <div className="relative z-10 flex flex-col items-end">
                                        <div className="bg-[#dcf8c6] dark:bg-[#005c4b] text-[#303030] dark:text-[#e9edef] p-3 rounded-lg rounded-tr-none max-w-[90%] shadow-sm relative text-[13px] leading-relaxed min-w-[120px]">
                                            <div className="whitespace-pre-wrap break-words">
                                                {renderFormattedMessage(message || "Sua mensagem aparecerá aqui...", true)}
                                            </div>
                                            <div className="text-[9px] opacity-60 text-right mt-1 flex items-center justify-end gap-1">
                                                12:45
                                                <span className="material-symbols-outlined text-[14px] text-[#53bdeb] scale-90" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                                            </div>
                                            {/* The "tail" of the bubble */}
                                            <svg className="absolute -right-[8px] top-0 text-[#dcf8c6] dark:text-[#005c4b] fill-current" width="8" height="13" viewBox="0 0 8 13">
                                                <path d="M5.188 0H0v11.193l6.467-8.273C7.335 1.83 6.448 0 5.188 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-2.5 text-sm font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 rounded-xl transition-all active:scale-95"
                                >
                                    Confirmar Mensagem
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
                    className={`p-2 rounded-full transition-all relative ${isSaving
                        ? 'bg-surface-container-highest text-on-surface-variant animate-pulse'
                        : isDirty 
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 scale-110'
                            : 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary shadow-sm hover:shadow-md'
                        }`}
                    title={isDirty ? "Salvar alterações pendentes" : "Salvar"}
                >
                    <span className="material-symbols-outlined text-lg">
                        {isSaving ? 'progress_activity' : 'save'}
                    </span>
                    {isDirty && !isSaving && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-surface-container-lowest flex items-center justify-center">
                                <span className="text-[10px] text-white font-black">!</span>
                            </span>
                        </span>
                    )}
                </button>
            </td>
        </tr>
    );
}

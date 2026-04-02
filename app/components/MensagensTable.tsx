import type { dbBusinessMessaging, FetchGroups } from "@/src/types/evolution";
import MensagensRow from "./MensagensRow";

interface MensagensTableProps {
    data: dbBusinessMessaging[];
    groups: FetchGroups[];
}

export default function MensagensTable({ data, groups }: MensagensTableProps) {
    return (
        <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
                <tr className="bg-surface-container-low/30 text-on-surface-variant">
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest w-[100px]">ID BM</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest w-[150px]">Conta</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest min-w-[250px]">Mensagem</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest w-[180px]">Grupo</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest w-[120px]">Formato</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest w-[160px]">Dias da Semana</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center w-[80px]">Ativo</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center w-[80px]">Ação</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
                {data.map((msg) => (
                    <MensagensRow key={msg.id} data={msg} groups={groups} />
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-on-surface-variant text-sm">
                            Nenhuma conta encontrada. Verifique a conexão com a API do Meta.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

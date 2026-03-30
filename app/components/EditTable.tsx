import { pgAccount } from "@/src/types/business";
import EditRow from "./EditRow";
import styles from "@/src/styles/components/table.module.css"

export default function EditTable({ data, onChange }: { data: pgAccount[], onChange: (updated: pgAccount[]) => void }) {
    const handleRowChange = (updatedRow: pgAccount) => {
        const newData = data.map(d => d.id === updatedRow.id ? updatedRow : d)
        onChange(newData)
    }

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Mínimo</th>
                    <th>Tipo</th>
                    <th>Mostrar</th>
                </tr>
            </thead>
            <tbody>
                {data.map((account) => (
                    <EditRow key={account.id} data={account} onChange={handleRowChange}></EditRow>
                ))}
            </tbody>
        </table>
    )
}

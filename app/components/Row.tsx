import { pgAccount } from '@/src/types/business'
import styles from '@/src/styles/components/row.module.css'

export default function Row({ data }: { data: pgAccount }) {
    const balanceBrl = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(data.balance)

    const minimumBrl = data.minimum === null ? '-' : new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(data.minimum)

    const date = new Date(data.updated).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

    const status = data.minimum !== 0 && Number(data.balance) >= Number(data.minimum) ? 'Ok' : 'Atenção'

    return (
        <tr className={status === 'Atenção' ? styles.attention : ''}>
            <td><p>{data.id}</p></td>
            <td><p>{data.name}</p></td>
            <td><p>{minimumBrl ?? '-'}</p></td>
            <td><p>{balanceBrl}</p></td>
            <td><p>{status}</p></td>
            <td><p>{date}</p></td>
            <td><p>{data.type ?? '-'}</p></td>
        </tr>
    )
}

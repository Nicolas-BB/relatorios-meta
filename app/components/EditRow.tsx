import { pgAccount } from '@/src/types/business'
import { useState } from 'react'

export default function Row({ data, onChange }: { data: pgAccount, onChange: (updated: pgAccount) => void }) {
    const [minimum, setMinimum] = useState<number | ''>(data.minimum ?? '')
    const [type, setType] = useState<string>(data.type ?? '')

    const handleMinimumChange = (value: number | '') => {
        setMinimum(value)
        onChange({ ...data, minimum: value === '' ? null : value, type })
    }

    const handleTypeChange = (value: string) => {
        setType(value)
        onChange({ ...data, minimum: minimum === '' ? null : minimum, type: value })
    }

    return (
        <tr>
            <td><p>{data.id}</p></td>
            <td><p>{data.name}</p></td>
            <td>
                <input
                    type="number"
                    value={minimum}
                    placeholder='Informe o valor'
                    onChange={(e) => handleMinimumChange(e.target.value === '' ? '' : Number(e.target.value))}
                />
            </td>
            <td>
                <select
                    name="type"
                    id="type"
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                >
                    <option value="" disabled>Selecione o tipo</option>
                    <option value="Pix">Pix</option>
                    <option value="Cartão">Cartão</option>
                </select>
            </td>
            <td>
                <input type="checkbox" name="show" id="show" checked={data.show} />
            </td>
        </tr>
    )
}

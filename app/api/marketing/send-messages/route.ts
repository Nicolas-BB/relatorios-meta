// ================================================================================
// Rota que busca os leads da RD Station e envia uma mensagem para cada um. Horários baseados em UTC 0
// ================================================================================

import { listRdStationLeads } from "@/src/repositories/listRdStationLeads";
import { getRdStationMessage } from "@/src/services/getRdStationMessage";
import { sendMessageCloudAPI } from "@/src/services/sendMessageCloudAPI";
import { NextResponse } from "next/server"

export async function POST() {
    const eventDate = new Date(Date.UTC(2026, 4, 7))
    const now = new Date()
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))

    const diff = eventDate.getTime() - todayUTC.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    const hoursUTC = now.getUTCHours()

    // O horário de envio é 3 horas a mais do que o horário atual porque o servidor está em UTC
    if (![7, 4, 1, 0, -1, -3, -4, -5].includes(days) || ![(9 + 3), (18 + 3), (19 + 3), (20 + 3)].includes(hoursUTC)) return NextResponse.json({ success: false, error: 'Não é o dia ou horário de envio' })

    const key = `${days}/${hoursUTC - 3}`

    const message = await getRdStationMessage(key)

    if (message === 'Mensagem não encontrada') return NextResponse.json({ success: false, error: 'Mensagem não encontrada' })

    const leads = await listRdStationLeads()

    if (!leads) return NextResponse.json({ success: false, error: 'Erro ao buscar leads' })

    for (const lead of leads) {
        const result = await sendMessageCloudAPI(lead.phone, message)

        if (!result.success) {
            console.error(`Erro ao enviar mensagem para ${lead.phone}: ${result.error}`)
        }
    }

    return NextResponse.json({ success: true })
}

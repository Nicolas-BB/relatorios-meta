import { dbBusinessMessaging } from '@/src/types/evolution';
import { sumLeadsByPeriod } from '@/src/repositories/sumLeadsByPeriod';
import { NextResponse } from "next/server";

export async function sendMessage(data: dbBusinessMessaging, initialLeads: number) {
    if (!data.active || !data.phone || data.weekdays.length === 0 || !data.message || !data.message.includes('{{leads}}')) {
        console.log(`[Messaging] Skipping BM ${data.id}: Invalid configuration or inactive.`);
        return { success: false, error: "Dados inválidos" };
    }

    const today = new Date().getDay();
    if (!data.weekdays.includes(today)) {
        console.log(`[Messaging] Skipping BM ${data.id}: Today is not a scheduled day.`);
        return { success: true, message: "Hoje não é dia de envio para esta conta" };
    }

    let leads = initialLeads;

    if (data.format === 'semanal') {
        const now = new Date();
        const lastSaturday = new Date();
        lastSaturday.setDate(now.getDate() - now.getDay() - 1);

        const previousSunday = new Date();
        previousSunday.setDate(lastSaturday.getDate() - 6);

        const startDate = previousSunday.toISOString().split('T')[0];
        const endDate = lastSaturday.toISOString().split('T')[0];

        leads = await sumLeadsByPeriod(data.id, startDate, endDate);
    }

    const messageToSend = leads > 0
        ? data.message.replace('{{leads}}', leads.toString()).replace(/\\n/g, '\n')
        : data.format === 'semanal'
            ? `Bom dia, pessoal!

Nas última semana não tivemos entrada de novos leads no sistema.

Poderiam confirmar, por gentileza, se realmente não houve entrada de novos contatos para vocês nesse período?

Esse retorno nos ajuda a acompanhar o desempenho da conta e identificar oportunidades de melhoria na geração de novos leads.`
            : `Bom dia, pessoal!

Nas últimas 24 horas não tivemos entradas de novos leads no sistema.

Poderiam confirmar, por gentileza, se realmente não houve entrada de novos contatos para vocês nesse período?

Esse retorno nos ajuda a acompanhar o desempenho da conta e identificar oportunidades de melhoria na geração de novos leads.`;

    const url: string = 'https://baseservidor-evolution-api.kwlyqm.easypanel.host/message/sendText/RD';

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": `${process.env.EVOLUTION_API_KEY}`
            },
            body: JSON.stringify({
                "number": `${data.phone}`,
                "text": `${messageToSend}`
            })
        });

        if (!res.ok) {
            throw new Error(`Erro na API Evolution: ${res.statusText}`);
        }

        console.log(`[Messaging] Successfully sent message for BM ${data.id}`);
        return { success: true };
    } catch (error) {
        console.error(`[Messaging] Error sending message for BM ${data.id}:`, error);
        return { success: false, error: (error as Error).message };
    }
}

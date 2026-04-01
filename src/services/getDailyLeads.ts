import 'dotenv/config'

export async function getDailyLeads(accountId: string) {
    const url = `https://graph.facebook.com/v25.0/${accountId}/insights?fields=campaign_name,actions&filtering=[{"field":"action_type","operator":"IN","value":["onsite_conversion.messaging_conversation_started_7d"]}]&date_preset=yesterday`

    try {
        const response: Response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.BEARER_TOKEN}`
            }
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const data = await response.json()

        return data
    }
    catch (error) {
        console.log((error as Error).message)
    }
}

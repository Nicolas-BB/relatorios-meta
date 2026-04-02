import 'dotenv/config'
import type { FetchGroups } from '../types/evolution'

export async function getGroups(): Promise<FetchGroups[]> {
    const url: string = 'https://baseservidor-evolution-api.kwlyqm.easypanel.host/group/fetchAllGroups/RD?getParticipants=false'

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': `${process.env.EVOLUTION_API_KEY}`
            }
        })

        const data: FetchGroups[] = await response.json()

        console.log(data)

        return data
    }
    catch (error) {
        console.error('Error fetching groups:', error)
        return []
    }
}

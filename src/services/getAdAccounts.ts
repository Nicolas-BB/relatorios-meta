import type { AdAccountsResponse, Business } from "../types/business"

export async function getAdAccounts(data: Business): Promise<AdAccountsResponse> {
    const url: string = `https://graph.facebook.com/v25.0/${data.id}/owned_ad_accounts?limit=200`

    try {
        const response: Response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
            }
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const data: AdAccountsResponse = await response.json()

        console.log('getAdAccounts =', data)

        return data
    }
    catch (error) {
        console.error((error as Error).message)

        throw error
    }
}

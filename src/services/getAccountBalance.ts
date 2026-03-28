import type { AdAccountBalanceResponse, AdAccounts, AdAccountsResponse } from "../types/business.js";

export async function getAccountBalance(data: AdAccounts): Promise<AdAccountBalanceResponse> {
    const url: string = `https://graph.facebook.com/v25.0/${data.id}?fields=balance,currency,funding_source_details,name,is_prepay_account`

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

        const json: AdAccountBalanceResponse = await response.json()

        console.log('getAccountBalance =', json)

        return json
    }
    catch (error) {
        console.error((error as Error).message)
        throw error
    }
}

import { upsertBalance } from "../repositories/upsertBalance";
import type { AccountInfo, AdAccountBalanceResponse, AdAccountsResponse, Business, BusinessResponse } from "../types/business";
import { getAccountBalance } from "./getAccountBalance";
import { getAdAccounts } from "./getAdAccounts"

export async function loopOverBusinesses(data: BusinessResponse) {
    const businesses: Business[] = data.data

    for (const e of businesses) {
        const accounts: AdAccountsResponse = await getAdAccounts(e)

        for (const account of accounts.data) {
            const accountData: AdAccountBalanceResponse = await getAccountBalance(account)

            const brl: number = accountData.is_prepay_account
                ? Number(accountData.funding_source_details.display_string.match(/[\d.,]+/)?.[0]?.replace(/[.,]/g, '')) / 100
                : Number(accountData.balance) / 100

            const accountInfo: AccountInfo = {
                id: accountData.id,
                name: accountData.name,
                balance: brl
            }

            brl !== 0 && upsertBalance(accountInfo)
        }
    }
}

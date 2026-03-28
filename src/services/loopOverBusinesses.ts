import { sendBalance } from "../db/queries.js";
import type { AccountInfo, AdAccountBalanceResponse, AdAccountsResponse, Business, BusinessResponse } from "../types/business.js";
import { getAccountBalance } from "./getAccountBalance.js";
import { getAdAccounts } from "./getAdAccounts.js"

export async function loopOverBusinesses(data: BusinessResponse) {
    const businesses: Business[] = data.data

    for (const e of businesses) {
        const accounts: AdAccountsResponse = await getAdAccounts(e)

        for (const account of accounts.data) {
            const accountData: AdAccountBalanceResponse = await getAccountBalance(account)

            const balance: number = accountData.is_prepay_account ? Number(accountData.funding_source_details.display_string.match(/[\d.,]+/)?.[0]?.replace(/[.,]/g, '')) / 100 : Number(accountData.balance)

            const brl: number = Number(balance.toFixed(2))

            console.log(brl)

            const accountInfo: AccountInfo = {
                id: accountData.id,
                name: accountData.name,
                balance: brl
            }

            balance !== 0 && await sendBalance(accountInfo)
        }
    }
}

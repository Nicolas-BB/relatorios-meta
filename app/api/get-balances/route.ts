import { upsertBalance } from "@/src/repositories/upsertBalance";
import { getAccountBalance } from "@/src/services/getAccountBalance";
import { getAdAccounts } from "@/src/services/getAdAccounts";
import { getBusinesses } from "@/src/services/getBusinesses";
import { AccountInfo, AdAccountBalanceResponse, AdAccountsResponse, BusinessResponse } from "@/src/types/business";
import { NextResponse } from "next/server";

export async function GET() {
    const businesses: BusinessResponse = await getBusinesses()

    for (const business of businesses.data) {
        const accounts: AdAccountsResponse = await getAdAccounts(business)

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

            upsertBalance(accountInfo)
        }
    }

    return NextResponse.json({ ok: true })
}

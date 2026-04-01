import { insertLeads } from "@/src/repositories/insertLeads";
import { getAdAccounts } from "@/src/services/getAdAccounts";
import { getBusinesses } from "@/src/services/getBusinesses";
import { getDailyLeads } from "@/src/services/getDailyLeads";
import { AdAccountsResponse, BmLead, BusinessResponse } from "@/src/types/business";
import { NextResponse } from "next/server";

export async function GET() {
    const businesses: BusinessResponse = await getBusinesses()

    for (const business of businesses.data) {
        const accounts: AdAccountsResponse = await getAdAccounts(business)

        let leadCount = 0

        for (const account of accounts.data) {
            const leads = await getDailyLeads(account.id)

            console.log('leads = ', leads)

            leadCount += leads.data?.[0]?.actions?.[0]?.value ?? 0

        }

        const businessLeads: BmLead = {
            id: business.id,
            bm: business.name,
            total: leadCount
        }

        console.log('businessLeads = ', businessLeads)

        insertLeads(businessLeads)
    }

    return NextResponse.json({ ok: true })
}

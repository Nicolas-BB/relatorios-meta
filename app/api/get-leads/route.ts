import { insertLeads } from "@/src/repositories/insertLeads";
import { listBusinesses } from "@/src/repositories/listBusinesses";
import { listMessaging } from "@/src/repositories/listMessaging";
import { getAdAccounts } from "@/src/services/getAdAccounts";
import { getDailyLeads } from "@/src/services/getDailyLeads";
import { sendMessage } from "@/src/services/sendMessage";
import { AdAccountsResponse, BmLead } from "@/src/types/business";
import { dbBusinessMessaging } from "@/src/types/evolution";
import { NextResponse } from "next/server";

export async function GET() {
    const businesses = await listBusinesses()
    const messagingConfigs: dbBusinessMessaging[] = await listMessaging() as any[]

    for (const business of businesses) {
        const accounts: AdAccountsResponse = await getAdAccounts(business)

        let leadCount: number = 0

        for (const account of accounts.data) {
            const leads = await getDailyLeads(account.id)

            leadCount += Number(leads.data?.[0]?.actions?.[0]?.value ?? 0)
        }

        const businessLeads: BmLead = {
            id: business.id,
            bm: business.name,
            total: leadCount
        }

        // Save to DB
        await insertLeads(businessLeads)

        // Find messaging config and send message
        const config = messagingConfigs.find(c => c.id === business.id)
        if (config) {
            await sendMessage(config, leadCount)
        }
    }

    return NextResponse.json({ ok: true })
}

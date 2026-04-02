import { NextResponse } from "next/server";
import { listLeads } from "@/src/repositories/listLeads";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const bm = searchParams.get('bm');

    try {
        const rows = await listLeads(startDate, endDate, bm);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}

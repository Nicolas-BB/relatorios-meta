import { upsertGroups } from "@/src/repositories/upsertGroups";
import { getGroups } from "@/src/services/getGroups";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await getGroups()

        for (const group of res) {
            upsertGroups(group)
        }

        // Standardize the response to match the DB schema (id, name)
        const standardized = res.map(g => ({
            id: g.id,
            name: g.subject
        }))

        return NextResponse.json(standardized)
    } catch (error) {
        console.error(error)
        return NextResponse.json([])
    }
}

import { listBalances } from "@/src/services/listBalances"
import { NextResponse } from "next/server"

export async function GET() {
    const res = await listBalances()

    return NextResponse.json(res)
}

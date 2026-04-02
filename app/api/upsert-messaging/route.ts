import { upsertMessaging } from "@/src/repositories/upsertMessaging";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json()
    await upsertMessaging(data)

    return NextResponse.json({ ok: true })
}

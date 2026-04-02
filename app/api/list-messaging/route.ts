import { listMessaging } from "@/src/repositories/listMessaging";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await listMessaging()
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json([])
    }
}
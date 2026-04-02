import { listBusinesses } from "@/src/repositories/listBusinesses";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await listBusinesses();
        return NextResponse.json(data || []);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Falha ao buscar BMs do banco' }, { status: 500 });
    }
}

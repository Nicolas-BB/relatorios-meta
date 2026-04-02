import { getBusinesses } from "@/src/services/getBusinesses";
import { upsertBusinesses } from "@/src/repositories/upsertBusinesses";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await getBusinesses();
        const businesses = response.data || [];

        for (const bm of businesses) {
            await upsertBusinesses(bm);
        }

        return NextResponse.json({
            success: true,
            count: businesses.length,
            message: `${businesses.length} BMs sincronizados com sucesso.`
        });
    } catch (error) {
        console.error("Erro na sincronização de BMs:", error);
        return NextResponse.json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}

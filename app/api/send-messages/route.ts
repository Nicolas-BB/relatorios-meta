import { sendMessage } from "@/src/services/sendMessage";
import { dbBusinessMessaging } from "@/src/types/evolution";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { data, leads }: { data: dbBusinessMessaging, leads: number } = await req.json();
        
        const result = await sendMessage(data, leads);
        
        if (!result.success) {
            return NextResponse.json({ error: result.error || "Erro ao enviar mensagem" }, { status: 400 });
        }

        return NextResponse.json({ ok: true, message: result.message });
    } catch (error) {
        console.error("Erro no manipulador de mensagens:", error);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}

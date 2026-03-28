import type { AccountInfo } from "../types/business.js";
import { pool } from "./pool.js";

export async function sendBalance(data: AccountInfo) {
    await pool.query(
        `INSERT INTO meta.saldos (id, conta, atual, atualizado)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id)
        DO UPDATE SET
            atual = EXCLUDED.atual,
            atualizado = EXCLUDED.atualizado`,
        [data.id, data.name, data.balance, new Date()]
    )
}

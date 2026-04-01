import { pool } from "../lib/db";
import type { AccountInfo } from "../types/business";

export async function upsertBalance(data: AccountInfo) {
    await pool.query(`
        INSERT INTO meta.balances (id, name, balance, updated)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id)
        DO UPDATE SET
            balance = EXCLUDED.balance,
            updated = EXCLUDED.updated
        `, [data.id, data.name, data.balance, new Date()]
    )
}

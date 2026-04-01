import { pool } from "../lib/db";
import type { PgAccount } from "../types/business";

export async function upsertAccounts(data: PgAccount) {
    await pool.query(`
            UPDATE meta.balances
            SET minimum=$1, type=$2, show=$3
            WHERE id=$4
        `, [data.minimum, data.type, data.show, data.id]
    )
}

import { pool } from "../lib/db";
import type { BmLead } from "../types/business";

export async function insertLeads(data: BmLead) {
    await pool.query(`
        INSERT INTO meta.leads (id, bm, total, date)
        VALUES ($1, $2, $3, $4)
        `, [data.id, data.bm, data.total, new Date()]
    )
}

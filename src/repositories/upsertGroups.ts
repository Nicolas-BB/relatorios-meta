import { pool } from "../lib/db";
import type { FetchGroups } from "../types/evolution";

export async function upsertGroups(data: FetchGroups) {
    await pool.query(`
        INSERT INTO meta.groups (id, name)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [data.id, data.subject])
}

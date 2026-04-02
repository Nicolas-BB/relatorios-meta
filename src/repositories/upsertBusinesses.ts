import { pool } from "@/src/lib/db"
import type { Business } from "../types/business"

export async function upsertBusinesses(data: Business) {
    await pool.query(`
        INSERT INTO meta.businesses (id, name)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [data.id, data.name])
}

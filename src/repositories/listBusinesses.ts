import { pool } from "@/src/lib/db"
import type { Business } from "../types/business"

export async function listBusinesses(): Promise<Business[]> {
    const res = await pool.query(
        `SELECT * FROM meta.businesses`
    )

    return res.rows
}

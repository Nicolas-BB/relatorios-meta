import { pool } from "@/src/lib/db"

export async function listMessaging() {
    const res = await pool.query(
        `SELECT * FROM meta.messaging`
    )

    return res.rows
}

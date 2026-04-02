import { pool } from "@/src/lib/db";

export async function listLeads(startDate: string | null, endDate: string | null, bm: string | null) {
    let query = `SELECT * FROM meta.leads WHERE 1=1`;
    const values: any[] = [];
    let paramIndex = 1;

    if (startDate) {
        query += ` AND date >= $${paramIndex}`;
        values.push(`${startDate} 00:00:00`);
        paramIndex++;
    }

    if (endDate) {
        query += ` AND date <= $${paramIndex}`;
        values.push(`${endDate} 23:59:59`);
        paramIndex++;
    }

    if (bm) {
        query += ` AND bm ILIKE $${paramIndex}`;
        values.push(`%${bm}%`);
        paramIndex++;
    }

    query += ` ORDER BY LOWER(bm) ASC, date DESC`;

    const res = await pool.query(query, values);
    return res.rows;
}

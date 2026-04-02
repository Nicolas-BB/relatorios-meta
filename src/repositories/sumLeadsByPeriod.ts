import { pool } from "@/src/lib/db";

export async function sumLeadsByPeriod(bmId: string, startDate: string, endDate: string): Promise<number> {
    const query = `
        SELECT SUM(total) as total 
        FROM meta.leads 
        WHERE id = $1 AND date >= $2 AND date <= $3
    `;
    const values = [bmId, startDate, endDate];

    try {
        const res = await pool.query(query, values);
        return Number(res.rows[0]?.total || 0);
    } catch (error) {
        console.error('Error summing leads by period:', error);
        return 0;
    }
}

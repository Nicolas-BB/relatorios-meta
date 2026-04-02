import { pool } from "../lib/db";

export async function upsertMessaging(data: { id: string, business: string, phone?: string, message?: string, weekdays?: number[], format?: 'semanal' | 'diario', active?: boolean }) {
    await pool.query(`
        INSERT INTO meta.messaging (id, business, phone, message, weekdays, format, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id)
        DO UPDATE SET
            id = EXCLUDED.id,
            business = EXCLUDED.business,
            phone = EXCLUDED.phone,
            message = EXCLUDED.message,
            weekdays = EXCLUDED.weekdays,
            format = EXCLUDED.format,
            active = EXCLUDED.active
        `, [data.id, data.business, data.phone, data.message, data.weekdays, data.format, data.active]
    )
}

import { database } from '@/config/database';
import { BrochureRequest, BrochureRequestCreateInput } from '@/types/database';

export async function create(brochureData: BrochureRequestCreateInput): Promise<BrochureRequest> {
  const { contact_id, course_type, brochure_name, created_by } = brochureData;
  const query = `
    INSERT INTO brochure_requests (contact_id, course_type, brochure_name, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  try {
    const result = await database.query(query, [contact_id, course_type, brochure_name, created_by]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create brochure request: ${(error as Error).message}`);
  }
}

export async function findById(id: string): Promise<BrochureRequest | null> {
  const query = 'SELECT * FROM brochure_requests WHERE id = $1';

  try {
    const result = await database.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to find brochure request: ${(error as Error).message}`);
  }
}

export async function findByContactId(contactId: string): Promise<BrochureRequest[]> {
  const query = 'SELECT * FROM brochure_requests WHERE contact_id = $1 ORDER BY created_at DESC';

  try {
    const result = await database.query(query, [contactId]);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to find brochure requests by contact: ${(error as Error).message}`);
  }
}

export async function findAll(limit: number = 100, offset: number = 0): Promise<BrochureRequest[]> {
  const query = 'SELECT * FROM brochure_requests ORDER BY created_at DESC LIMIT $1 OFFSET $2';

  try {
    const result = await database.query(query, [limit, offset]);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch brochure requests: ${(error as Error).message}`);
  }
}

export async function findByCourseType(courseType: string, limit: number = 100): Promise<BrochureRequest[]> {
  const query = 'SELECT * FROM brochure_requests WHERE course_type = $1 ORDER BY created_at DESC LIMIT $2';

  try {
    const result = await database.query(query, [courseType, limit]);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch brochure requests by course type: ${(error as Error).message}`);
  }
}

export async function findPendingEmailDelivery(limit: number = 50): Promise<BrochureRequest[]> {
  const query = 'SELECT * FROM brochure_requests WHERE email_sent = false ORDER BY created_at ASC LIMIT $1';

  try {
    const result = await database.query(query, [limit]);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch pending email deliveries: ${(error as Error).message}`);
  }
}

export async function markEmailSent(id: string): Promise<BrochureRequest> {
  const query = `
    UPDATE brochure_requests 
    SET email_sent = true, email_sent_at = NOW() 
    WHERE id = $1 
    RETURNING *
  `;

  try {
    const result = await database.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to mark email as sent: ${(error as Error).message}`);
  }
}

export async function deleteBrochureRequest(id: string): Promise<void> {
  const query = 'DELETE FROM brochure_requests WHERE id = $1';

  try {
    await database.query(query, [id]);
  } catch (error) {
    throw new Error(`Failed to delete brochure request: ${(error as Error).message}`);
  }
}

export async function getEmailDeliveryStats(): Promise<{
  total: number;
  sent: number;
  pending: number;
}> {
  const query = `
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN email_sent = true THEN 1 END) as sent,
      COUNT(CASE WHEN email_sent = false THEN 1 END) as pending
    FROM brochure_requests
  `;

  try {
    const result = await database.query(query);
    const stats = result.rows[0];
    return {
      total: parseInt(stats.total),
      sent: parseInt(stats.sent),
      pending: parseInt(stats.pending)
    };
  } catch (error) {
    throw new Error(`Failed to fetch email delivery stats: ${(error as Error).message}`);
  }
}
import { database } from '@/config/database';
import { Contact, ContactCreateInput } from '@/types/database';

export class ContactRepository {
  async create(contactData: ContactCreateInput): Promise<Contact> {
    const { name, email, phone, course_interest, message, form_type, created_by } = contactData;
    const query = `
      INSERT INTO contacts (name, email, phone, course_interest, message, form_type, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    try {
      const result = await database.query(query, [name, email, phone, course_interest, message, form_type, created_by]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create contact: ${(error as Error).message}`);
    }
  }

  async findById(id: string): Promise<Contact | null> {
    const query = 'SELECT * FROM contacts WHERE id = $1';

    try {
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find contact: ${(error as Error).message}`);
    }
  }

  async findByEmail(email: string): Promise<Contact[]> {
    const query = 'SELECT * FROM contacts WHERE email = $1 ORDER BY created_at DESC';

    try {
      const result = await database.query(query, [email]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to find contacts by email: ${(error as Error).message}`);
    }
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<Contact[]> {
    const query = 'SELECT * FROM contacts ORDER BY created_at DESC LIMIT $1 OFFSET $2';

    try {
      const result = await database.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch contacts: ${(error as Error).message}`);
    }
  }

  async findByFormType(formType: 'contact' | 'brochure', limit: number = 100): Promise<Contact[]> {
    const query = 'SELECT * FROM contacts WHERE form_type = $1 ORDER BY created_at DESC LIMIT $2';

    try {
      const result = await database.query(query, [formType, limit]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch contacts by form type: ${(error as Error).message}`);
    }
  }

  async updateMessage(id: string, message: string): Promise<Contact> {
    const query = `
      UPDATE contacts 
      SET message = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `;

    try {
      const result = await database.query(query, [message, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update contact: ${(error as Error).message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM contacts WHERE id = $1';

    try {
      await database.query(query, [id]);
    } catch (error) {
      throw new Error(`Failed to delete contact: ${(error as Error).message}`);
    }
  }
}
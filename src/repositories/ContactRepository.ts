import { supabase } from '@/config/database';
import { Contact, ContactCreateInput } from '@/types/database';

export class ContactRepository {
  async create(contactData: ContactCreateInput): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create contact: ${error.message}`);
    }

    return data;
  }

  async findById(id: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find contact: ${error.message}`);
    }

    return data;
  }

  async findByEmail(email: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find contacts by email: ${error.message}`);
    }

    return data || [];
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }

    return data || [];
  }

  async findByFormType(formType: 'contact' | 'brochure', limit: number = 100): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('form_type', formType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch contacts by form type: ${error.message}`);
    }

    return data || [];
  }

  async updateMessage(id: string, message: string): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .update({ message, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update contact: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete contact: ${error.message}`);
    }
  }
}
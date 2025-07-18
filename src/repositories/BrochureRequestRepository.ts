import { supabase } from '@/config/database';
import { BrochureRequest, BrochureRequestCreateInput } from '@/types/database';

export class BrochureRequestRepository {
  async create(brochureData: BrochureRequestCreateInput): Promise<BrochureRequest> {
    const { data, error } = await supabase
      .from('brochure_requests')
      .insert([brochureData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create brochure request: ${error.message}`);
    }

    return data;
  }

  async findById(id: string): Promise<BrochureRequest | null> {
    const { data, error } = await supabase
      .from('brochure_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find brochure request: ${error.message}`);
    }

    return data;
  }

  async findByContactId(contactId: string): Promise<BrochureRequest[]> {
    const { data, error } = await supabase
      .from('brochure_requests')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find brochure requests by contact: ${error.message}`);
    }

    return data || [];
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<BrochureRequest[]> {
    const { data, error } = await supabase
      .from('brochure_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch brochure requests: ${error.message}`);
    }

    return data || [];
  }

  async findByCourseType(courseType: string, limit: number = 100): Promise<BrochureRequest[]> {
    const { data, error } = await supabase
      .from('brochure_requests')
      .select('*')
      .eq('course_type', courseType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch brochure requests by course type: ${error.message}`);
    }

    return data || [];
  }

  async findPendingEmailDelivery(limit: number = 50): Promise<BrochureRequest[]> {
    const { data, error } = await supabase
      .from('brochure_requests')
      .select('*')
      .eq('email_sent', false)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch pending email deliveries: ${error.message}`);
    }

    return data || [];
  }

  async markEmailSent(id: string): Promise<BrochureRequest> {
    const { data, error } = await supabase
      .from('brochure_requests')
      .update({ 
        email_sent: true, 
        email_sent_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to mark email as sent: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('brochure_requests')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete brochure request: ${error.message}`);
    }
  }

  async getEmailDeliveryStats(): Promise<{
    total: number;
    sent: number;
    pending: number;
  }> {
    const { data: totalData, error: totalError } = await supabase
      .from('brochure_requests')
      .select('id', { count: 'exact' });

    const { data: sentData, error: sentError } = await supabase
      .from('brochure_requests')
      .select('id', { count: 'exact' })
      .eq('email_sent', true);

    if (totalError || sentError) {
      throw new Error('Failed to fetch email delivery stats');
    }

    const total = totalData?.length || 0;
    const sent = sentData?.length || 0;
    const pending = total - sent;

    return { total, sent, pending };
  }
}
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  course_interest: string;
  message?: string;
  form_type: 'contact' | 'brochure';
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface BrochureRequest {
  id: string;
  contact_id: string;
  course_type: string;
  brochure_name: string;
  email_sent: boolean;
  email_sent_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface ContactCreateInput {
  name: string;
  email: string;
  phone: string;
  course_interest: string;
  message?: string;
  form_type: 'contact' | 'brochure';
  created_by?: string;
}

export interface BrochureRequestCreateInput {
  contact_id: string;
  course_type: string;
  brochure_name: string;
  created_by?: string;
}
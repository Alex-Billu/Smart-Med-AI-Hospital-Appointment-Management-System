export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin';
  doctorId?: number;
  created_at?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  icon: string;
  description: string;
  doctor_count?: number;
}

export interface Doctor {
  id: number;
  user_id: number;
  department_id: number;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  fee: number;
  rating: number;
  review_count: number;
  photo_url: string | null;
  bio: string;
  location: string;
  initials: string;
  is_active: number;
  department_name?: string;
  department_color?: string;
  email?: string;
  available_days?: string;
  start_time?: string;
  end_time?: string;
  image_url?: string;
  consultation_fee?: number;
}

export interface Slot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: number;
  booking_id: string;
  patient_id: number;
  doctor_id: number;
  department_id: number;
  appointment_date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  notes?: string;
  reason?: string;
  created_at: string;
  appointment_time?: string;
  // Joined fields from backend
  doctor_name?: string;
  specialization?: string;
  doctor_initials?: string;
  doctor_image?: string;
  department_name?: string;
  department_color?: string;
  patient_name?: string;
  patient_email?: string;
  patient_phone?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: number;
  created_at: string;
}

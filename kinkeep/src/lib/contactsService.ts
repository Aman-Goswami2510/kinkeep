import { Contact, ContactFormData } from '@/types/contact';
import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_DEMO_CONTACTS } from './mockData';

const STORAGE_KEY = 'kinkeep_contacts_data';

// Helper to get local contacts
function getLocalContacts(): Contact[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_CONTACTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CONTACTS));
    return INITIAL_DEMO_CONTACTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DEMO_CONTACTS;
  }
}

// Helper to save local contacts
function saveLocalContacts(contacts: Contact[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export function seedDemoContacts(): Contact[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CONTACTS));
  }
  return INITIAL_DEMO_CONTACTS;
}

export async function fetchContacts(): Promise<{ data: Contact[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    const local = getLocalContacts();
    if (!local || local.length === 0) {
      return { data: seedDemoContacts(), error: null };
    }
    return { data: local, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, falling back to local store:', error.message);
      return { data: getLocalContacts(), error: null };
    }

    if (!data || data.length === 0) {
      return { data: INITIAL_DEMO_CONTACTS, error: null };
    }

    return { data: (data as Contact[]), error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch contacts';
    console.error('Error fetching contacts:', err);
    return { data: getLocalContacts(), error: errorMsg };
  }
}

export async function createContact(
  formData: ContactFormData,
  userId?: string | null
): Promise<{ data: Contact | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    const newContact: Contact = {
      ...formData,
      id: 'local-' + Date.now().toString(),
      created_at: new Date().toISOString(),
      added_by: userId || 'local-user'
    };
    const current = getLocalContacts();
    const updated = [newContact, ...current];
    saveLocalContacts(updated);
    return { data: newContact, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          full_name: formData.full_name,
          relationship: formData.relationship,
          phone_number: formData.phone_number || null,
          email: formData.email || null,
          address: formData.address || null,
          photo_url: formData.photo_url || null,
          added_by: userId || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert failed, saving to local store:', error.message);
      const newContact: Contact = {
        ...formData,
        id: 'local-' + Date.now().toString(),
        created_at: new Date().toISOString(),
        added_by: userId || 'local-user'
      };
      const current = getLocalContacts();
      saveLocalContacts([newContact, ...current]);
      return { data: newContact, error: null };
    }

    return { data: data as Contact, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create contact';
    return { data: null, error: errorMsg };
  }
}

export async function updateContact(
  id: string,
  formData: Partial<ContactFormData>
): Promise<{ data: Contact | null; error: string | null }> {
  if (!isSupabaseConfigured || id.startsWith('local-') || id.startsWith('demo-')) {
    const current = getLocalContacts();
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) {
      return { data: null, error: 'Contact not found' };
    }
    const updatedItem = { ...current[index], ...formData };
    current[index] = updatedItem;
    saveLocalContacts(current);
    return { data: updatedItem, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('contacts')
      .update(formData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Contact, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update contact';
    return { data: null, error: errorMsg };
  }
}

export async function deleteContact(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured || id.startsWith('local-') || id.startsWith('demo-')) {
    const current = getLocalContacts();
    const updated = current.filter((c) => c.id !== id);
    saveLocalContacts(updated);
    return { success: true, error: null };
  }

  try {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete contact';
    return { success: false, error: errorMsg };
  }
}

export async function uploadContactPhoto(file: File): Promise<{ url: string | null; error: string | null }> {
  // If Supabase is configured, upload to 'avatars' bucket
  if (isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.warn('Storage upload error, falling back to base64 preview:', uploadError.message);
      } else {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        if (data?.publicUrl) {
          return { url: data.publicUrl, error: null };
        }
      }
    } catch (err) {
      console.warn('Storage exception, using fallback data URL:', err);
    }
  }

  // Graceful fallback to client-side data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string, error: null });
    };
    reader.onerror = () => {
      resolve({ url: null, error: 'Could not read image file' });
    };
    reader.readAsDataURL(file);
  });
}

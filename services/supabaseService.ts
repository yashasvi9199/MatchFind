import { supabase } from '../supabaseClient';
import { ProfileData } from '../types';
import { compressImage } from '../utils/helpers';

/**
 * Uploads a profile image to the 'avatars' bucket in Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export const uploadProfileImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    console.log('[SupabaseService] Compressing image...');
    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
    
    const fileExt = 'jpg';
    const fileName = `${userId}/${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`[SupabaseService] Uploading compressed image (${(compressedFile.size / 1024).toFixed(2)} KB)...`);

    // 1. Upload file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, compressedFile);

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get Public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Inserts or updates user profile data into the 'profiles' table.
 */
export const createProfile = async (userId: string, bioData: ProfileData) => {
  try {
    // We spread the complex bioData object. In a real SQL schema, 
    // these might be separate columns or a JSONB column.
    // The Mock Supabase implementation handles this fine.
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...bioData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

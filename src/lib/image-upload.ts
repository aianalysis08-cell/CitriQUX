import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with proper service role key (lazy initialization)
function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables are not configured');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// Test Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection successful, buckets:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

export async function uploadImageToSupabase(file: File, folder: string = 'ux-analysis'): Promise<string> {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
    }

    // Check if service role key is still the placeholder
    if (process.env.SUPABASE_SERVICE_ROLE_KEY === 'your-service-role-key') {
      throw new Error('Invalid Supabase service role key. Please replace "your-service-role-key" in .env.local with your actual service role key from Supabase dashboard.');
    }

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Test connection first
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to Supabase. Please check your credentials and bucket permissions.');
    }
    
    const supabase = getSupabaseClient();
    
    // Sanitize filename more aggressively
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    
    const fileName = `${folder}/${Date.now()}-${sanitizedName}`;
    
    console.log('Attempting to upload to bucket: design-uploads, file:', fileName);
    
    const { data, error } = await supabase.storage
      .from('design-uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Supabase upload error details:', {
        error,
        fileName,
        fileSize: file.size,
        fileType: file.type,
        bucket: 'design-uploads'
      });
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    console.log('Upload successful:', data.path);

    // Get public URL - try different methods
    let publicUrl: string;
    
    try {
      // Method 1: Standard public URL
      const { data: urlData } = await supabase.storage
        .from('design-uploads')
        .getPublicUrl(fileName);
      publicUrl = urlData.publicUrl;
      console.log('Standard public URL:', publicUrl);
    } catch (error) {
      console.error('Error getting public URL:', error);
      // Method 2: Construct URL manually
      publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/design-uploads/${fileName}`;
      console.log('Constructed public URL:', publicUrl);
    }

    // Test if the URL is accessible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.warn('Public URL not accessible, status:', response.status);
        // Try signed URL as fallback
        const { data: signedData } = await supabase.storage
          .from('design-uploads')
          .createSignedUrl(fileName, 3600); // 1 hour expiry
        if (signedData) {
          publicUrl = signedData.signedUrl;
          console.log('Using signed URL:', publicUrl);
        }
      } else {
        console.log('Public URL is accessible');
      }
    } catch (testError) {
      console.warn('Could not test public URL accessibility:', testError);
    }

    console.log('Final URL to be used:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function uploadMultipleImages(files: File[], folder: string = 'ux-analysis'): Promise<string[]> {
  // Compress images before upload for better performance
  const compressedFiles = await Promise.all(
    files.map(file => compressImage(file))
  );
  
  const uploadPromises = compressedFiles.map(file => uploadImageToSupabase(file, folder));
  return Promise.all(uploadPromises);
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
  }

  // Check file size (2MB limit for faster processing)
  const maxSize = 2 * 1024 * 1024; // 2MB for better OpenAI performance
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 2MB for optimal analysis' };
  }

  // Check file name length
  if (file.name.length > 255) {
    return { valid: false, error: 'File name is too long' };
  }

  return { valid: true };
}

export async function compressImage(file: File, maxWidth: number = 1024, quality: number = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

import React from 'react';
import { Camera, Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/core';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onUpload: (urls: string[]) => void;
  existingImages?: string[];
  bucket?: string;
}

export function ImageUploader({ onUpload, existingImages = [], bucket = 'evidence' }: ImageUploaderProps) {
  const [images, setImages] = React.useState<string[]>(existingImages);
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        
        newUrls.push(publicUrl);
        toast.success(`Uploaded ${file.name}`);
      } catch (error: any) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    const updatedImages = [...images, ...newUrls];
    setImages(updatedImages);
    onUpload(updatedImages);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onUpload(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-border">
            <img src={url} alt="upload" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button 
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gold hover:bg-gold/5 transition-all">
          <UploadCloud className="text-muted-foreground" size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Add</span>
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && (
        <p className="text-[10px] font-bold text-gold animate-pulse uppercase tracking-[0.2em]">Uploading metadata to cloud...</p>
      )}
    </div>
  );
}

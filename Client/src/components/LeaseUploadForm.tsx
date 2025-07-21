import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiOutlineUpload } from 'react-icons/ai';
import Spinner from './Spinner';
import { useAuthStore } from '../store/useAuthStore';

interface LeaseUploadFormProps {
  onUploadSuccess?: (file: File, leaseId?: number) => void;
}

export default function LeaseUploadForm({ onUploadSuccess }: Readonly<LeaseUploadFormProps>) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const token: string | null = useAuthStore((state): string | null => state.token) ?? localStorage.getItem('token');

  const onDrop: (acceptedFiles: File[]) => Promise<void> = useCallback(async (acceptedFiles: File[]): Promise<void> => {
    setError(null);
    const file: File = acceptedFiles[0];
    if (!file) {
      setError('No file selected.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('lease', file);

      const res: Response = await fetch('/api/lease/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data: any = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Failed to upload file.');
      } else if (onUploadSuccess) onUploadSuccess(file, data.id);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const handleDrop: (files: File[]) => void = (files: File[]): void => {
    void onDrop(files);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  return (
    <form
      className="w-full max-w-md flex flex-col items-center"
      onSubmit={e => e.preventDefault()}
    >
      <div
        {...getRootProps()}
        className={`
        group
        w-full
        flex flex-col items-center justify-center
        border-4 border-red-500 rounded-2xl cursor-pointer
        py-8 sm:py-12 md:py-16
        bg-[var(--theme-dark)] transition
        ${
          isDragActive
            ? 'border-[var(--theme-primary)] bg-[var(--theme-accent)]/30'
            : 'border-[var(--theme-outline)] hover:border-[var(--theme-success)] hover:bg-[var(--theme-light)]'
        }
      `}
      >
        <input {...getInputProps()} />
        <AiOutlineUpload className="text-[var(--theme-error)] group-hover:text-emerald-500 text-5xl sm:text-6xl mb-2 transition-colors" />
        <span className="text-base sm:text-lg font-bold text-[var(--theme-light)] group-hover:text-[var(--theme-base)] mb-1 text-center transition-colors">
          Drag & drop your PDF lease here
        </span>
        <span className="text-sm sm:text-base text-[var(--theme-light)] group-hover:text-[var(--theme-base)] mb-1 text-center transition-colors">
          or click to select a file
        </span>
      </div>

      {uploading && (
        <div className="mt-4">
          <Spinner size={28} color="var(--theme-error)" />
        </div>
      )}

      {error && (
        <div className="mt-4 w-full text-center text-sm bg-[var(--theme-error)] text-[var(--theme-light)] rounded-xl py-2 px-3">
          {error}
        </div>
      )}
    </form>
  );
}

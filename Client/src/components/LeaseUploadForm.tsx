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

  const token = useAuthStore((state) => state.token) ?? localStorage.getItem('token');

  // Async function to actually handle file upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
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

      // LOG THE TOKEN HERE
      console.log('Token for fetch:', token);

      const res = await fetch('/api/lease/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
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


  // Wrapper to make onDrop have correct TS type (sync, returns void)
  const handleDrop = (files: File[]) => {
    // Just call async handler, don't await it
    void onDrop(files);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop, // Pass the sync wrapper, NOT the async function!
    multiple: false,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  return (
    <form className="w-full flex flex-col items-center" onSubmit={e => e.preventDefault()}>
      <div
        {...getRootProps()}
        className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer py-8 mt-72 bg-slate-200 transition
        ${isDragActive
          ? 'border-[var(--theme-primary)] bg-[var(--theme-accent)]/30'
          : 'border-[var(--theme-outline)] hover:border-[var(--theme-primary)]'}
        `}
      >
        <input {...getInputProps()} />
        <AiOutlineUpload className="text-[var(--theme-primary)] text-5xl mb-2" />
        <span className="text-base font-bold text-[var(--theme-primary)] mb-1">
          Drag & drop your PDF lease here
        </span>
        <span className="text-sm text-[var(--theme-outline)]">or click to select a file</span>
      </div>
      {uploading && (
        <div className="mt-4">
          <Spinner size={28} color="var(--theme-primary)" />
        </div>
      )}
      {error && (
        <div className="mt-4 w-full text-center text-sm bg-[var(--theme-error)] text-white rounded-xl py-2 px-3">
          {error}
        </div>
      )}
    </form>
  );
}

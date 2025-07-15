import { useNavigate } from 'react-router-dom';
import LeaseUploadForm from '../components/LeaseUploadForm.js';

export default function LeaseUpload() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto">
      <LeaseUploadForm
        onUploadSuccess={() => {
          navigate('/dashboard');
        }}
      />
    </div>
  );
}

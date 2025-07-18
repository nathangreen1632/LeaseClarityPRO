import {type NavigateFunction, useNavigate} from 'react-router-dom';
import LeaseUploadForm from '../components/LeaseUploadForm.js';

export default function LeaseUpload() {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-black px-3 sm:px-0">
      <LeaseUploadForm
        onUploadSuccess={(): void => {
          navigate('/dashboard');
        }}
      />
    </div>
  );
}

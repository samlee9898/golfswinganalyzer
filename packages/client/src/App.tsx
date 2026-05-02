import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

function App() {
   const videoInputRef = useRef(null);
   const [progress, setProgress] = useState(0);
   // idle | uploading | complete | error
   const [uploadStatus, setUploadStatus] = useState('idle');

   const handleSelectVideo = () => {
      videoInputRef.current.click();
   };

   const handleVideoInput = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      console.log('videoInput received');
      console.log(file);
      console.log(file.name);

      const formData = new FormData();
      formData.append('video', file); // key = "video"

      try {
         setUploadStatus('uploading');
         setProgress(0);

         const response = await axios.post('/api/upload', formData, {
            onUploadProgress: (event) => {
               if (!event.total) return;

               const percent = Math.round((event.loaded * 100) / event.total);
               setProgress(percent);
            },
         });

         setUploadStatus('complete');
         setProgress(100);

         console.log(response.data);
      } catch (error) {
         setUploadStatus('error');
         console.error('Upload failed:', error);
      }
   };

   return (
      <div className="p-4 flex flex-col items-center justify-center gap-4">
         <p className="font-bold text-3xl">Upload your golf swing</p>
         <Button onClick={handleSelectVideo}>SELECT VIDEO</Button>

         {uploadStatus !== 'idle' && (
            <div className="w-full max-w-md space-y-2 font-bold">
               <Progress value={progress} />

               {uploadStatus === 'uploading' && (
                  <p className="text-sm text-center text-muted-foreground">
                     Uploading... {progress}%
                  </p>
               )}

               {uploadStatus === 'complete' && (
                  <p className="text-sm text-center text-green-600">
                     Upload complete!
                  </p>
               )}

               {uploadStatus === 'error' && (
                  <p className="text-sm text-center text-red-600">
                     Upload failed. Please try again.
                  </p>
               )}
            </div>
         )}

         {
            // input box below is hidden
         }
         <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            style={{ display: 'none' }}
            onChange={handleVideoInput}
         />
      </div>
   );
}

export default App;

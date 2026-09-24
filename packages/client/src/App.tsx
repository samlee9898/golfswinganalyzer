import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
   IoCheckmarkCircleOutline,
   IoCloudUploadOutline,
} from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import NavBar from './components/NavBar';
import { Field, FieldLabel } from './components/ui/field';

function App() {
   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // consider using context
   const inputRef = useRef<HTMLInputElement>(null);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);
   const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10 MB (works for calling Gemini API)
   const [stage, setStage] = useState<Stage>('idle');
   type Stage = 'idle' | 'uploading' | 'analyzing' | 'complete';

   useEffect(() => {
      checkLoginStatus();
   }, []);

   function selectFile(file: File, input?: HTMLInputElement) {
      if (!isLoggedIn) {
         alert('You need to be logged in to analyze a video.');
         if (input) input.value = '';
         return;
      }

      if (file.type !== 'video/mp4') {
         alert('Please select an MP4 video.');
         if (input) input.value = '';
         return;
      }

      if (file.size > MAX_VIDEO_SIZE) {
         alert('Video must be 10 MB or smaller.');
         if (input) input.value = '';
         return;
      }

      setSelectedFile(file);
      setStage('idle');
      setUploadProgress(0);
   }

   async function checkLoginStatus(): Promise<boolean> {
      try {
         const response = await fetch('/api/auth/me', {
            method: 'POST',
            credentials: 'include',
         });

         setIsLoggedIn(response.ok);
         return response.ok;
      } catch {
         setIsLoggedIn(false);
         return false;
      }
   }

   async function handleLogout() {
      try {
         const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
         });

         // this shound't happen but just in case
         if (!response.ok) {
            throw new Error('Logout failed');
         }
         setIsLoggedIn(false);
         alert('You are logged out');
      } catch (error) {
         // this shouldn't happen as well
         console.error(error);
      }
   }

   async function openFilePicker() {
      inputRef.current?.click();
   }

   function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
      const file = event.target.files?.[0];

      if (!file) return;

      selectFile(file, event.target);
   }

   function handleDrop(event: React.DragEvent<HTMLDivElement>) {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];

      if (!file) return;

      selectFile(file);
   }

   async function handleAnalyze() {
      // when the button is pressed, first check to see if the user is logged in
      const loggedIn = await checkLoginStatus();
      if (!loggedIn) {
         alert('You need to be logged in to use this functionality!');
         return;
      }

      if (!selectedFile) return;

      setStage('uploading');
      setIsAnalyzing(true);

      try {
         // get presigned URL
         const presignedURLResponse = await fetch('/api/videos/', {
            method: 'POST',
            credentials: 'include',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               contentType: selectedFile.type,
               fileSize: selectedFile.size,
            }),
         });

         const data = await presignedURLResponse.json();

         if (!presignedURLResponse.ok) {
            throw new Error(data.message ?? 'Could not prepare upload');
         }

         // upload to S3 bucket
         await axios.put(data.uploadURL, selectedFile, {
            headers: {
               'Content-Type': selectedFile.type,
            },

            onUploadProgress: (progressEvent) => {
               const total = progressEvent.total || 1;
               const currentProgress = progressEvent.loaded;

               const percentCompleted = Math.round(
                  (currentProgress * 100) / total
               );

               setUploadProgress(percentCompleted);
            },
         });

         setUploadProgress(100);
         setStage('analyzing');

         const analysisResponse = await fetch(
            `/api/videos/${data.videoID}/analyses`,
            {
               method: 'POST',
               credentials: 'include',
            }
         );

         const analysisData = await analysisResponse.json();

         if (!analysisResponse.ok) {
            throw new Error(analysisData.message ?? 'Analysis failed');
         }

         if (!analysisData.analysis.result.analyzable) {
            alert(analysisData.analysis.result.reason);
         } else {
            alert(analysisData.analysis.result.improvements?.[0]);
         }
         setStage('complete');
      } catch (error) {
         setStage('idle');
         setUploadProgress(0);
         alert(error instanceof Error ? error.message : 'Something went wrong');
      } finally {
         setIsAnalyzing(false);
      }
   }

   return (
      <div className="min-h-screen bg-background text-foreground">
         <NavBar
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            onLogout={handleLogout}
         />
         <Separator />

         <main className="flex min-h-[calc(100vh-73px)] items-center bg-[url('/swing.jpg')] bg-cover bg-top bg-no-repeat">
            <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8 lg:py-24">
               <section className="max-w-xl">
                  <div className="mb-5 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-s font-extrabold text-black">
                     AI-powered swing analysis
                  </div>

                  <h1 className="text-balance text-4xl font-bold tracking-tight text-sky-300 [-webkit-text-stroke:1px_rgba(15,23,42,0.45)] [text-shadow:0_3px_10px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">
                     Upload your swing.
                     <span className="block text-rose-300 [-webkit-text-stroke:1px_rgba(15,23,42,0.45)] [text-shadow:0_3px_10px_rgba(0,0,0,0.8)]">
                        Find your problem.
                     </span>
                  </h1>

                  <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-white sm:text-lg [text-shadow:0_3px_10px_rgba(0,0,0,0.8)]">
                     Upload a video of your golf swing and receive clear,
                     personalized feedback to help you understand your swing and
                     improve with confidence.
                  </p>

                  <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2 [text-shadow:0_3px_10px_rgba(0,0,0,0.8)]">
                     <div className="flex items-center gap-2 text-white">
                        <IoCheckmarkCircleOutline className="size-5" />
                        Personalized feedback
                     </div>
                     <div className="flex items-center gap-2 text-white">
                        <IoCheckmarkCircleOutline className="size-5" />
                        Secure video upload
                     </div>
                  </div>
               </section>

               <section className="rounded-2xl border border-white/25 bg-black/45 p-2 text-white shadow-xl backdrop-blur-md">
                  <div className="rounded-xl border border-white/20 bg-black/30 p-6 sm:p-8">
                     <h2 className="text-lg font-semibold tracking-tight">
                        Upload your swing
                     </h2>
                     <p className="mt-1 text-sm text-white/75">
                        Choose a clear, full-body video for the best analysis.
                     </p>

                     <div
                        className="mt-6 flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/40 bg-white/10 px-6 text-center transition-colors hover:border-white/70 hover:bg-white/20"
                        role="button"
                        tabIndex={0}
                        onClick={openFilePicker}
                        onKeyDown={(event) => {
                           if (event.key === 'Enter' || event.key === ' ')
                              openFilePicker();
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleDrop}
                     >
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-white/30 bg-white/10 shadow-sm">
                           <IoCloudUploadOutline className="size-6" />
                        </div>
                        <p className="font-medium text-white">
                           {selectedFile
                              ? selectedFile.name
                              : 'Drop your video here'}
                        </p>
                        <p className="mt-1 text-sm text-white/70">
                           {selectedFile
                              ? `${Math.round(selectedFile.size / 1000000)} MB selected`
                              : 'or browse from your device'}
                        </p>
                        <Button
                           type="button"
                           variant="outline"
                           className="mt-5 text-black"
                           onClick={(event) => {
                              event.stopPropagation();
                              openFilePicker();
                           }}
                        >
                           {selectedFile
                              ? 'Choose another video'
                              : 'Browse files'}
                        </Button>
                        <input
                           className="hidden"
                           ref={inputRef}
                           type="file"
                           accept="video/mp4"
                           onChange={handleFileChange}
                        />
                     </div>

                     <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-white/70">
                           <span>MP4 only</span>
                           <span>Maximum 10MB</span>
                        </div>
                        {stage !== 'idle' && (
                           <Field>
                              <FieldLabel>
                                 <span>
                                    {stage === 'uploading' && 'Uploading...'}
                                    {stage === 'analyzing' && 'Analyzing...'}
                                    {stage === 'complete' &&
                                       'Analysis complete!'}
                                 </span>

                                 {stage === 'uploading' && (
                                    <span className="ml-auto">
                                       {uploadProgress}%
                                    </span>
                                 )}
                              </FieldLabel>

                              {stage === 'uploading' && (
                                 <Progress
                                    value={uploadProgress}
                                    className="h-1.5 *:bg-blue-500"
                                 />
                              )}
                           </Field>
                        )}
                        <Button
                           className="w-full"
                           size="lg"
                           disabled={!selectedFile || isAnalyzing}
                           onClick={handleAnalyze}
                        >
                           Analyze swing
                        </Button>
                     </div>
                  </div>
               </section>
            </div>
         </main>
      </div>
   );
}

export default App;

import { useEffect, useRef, useState } from 'react';
import {
   IoCheckmarkCircleOutline,
   IoCloudUploadOutline,
} from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import NavBar from './components/NavBar';

function App() {
   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // consider using context
   const inputRef = useRef<HTMLInputElement>(null);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);

   useEffect(() => {
      checkLoginStatus();
   }, []);

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

         // this shound't happen
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
      // await fetch('/api/auth/me', {
      //    method: 'POST',
      //    credentials: 'include',
      // });
      inputRef.current?.click();
   }

   function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
      setSelectedFile(event.target.files?.[0] ?? null);
   }

   function handleDrop(event: React.DragEvent<HTMLDivElement>) {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];

      if (file?.type.startsWith('video/')) setSelectedFile(file);
   }

   async function handleAnalyze(event: React.MouseEvent<HTMLButtonElement>) {
      // first, when the button is pressed, check to see if the user is logged in
      const loggedIn = await checkLoginStatus();
      if (!loggedIn) {
         alert('You need to be logged in to use this functionality!');
         return;
      }

      await fetch('/api/upload/', {
         method: 'POST',
         credentials: 'include',
      });
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
                  <div className="mb-5 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-semibold text-black">
                     AI-powered swing analysis
                  </div>

                  <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-950 [-webkit-text-stroke:1px_rgba(15,23,42,0.45)] [text-shadow:0_3px_10px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">
                     Upload your swing.
                     <span className="block text-white [-webkit-text-stroke:1px_rgba(15,23,42,0.45)] [text-shadow:0_3px_10px_rgba(0,0,0,0.8)]">
                        Unlock your game.
                     </span>
                  </h1>

                  <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-white/80 sm:text-lg">
                     Upload a video of your golf swing and receive clear,
                     personalized feedback to help you understand your motion
                     and improve with confidence.
                  </p>

                  <div className="mt-8 grid gap-3 text-sm  sm:grid-cols-2">
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
                              ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB selected`
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
                           accept=".mp4, .mov, .webm"
                           onChange={handleFileChange}
                        />
                     </div>

                     <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-white/70">
                           <span>MP4, MOV, or WebM</span>
                           <span>Maximum 200 MB</span>
                        </div>
                        {selectedFile && (
                           <Progress value={100} className="h-1.5" />
                        )}
                        <Button
                           className="w-full"
                           size="lg"
                           disabled={!selectedFile}
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

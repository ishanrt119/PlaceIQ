"use client"

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Camera, Edit2, Loader2, Share2, FileText, CheckCircle2 } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { toast } from 'sonner';

interface ProfileHeroProps {
  user: any;
  experiencesCount: number;
}

export default function ProfileHero({ user, experiencesCount }: ProfileHeroProps) {
  const router = useRouter();
  
  // State for uploads
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // State for Cropper Modal
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Refs for hidden file inputs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Calculate Profile Strength
  const requiredFields = [
    { name: 'Profile Picture', value: user?.profilePicture },
    { name: 'Headline', value: user?.professionalHeadline },
    { name: 'Status', value: user?.placementStatus },
    { name: 'College', value: user?.college },
    { name: 'CGPA', value: user?.cgpa },
    { name: 'Skills', value: user?.skills && user.skills.length > 0 },
    { name: 'Resume', value: user?.resumeUrl },
    { name: 'Projects', value: user?.projects && user.projects.length > 0 },
  ];
  const completedFields = requiredFields.filter(f => !!f.value).length;
  const profileCompletion = Math.round((completedFields / requiredFields.length) * 100);
  const missingFields = requiredFields.filter(f => !f.value).map(f => f.name);

  // Handlers for Cover Photo (Direct Upload, No Cropping)
  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadImage(file, 'coverUrl');
    }
  };

  // Handlers for Avatar (Select -> Crop -> Upload)
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setCropImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
    // reset input so the same file can be selected again
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<File> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');

    ctx.drawImage(
      image,
      pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
      0, 0, pixelCrop.width, pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg');
    });
  };

  const handleCropSave = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;
    try {
      setIsUploadingAvatar(true);
      const croppedFile = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      setCropImageSrc(null); // Close modal instantly for better UX
      await uploadImage(croppedFile, 'profilePicture');
    } catch (e) {
      toast.error("Failed to crop image");
      setIsUploadingAvatar(false);
    }
  };

  const uploadImage = async (file: File, type: 'profilePicture' | 'coverUrl') => {
    const isCover = type === 'coverUrl';
    if (isCover) setIsUploadingCover(true);
    else setIsUploadingAvatar(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      toast.success(isCover ? 'Cover photo updated!' : 'Profile picture updated!');
      router.refresh(); // Tell Next.js to re-fetch the server component so new URL flows down
    } catch (error) {
      toast.error('Failed to upload image. Check your internet connection.');
    } finally {
      if (isCover) setIsUploadingCover(false);
      else setIsUploadingAvatar(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard!");
  };

  const scrollToEdit = () => {
    const form = document.getElementById("profile-form");
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="relative mb-8 rounded-xl overflow-hidden bg-card border shadow-sm flex flex-col md:flex-row">
        
        {/* Left Side: Images & Info */}
        <div className="flex-1 pb-6 md:pb-8">
          {/* Cover Photo */}
          <div className="group relative h-48 md:h-64 w-full bg-gradient-to-r from-primary/80 to-primary/40">
            {user?.coverUrl && (
              <img src={user.coverUrl} alt="Cover" className="h-full w-full object-cover transition-opacity duration-300" />
            )}
            
            {/* Edit Cover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverSelect} />
              <Button 
                variant="secondary" 
                className="gap-2 backdrop-blur-md bg-white/20 text-white hover:bg-white/30 border-white/20"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
              >
                {isUploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                {isUploadingCover ? "Uploading..." : "Edit Cover"}
              </Button>
            </div>
          </div>
          
          {/* Avatar & Basic Info */}
          <div className="px-6 md:px-10 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-6 md:left-10">
              <div className="group relative h-32 w-32 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden shadow-md">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-muted-foreground uppercase">{user?.fullName?.charAt(0) || "U"}</span>
                )}
                
                {/* Edit Avatar Overlay */}
                <div 
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarSelect} />
                  {isUploadingAvatar ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <Camera className="h-6 w-6 mb-1" />
                      <span className="text-xs font-medium">Update</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="pt-20 md:pt-24 max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight">{user?.fullName || "Your Name"}</h1>
              <p className="text-lg text-muted-foreground mt-1">
                {user?.professionalHeadline || "Add a professional headline"}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-4 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {user?.placementStatus || "Status Not Set"}</span>
                {user?.college && <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary/50">{user.college}</span>}
                {user?.branch && <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary/50">{user.branch} • {user.graduationYear}</span>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <Button onClick={scrollToEdit} className="shadow-sm"><Edit2 className="h-4 w-4 mr-2" /> Edit Profile</Button>
                {user?.resumeUrl && (
                  <Button variant="outline" className="shadow-sm" render={<a href={user.resumeUrl} target="_blank" rel="noreferrer" />}>
                    <FileText className="h-4 w-4 mr-2" /> Resume
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Stats & Strength Widget */}
        <div className="md:w-80 border-t md:border-t-0 md:border-l bg-muted/10 p-6 md:p-8 flex flex-col gap-8 shrink-0">
          
          {/* Profile Strength */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Profile Strength</h3>
              <span className="text-xl font-bold text-primary">{profileCompletion}%</span>
            </div>
            <ProgressBar value={profileCompletion} className="h-2.5" />
            <div className="text-xs text-muted-foreground">
              {profileCompletion === 100 
                ? "Looking great! Your profile is highly visible to recruiters." 
                : `Missing: ${missingFields.slice(0, 3).join(', ')}${missingFields.length > 3 ? '...' : ''}`
              }
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-3 border shadow-sm">
                <div className="text-2xl font-bold">{user?.skills?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Skills Verified</div>
              </div>
              <div className="bg-background rounded-lg p-3 border shadow-sm">
                <div className="text-2xl font-bold">{user?.projects?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Projects Built</div>
              </div>
              <div className="bg-background rounded-lg p-3 border shadow-sm">
                <div className="text-2xl font-bold">{user?.certifications?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Certifications</div>
              </div>
              <div className="bg-background rounded-lg p-3 border shadow-sm">
                <div className="text-2xl font-bold text-primary">{experiencesCount}</div>
                <div className="text-xs text-muted-foreground mt-1">Interviews Shared</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Cropper Modal */}
      {cropImageSrc && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Crop Profile Picture</h3>
              <p className="text-sm text-muted-foreground">Drag and zoom to perfectly frame your face.</p>
            </div>
            <div className="relative h-[300px] w-full bg-black/90">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-4 flex items-center gap-3 bg-muted/20">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCropImageSrc(null)}>Cancel</Button>
              <Button onClick={handleCropSave}>Apply & Upload</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

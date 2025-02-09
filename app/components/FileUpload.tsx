"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setErrors] = useState<string | null>(null);
  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setErrors(err.message);
    setUploading(false);
  };

  const onSuccessHandler = (res: IKUploadResponse) => {
    console.log("Success", res);
    setUploading(false);
    setErrors(null);
    onSuccess(res);
  };

  const handleProgress = (evt: ProgressEvent) => {
    // console.log("Progress", progress);
    if (evt.lengthComputable && onProgress) {
      const percentComplete = Math.round((evt.loaded * 100) / evt.total);
      onProgress(percentComplete);
    }
  };

  const handleUploadStart = () => {
    setUploading(true);
    setErrors(null);
  };

  /*  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setErrors("File must be a video");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setErrors("File must be less than 100 MB");
        return false;
      }
      return true;
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors("File must be an image (JPEG, PNG, GIF, or WebP)");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors("Image must be less than 10 MB");
        return false;
      }
      return true;
    }
  }; */

  const validateFile = (file: File) => {
    const videoMaxSize = 100 * 1024 * 1024; // 100 MB
    const imageMaxSize = 10 * 1024 * 1024; // 10 MB
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setErrors("File must be a video");
        return false;
      }
      if (file.size > videoMaxSize) {
        setErrors("Video must be less than 100 MB");
        return false;
      }
    } else {
      if (!validImageTypes.includes(file.type)) {
        setErrors("File must be an image (JPEG, PNG, GIF, or WebP)");
        return false;
      }
      if (file.size > imageMaxSize) {
        setErrors("Image must be less than 10 MB");
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        useUniqueFileName={true}
        validateFile={validateFile}
        folder={fileType === "video" ? "/reels_app/video" : "/reels_app/image"}
        onError={onError}
        onSuccess={onSuccessHandler}
        onUploadProgress={handleProgress}
        onUploadStart={handleUploadStart}
      />
      {uploading && (
        <div className="flex items-center gap-2 text-sm test-primary">
          <Loader2 className="animate-spin w-4 h-4" />
          <span>Uploading...</span>
        </div>
      )}
      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}

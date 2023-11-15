import { useToast } from "@/providers/toast-provider";
import { Dispatch, useEffect, useState } from "react";
import Uppy from "@uppy/core";
import XHR from "@uppy/xhr-upload";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { Text } from "@/components/text";
import { StrapiImageResponse } from "@/types";
import { Skeleton } from "@/components/skeleton";

export type ImageUpload = {
  status: "idle" | "uploading" | "complete";
  detail: number;
};

export type ProfileImageProps = {
  isEditMode: boolean;
  imageUpload: ImageUpload;
  setImageUpload: Dispatch<ImageUpload>;
  avatar: StrapiImageResponse | null;
};

const uppy = new Uppy().use(XHR, {
  endpoint: `https://${process.env.NEXT_PUBLIC_STRAPI_HOSTNAME}/api/upload`,
  formData: true,
  fieldName: "files", // Strapi expects the file field to be called "files"
});

export const ProfileImage = ({
  isEditMode,
  imageUpload,
  setImageUpload,
  avatar,
}: ProfileImageProps) => {
  const { addToast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [nextImageLoaded, setNextImageLoaded] = useState(false);
  useEffect(() => {
    if (imageFile) {
      setNextImageLoaded(false);
      uppy.cancelAll();
      setImageUpload({ status: "uploading", detail: 0 });
      uppy.addFile({
        name: imageFile.name,
        type: imageFile.type,
        data: imageFile,
      });
      uppy.upload();
    }
  }, [imageFile]);

  useEffect(() => {
    uppy.on("error", (error) => {
      setImageUpload({ status: "idle", detail: 0 });
      setImageFile(null);
      addToast({
        type: "error",
        message: "Image failed to upload",
      });
    });

    uppy.on("upload-progress", (file, progress) => {
      setImageUpload({
        status: "uploading",
        detail: (progress.bytesUploaded / progress.bytesTotal) * 100,
      });
    });

    uppy.on("upload-success", (file, response) => {
      if (response.status === 200) {
        const imageId = response.body[0].id;
        setImageUpload({
          status: "complete",
          detail: imageId,
        });

        addToast({
          type: "success",
          message: "Image uploaded",
        });
      } else {
        addToast({
          type: "error",
          message: "Something went wrong",
        });
      }
    });
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded shadow-md group">
      <Image
        className="object-cover"
        alt="profile image"
        src={
          imageFile
            ? URL.createObjectURL(imageFile)
            : resolveStrapiImage(avatar)
        }
        onLoadingComplete={() => setNextImageLoaded(true)}
        fill={true}
      />
      {!nextImageLoaded && <Skeleton type="image" className="w-full h-full" />}
      {isEditMode && (
        <div className="absolute transition rounded cursor-pointer -inset-1 bg-brand-navy-accent-dark/60 hover:bg-brand-navy-accent-dark/70">
          <Text
            variant="p"
            className="absolute text-center transition -translate-x-1/2 -translate-y-1/2 cursor-pointer top-1/2 left-1/2 text-brand-white"
          >
            {imageUpload.status === "uploading"
              ? `${imageUpload.detail.toFixed(0)}%`
              : "Upload new image"}
          </Text>
          <input
            type="file"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

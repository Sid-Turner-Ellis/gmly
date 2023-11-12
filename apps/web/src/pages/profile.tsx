import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { Icon } from "@/components/icon";
import { Header } from "@/components/site-layout/header";
import { Text } from "@/components/text";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { useOptimisticMutation } from "@/hooks/use-optimistic-mutation";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useToast } from "@/providers/toast-provider";
import { ProfilesService } from "@/services/profiles";
import { cn } from "@/utils/cn";
import { parseStrapiImage } from "@/utils/parse-strapi-image";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useReducer, useRef, useState } from "react";
import Uppy from "@uppy/core";
import XHR from "@uppy/xhr-upload";

const uppy = new Uppy().use(XHR, {
  endpoint: `https://${process.env.NEXT_PUBLIC_STRAPI_HOSTNAME}/api/upload`,
  formData: true,
  fieldName: "files", // Strapi expects the file field to be called "files"
});

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUpload, setImageUpload] = useState<{
    status: "uploading" | "complete" | "idle";
    detail: number;
  }>({ status: "idle", detail: 0 });
  const { mutate } = useOptimisticMutation<
    AuthenticatedUser,
    typeof ProfilesService.updateProfile
  >(ProfilesService.updateProfile, {
    queryKey: ["tw-cache", "user"],
    updateCache(variables, previousValueDraft) {
      if (variables.bio && previousValueDraft) {
        previousValueDraft.data.profile.bio = variables.bio;
      }

      return previousValueDraft;
    },
    onError() {
      addToast({
        type: "error",
        message: "Something went wrong",
      });
    },
    onSuccess() {
      addToast({
        type: "success",
        message: "Profile updated",
      });
    },
  });

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

  useEffect(() => {
    if (isEditMode) {
      bioRef.current?.focus();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (imageFile) {
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

  if (!user) {
    // TODO: Check if it's loading
    return null;
  }

  const { username, createdAt, bio, avatar } = user.data.profile;
  const playerSince = new Date(createdAt).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <div className="relative z-0">
      <div className="flex gap-6">
        <div className="w-52">
          <AspectRatio.Root
            ratio={1}
            className="relative overflow-hidden rounded shadow-md group"
          >
            <Image
              className="object-cover"
              alt="profile image"
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : parseStrapiImage(avatar).thumbnailUrl
              }
              fill={true}
            />
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
          </AspectRatio.Root>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Heading
              variant="h1"
              className={cn(
                "mb-0 outline-none cursor-default focus:outline-none p-1 max-w-[400px] overflow-hidden px-3"
              )}
            >
              {username}
            </Heading>
            <Button
              disabled={imageUpload.status === "uploading"}
              onClick={() => {
                if (imageUpload.status === "uploading") {
                  return;
                }
                const text = bioRef.current?.textContent ?? undefined;
                const imageId =
                  imageUpload.status === "complete"
                    ? imageUpload.detail
                    : undefined;

                if (isEditMode) {
                  mutate({
                    profileId: user.data.profile.id,
                    bio: text,
                    avatar: imageId,
                  });
                }

                setImageUpload({ status: "idle", detail: 0 });
                setIsEditMode((p) => !p);
              }}
              title={isEditMode ? "Save" : "Edit"}
              size="sm"
              variant={isEditMode ? "primary" : "secondary"}
              className="duration-75"
            />
          </div>
          <Text variant="p" className="px-3 mb-2 cursor-default">
            Player since {playerSince}
          </Text>

          <Text
            contentEditable={isEditMode && ("plaintext-only" as any)}
            ref={bioRef}
            variant="p"
            className={cn(
              "px-3 cursor-default max-w-[350px]",
              isEditMode &&
                "border border-solid text-brand-white rounded cursor-text outline-none focus:outline-none border-brand-navy-accent-light focus:border-brand-gray"
            )}
          >
            {isEditMode ? bio || "Once upon a time..." : bio}
          </Text>
        </div>
      </div>
    </div>
  );
}

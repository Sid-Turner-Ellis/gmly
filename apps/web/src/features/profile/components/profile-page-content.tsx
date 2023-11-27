import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { Icon } from "@/components/icon";
import { Header } from "@/components/site-layout/header";
import { Text } from "@/components/text";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { useOptimisticMutation } from "@/hooks/use-optimistic-mutation";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useToast } from "@/providers/toast-provider";
import { cn } from "@/utils/cn";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useReducer, useRef, useState } from "react";
import Uppy from "@uppy/core";
import XHR from "@uppy/xhr-upload";
import { ProfileResponse, ProfileService } from "../profile-service";
import { ProfilePageLayout } from "./profile-page-layout";
import { ImageUpload, ProfileImage, ProfileImageProps } from "./profile-image";
import { ProfileBio } from "./profile-bio";
import { EditableImage } from "@/components/editable-image";
import { useStrapiImageUpload } from "@/hooks/use-strapi-image-upload";

export const ProfilePageContent = ({
  profile: {
    id,
    attributes: { username, bio, avatar, createdAt },
  },
}: {
  profile: ProfileResponse;
}) => {
  const { user } = useAuth();
  const isOwnProfile = user?.data.profile.id === id;
  const [isEditMode, setIsEditMode] = useState(false);
  const { addToast } = useToast();
  const {
    imageUploadState,
    resetUploadState,
    fileObjectUrl,
    onFileInputChange,
  } = useStrapiImageUpload();
  const bioRef = useRef<HTMLParagraphElement>(null);
  const { mutate } = useOptimisticMutation<
    AuthenticatedUser,
    typeof ProfileService.updateProfile
  >(ProfileService.updateProfile, {
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
    if (isEditMode) {
      bioRef.current?.focus();
    }
  }, [isEditMode]);

  const handleOnClick = () => {
    if (!isOwnProfile) return;
    if (imageUploadState.status === "uploading") return;

    const text = bioRef.current?.textContent ?? undefined;
    const imageId =
      imageUploadState.status === "complete"
        ? imageUploadState.detail
        : undefined;

    if (isEditMode) {
      mutate({
        profileId: id,
        bio: text,
        avatar: imageId,
      });
    }

    resetUploadState();
    setIsEditMode((p) => !p);
  };

  const playerSince = new Date(createdAt).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <ProfilePageLayout
      Right={
        <EditableImage
          isEditMode={isEditMode}
          initialImage={avatar}
          imageUploadState={imageUploadState}
          fileObjectUrl={fileObjectUrl}
          onFileInputChange={onFileInputChange}
        />
      }
      LeftTop={
        <div className="flex items-center gap-4 px-3 mb-1">
          <Heading
            variant="h1"
            className={
              "mb-0 outline-none cursor-default focus:outline-none overflow-hidden"
            }
          >
            {username}
          </Heading>
          {isOwnProfile && (
            <Button
              disabled={imageUploadState.status === "uploading"}
              onClick={handleOnClick}
              title={isEditMode ? "Save" : "Edit"}
              size="sm"
              variant={isEditMode ? "primary" : "secondary"}
              className="duration-75"
            />
          )}
        </div>
      }
      LeftMiddle={
        <Text variant="p" className="px-3 cursor-default">
          Player since {playerSince}
        </Text>
      }
      LeftBottom={
        <ProfileBio isEditMode={isEditMode} bio={bio} bioRef={bioRef} />
      }
    />
  );
};

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
import { ProfileResponse, ProfileService } from "../profile-service";
import { ProfileBio } from "./profile-bio";
import { useStrapiImageUpload } from "@/hooks/use-strapi-image-upload";
import { EditableImagePageSection } from "@/components/editable-image-page-section";
import { TeamsTable } from "./teams-table/teams-table";

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

  const onSave = () => {
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
  };

  const playerSince = new Date(createdAt).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <div>
      <EditableImagePageSection
        isEditMode={isEditMode}
        initialImage={avatar}
        imageUploadState={imageUploadState}
        fileObjectUrl={fileObjectUrl}
        onFileInputChange={onFileInputChange}
        setIsEditMode={setIsEditMode}
        onSave={onSave}
        showEditButton={isOwnProfile}
        TitleSection={
          <Heading
            variant="h1"
            className={
              "mb-0 outline-none cursor-default focus:outline-none overflow-hidden"
            }
          >
            {username}
          </Heading>
        }
        ContentSection={
          <>
            <Text variant="p" className="cursor-default">
              Player since {playerSince}
            </Text>
            <ProfileBio isEditMode={isEditMode} bio={bio} bioRef={bioRef} />
          </>
        }
      />

      <TeamsTable profileId={id} />
    </div>
  );
};

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
import { parseStrapiImage } from "@/utils/parse-strapi-image";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useReducer, useRef, useState } from "react";
import Uppy from "@uppy/core";
import XHR from "@uppy/xhr-upload";
import { ProfilesService } from "../profiles-service";
import { ProfilePageLayout } from "./profile-page-layout";
import { ImageUpload, ProfileImage, ProfileImageProps } from "./profile-image";
import { ProfileBio } from "./profile-bio";

export const ProfilePageContent = ({
  user: {
    data: {
      profile: { username, bio, avatar, createdAt, id },
    },
  },
}: {
  user: AuthenticatedUser;
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { addToast } = useToast();
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [imageUpload, setImageUpload] = useState<ImageUpload>({
    status: "idle",
    detail: 0,
  });
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
    if (isEditMode) {
      bioRef.current?.focus();
    }
  }, [isEditMode]);

  const handleOnClick = () => {
    if (imageUpload.status === "uploading") {
      return;
    }
    const text = bioRef.current?.textContent ?? undefined;
    const imageId =
      imageUpload.status === "complete" ? imageUpload.detail : undefined;

    if (isEditMode) {
      mutate({
        profileId: id,
        bio: text,
        avatar: imageId,
      });
    }

    setImageUpload({ status: "idle", detail: 0 });
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
        <ProfileImage
          isEditMode={isEditMode}
          imageUpload={imageUpload}
          setImageUpload={setImageUpload}
          avatar={avatar}
        />
      }
      LeftTop={
        <div className="flex items-center gap-4 mb-1 px-3">
          <Heading
            variant="h1"
            className={
              "mb-0 outline-none cursor-default focus:outline-none overflow-hidden"
            }
          >
            {username}
          </Heading>
          <Button
            disabled={imageUpload.status === "uploading"}
            onClick={handleOnClick}
            title={isEditMode ? "Save" : "Edit"}
            size="sm"
            variant={isEditMode ? "primary" : "secondary"}
            className="duration-75"
          />
        </div>
      }
      LeftMiddle={
        <Text variant="p" className="cursor-default px-3">
          Player since {playerSince}
        </Text>
      }
      LeftBottom={
        <ProfileBio isEditMode={isEditMode} bio={bio} bioRef={bioRef} />
      }
    />
  );
};

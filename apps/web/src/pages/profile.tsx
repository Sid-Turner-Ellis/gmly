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
import { ProfilesService } from "@/features/profile/profiles-service";
import { ProfilePageSkeleton } from "@/features/profile/components/profile-page-skeleton";
import { ProfilePageContent } from "@/features/profile/components/profile-page-content";

export default function ProfilePage() {
  const { user, signIn, authStatus } = useAuth();

  if (authStatus === "unauthenticated") {
    signIn();
    return null;
  }

  // return <ProfilePageSkeleton />;
  return (
    <div className="relative z-0">
      {authStatus === "loading" && <ProfilePageSkeleton />}
      {authStatus === "authenticated" && <ProfilePageContent user={user!} />}
    </div>
  );
}

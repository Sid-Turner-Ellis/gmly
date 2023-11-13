import { Text } from "@/components/text";
import { cn } from "@/utils/cn";
import { RefObject, forwardRef, useEffect, useRef } from "react";

type ProfileBioProps = {
  isEditMode: boolean;
  bio: string | null;
  bioRef: RefObject<HTMLParagraphElement>;
};

export const ProfileBio = ({ isEditMode, bio, bioRef }: ProfileBioProps) => {
  useEffect(() => {
    if (isEditMode) {
      bioRef.current?.focus();
    }
  }, [isEditMode]);
  return (
    <Text
      contentEditable={isEditMode && ("plaintext-only" as any)}
      ref={bioRef}
      variant="p"
      className={cn(
        "cursor-default w-full px-3 py-1",
        isEditMode &&
          "border border-solid text-brand-white rounded cursor-text outline-none focus:outline-none border-brand-navy-accent-light focus:border-brand-gray"
      )}
    >
      {isEditMode ? bio || "Once upon a time..." : bio}
    </Text>
  );
};

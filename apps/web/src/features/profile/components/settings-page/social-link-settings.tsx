import { Profile } from "../../profile-service";
import { useState } from "react";
import { Button } from "@/components/button";
import { AddSocialLinkModal } from "./add-social-link-modal";
import { SubSettingLayout } from "./sub-setting-layout";

type SocialLinkSettingsProps = {
  socialLinks: Profile["social_links"];
  profileId: number;
};

export const SocialLinkSettings = ({
  socialLinks,
  profileId,
}: SocialLinkSettingsProps) => {
  const [isAddSocialLinkModalOpen, setIsAddSocialLinkModalOpen] =
    useState(false);

  return (
    <div>
      {isAddSocialLinkModalOpen && (
        <AddSocialLinkModal
          isOpen={isAddSocialLinkModalOpen}
          closeModal={() => setIsAddSocialLinkModalOpen(false)}
          profileId={profileId}
          socialLinks={socialLinks}
        />
      )}

      <SubSettingLayout
        title="Social links"
        onClick={() => setIsAddSocialLinkModalOpen(true)}
      >
        hello
      </SubSettingLayout>
    </div>
  );
};

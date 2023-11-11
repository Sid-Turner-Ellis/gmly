import { useAuth } from "@/hooks/use-auth";
import { Button } from "../button";
import * as Avatar from "@radix-ui/react-avatar";

type ProfileButtonsProps = {};

export const ProfileButtons = ({}: ProfileButtonsProps) => {
  const { user } = useAuth();
  const fakeUrl = "";
  const username = user?.data?.profile?.username ?? "User";
  return (
    <div className="flex gap-3 relative z-0">
      <Button
        title="150 USDC"
        className="border-brand-primary hover:border-brand-primary-dark text-brand-white"
        icon="coins"
      />
      <div>
        <Button
          variant="secondary"
          title={username ?? "Profile"}
          icon={
            <Avatar.Root className="inline-flex h-full w-full select-none items-center justify-center overflow-hidden rounded-full">
              <Avatar.Image
                className="h-full w-full rounded-[inherit] object-cover"
                src={fakeUrl}
                alt={"Avatar"}
              />
              <Avatar.Fallback
                className="flex text-black bg-pink-400  text-[13px] font-medium h-full w-full relative"
                delayMs={600}
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {username[0]}
                </span>
              </Avatar.Fallback>
            </Avatar.Root>
          }
        />
      </div>
    </div>
  );
};

import { useAuth } from "@/hooks/use-auth";
import { Button } from "../button";
import * as Avatar from "@radix-ui/react-avatar";
import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";

type ProfileButtonsProps = {};

export const ProfileButtons = ({}: ProfileButtonsProps) => {
  const { user } = useAuth();
  const isDesktop = useTailwindBreakpoint("md");
  const fakeUrl = "";
  const username = user?.data?.profile?.username ?? "User";
  return (
    <div className="relative z-0 flex h-full gap-2 lg:gap-3">
      <Button
        title={isDesktop ? "150 USDC" : undefined}
        className="h-full border-brand-primary hover:border-brand-primary-dark text-brand-white"
        icon="usdc"
      />
      <div className="h-full">
        <Button
          variant="secondary"
          title={isDesktop ? username ?? "Profile" : undefined}
          className="h-full"
          icon={
            <Avatar.Root className="inline-flex items-center justify-center w-full h-full overflow-hidden rounded-full select-none">
              <Avatar.Image
                className="h-full w-full rounded-[inherit] object-cover"
                src={fakeUrl}
                alt={"Avatar"}
              />
              <Avatar.Fallback
                className="flex text-black bg-pink-400  text-[13px] font-medium h-full w-full relative"
                delayMs={600}
              >
                <span className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  {username[0].toUpperCase()}
                </span>
              </Avatar.Fallback>
            </Avatar.Root>
          }
        />
      </div>
    </div>
  );
};

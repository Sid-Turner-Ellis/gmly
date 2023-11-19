import { Heading } from "@/components/heading";
import Switch from "@/components/switch";
import { Text } from "@/components/text";
import { tailwind } from "@/lib/tailwind";
import { useEffect, useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/features/profile/profile-service";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { produce } from "immer";
import { useToast } from "@/providers/toast-provider";
import { Skeleton } from "@/components/skeleton";

export default function SettingsPage() {
  const { user, authStatus, signIn } = useAuth();

  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const wagerMode = user?.data.profile.wager_mode ?? false;
  const trustMode = user?.data.profile.trust_mode ?? false;

  const { mutate, isError, reset } = useMutation(ProfileService.updateProfile, {
    async onMutate(variables) {
      await queryClient.cancelQueries(["tw-cache", "user"]);
      const previousUser = queryClient.getQueryData([
        "tw-cache",
        "user",
      ]) as AuthenticatedUser;

      if (!previousUser) {
        throw new Error("User not found in cache");
      }

      const newUser = produce(previousUser, (draft) => {
        if (variables.wager_mode !== undefined) {
          draft.data!.profile.wager_mode = variables.wager_mode;
        }
        if (variables.trust_mode !== undefined) {
          draft.data!.profile.trust_mode = variables.trust_mode;
        }
      });

      queryClient.setQueryData(["tw-cache", "user"], newUser);

      return { previousUser };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(["tw-cache", "user"], context!.previousUser);
    },
    onSuccess() {
      addToast({
        type: "success",
        message: "Settings updated",
      });
    },
    onSettled() {
      queryClient.invalidateQueries(["tw-cache", "user"]);
    },
  });

  useEffect(() => {
    if (isError) {
      addToast({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });

      reset();
    }
  }, [isError]);

  const setMode = (mode: "trust" | "wager", value: boolean) => {
    if (!user) return;
    mutate({
      profileId: user?.data.profile.id ?? 0,
      ...(mode === "trust" ? { trust_mode: value } : { wager_mode: value }),
    });
  };

  if (authStatus === "unauthenticated") {
    signIn();
    return null;
  }

  return (
    <div>
      <Heading variant="h1">Settings</Heading>
      {authStatus === "loading" && <Skeleton className="w-full h-[300px]" />}
      {authStatus === "authenticated" && (
        <div className="max-w-3xl p-4 rounded bg-brand-navy-light">
          <>
            <Heading variant="h3">Match settings</Heading>
            <div className="flex items-center justify-between gap-8">
              <div>
                <Text variant="label" className="mb-1">
                  Wager mode
                </Text>
                <Text variant="p">
                  Enabling this setting confirms that you know the risks that
                  apply when wagering your crypo against other teams and
                  players.
                </Text>
              </div>
              <div className="grow">
                <Switch
                  value={wagerMode}
                  setValue={(v) => setMode("wager", v)}
                />
              </div>
            </div>

            <Separator.Root className="bg-brand-navy-light-accent-light data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />

            <div className="flex items-center justify-between gap-8">
              <div>
                <Text variant="label" className="mb-1">
                  Automatically allow team leaders to create and accept wager
                  matches
                </Text>
                <Text variant="p">
                  Allow leaders and co-leaders of any team you join to have the
                  ability to place you in wager matches without your permission.
                  It is important that you trust the members of your team before
                  joining when this is enabled.
                </Text>
              </div>
              <div className="grow">
                <Switch
                  value={trustMode}
                  setValue={(v) => setMode("trust", v)}
                />
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
}

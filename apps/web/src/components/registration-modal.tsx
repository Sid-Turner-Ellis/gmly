import { useEffect, useRef, useState } from "react";
import { Modal } from "./modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from "@/utils/cn";
import { Icon } from "./icon";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  ProfileResponse,
  ProfilesService,
  Regions,
} from "@/features/profile/profiles-service";
import { Button } from "./button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRegistrationModal } from "@/providers/registration-modal-provider";
import { produce } from "immer";
import { useToast } from "@/providers/toast-provider";
import { StrapiError } from "@/utils/strapi-error";
import { Text, textVariantClassnames } from "./text";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { InputLayout } from "./input-layout";

type FormInputs = {
  username: string;
  region: (typeof REGIONS)[0];
};

const REGIONS: Regions[] = ["Asia", "Europe", "NA", "Oceania"];

export const RegistrationModal = () => {
  const { isOpen, close } = useRegistrationModal();
  const { user, logout } = useAuth();
  const hasUsername = user?.data?.profile.username;
  const hasRegion = user?.data?.profile.region;
  const { addToast } = useToast();
  const [region, setRegion] = useState<Regions | null>(null);
  const queryClient = useQueryClient();
  const selectRef = useRef<HTMLDivElement>(null);
  const { mutate, isLoading, isSuccess, isError } = useMutation(
    ProfilesService.updateProfile,
    {
      onError(error) {
        const usernameTaken =
          StrapiError.isStrapiError(error) && error.error.status === 400;

        if (usernameTaken) {
          setError("username", {
            type: "custom",
            message: "Username is taken",
          });
        } else {
          logout();
          addToast({
            type: "error",
            message:
              "Internal server error. Email support@gamerly.app if this error continues!",
          });
        }
      },
      onSuccess(data) {
        queryClient.setQueryData(["tw-cache", "user"], (oldData: any) => {
          const thirdWebUserData = oldData as AuthenticatedUser;

          const { region, username } = data.attributes;

          const newUserData = produce(thirdWebUserData, (draft) => {
            draft.data!.profile.region = region ?? draft.data!.profile.region;
            draft.data!.profile.username =
              username ?? draft.data!.profile.username;
          });

          return newUserData;
        });
      },
    }
  );

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async ({ username }) => {
    if (!region && !hasRegion) {
      setError("region", { type: "custom", message: "Please select a region" });
      return;
    }

    const profileId = user?.data?.profile.id!;

    mutate({
      profileId,
      username: username ?? undefined,
      region: region ?? undefined,
    });
  };

  const onCancel = () => {
    logout();
    close();
  };

  useEffect(() => {
    if (errors.region && region) {
      clearErrors("region");
    }
  }, [region]);

  return (
    <div className="relative z-0">
      <Modal
        isLoading={isLoading}
        title="Create an account"
        isOpen={isOpen}
        setIsOpen={() => open()}
        description="You need to create an account to continue."
        Footer={
          <>
            <div className="flex justify-end gap-4">
              <Button variant="secondary" title="Cancel" onClick={onCancel} />
              <Button
                variant="primary"
                title="Create"
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {!hasUsername && (
            <div>
              <InputLayout icon="profile" error={errors?.username?.message}>
                <input
                  autoComplete="off"
                  type="text"
                  defaultValue={user?.data?.profile.username ?? ""}
                  {...register("username", {
                    validate: (value) => {
                      if (!hasUsername) {
                        if (value.length === 0) return "Username is required";
                        if (!/^[a-zA-Z0-9]+$/.test(value)) {
                          return "Username can only contain letters and numbers";
                        }
                      }
                    },
                  })}
                  disabled={false}
                  placeholder="Username"
                  aria-invalid={errors.username ? "true" : "false"}
                  className={cn(
                    textVariantClassnames.p,
                    "h-full bg-transparent placeholder:text-brand-gray outline-none focus:outline-none w-full text-brand-white",
                    errors.username &&
                      "border-brand-status-error focus:border-brand-status-error"
                  )}
                />
              </InputLayout>
            </div>
          )}

          {!hasRegion && (
            <div>
              <SelectPrimitive.Root
                value={region ?? "Region"}
                onValueChange={(v) => {
                  setRegion(v as Regions);
                }}
              >
                <SelectPrimitive.Trigger
                  className="w-full outline-none focus:outline-none"
                  onFocus={() => {
                    selectRef.current?.focus();
                  }}
                  onBlur={() => {
                    selectRef.current?.blur();
                  }}
                  asChild
                >
                  <InputLayout
                    icon="flag"
                    error={errors?.region?.message}
                    ref={selectRef}
                    tabIndex={-1}
                  >
                    <div className="flex items-center justify-between">
                      <Text className={cn({ "text-brand-white": !!region })}>
                        {region ?? "Region"}
                      </Text>

                      <Icon icon="chevron-down" size={12} />
                    </div>
                  </InputLayout>
                </SelectPrimitive.Trigger>

                <SelectPrimitive.Portal>
                  <SelectPrimitive.Content
                    className="w-[var(--radix-select-trigger-width)] z-50"
                    position="popper"
                    sideOffset={8}
                    side="bottom"
                  >
                    <SelectPrimitive.Viewport className="w-full overflow-hidden rounded bg-brand-navy-light">
                      {REGIONS.map((region) => (
                        <SelectPrimitive.Item
                          value={region}
                          key={region}
                          className="w-full gap-12 px-4 py-2 border-2 border-transparent transition-all bg-brand-navy-light  data-[highlighted]:outline-none data-[highlighted]:bg-white/5 outline-none text-brand-white"
                        >
                          <SelectPrimitive.ItemText>
                            {region}
                          </SelectPrimitive.ItemText>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.Viewport>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
              </SelectPrimitive.Root>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

import { USER_QUERY_KEY } from "@/constants";
import { useToast } from "@/providers/toast-provider";
import { StrapiError } from "@/utils/strapi-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const USER_ERRORS = [
  "GamerTagCannotBeEmpty",
  "GamerTagTakenForGame",
  "GamerTagRequiredIfInTeamForGame",
] as const;

type UserError = (typeof USER_ERRORS)[number];

export const useGamerTagMutation = <
  TMutationFn extends (args: any) => Promise<any>,
>(
  mutationFn: TMutationFn,
  {
    successMessage,
    onSuccess,
    closeModal,
    onUserError,
  }: {
    successMessage: string;
    closeModal: () => void;
    onUserError?: (error: UserError) => void;
    onSuccess?: () => void;
  }
) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [userError, setUserError] = useState<UserError | null>(null);
  const {
    mutate,
    isLoading,
    reset: resetMutation,
  } = useMutation(mutationFn, {
    onError(error) {
      const strapiError = StrapiError.isStrapiError(error);

      const isUserError =
        strapiError && USER_ERRORS.includes(error.error.message as UserError);

      if (isUserError) {
        setUserError(error.error.message as UserError);
        onUserError?.(error.error.message as UserError);
      } else {
        closeModal();
        addToast({
          message: "Something went wrong",
          type: "error",
        });
      }
    },
    onSuccess() {
      queryClient.invalidateQueries(USER_QUERY_KEY);

      addToast({
        message: successMessage,
        type: "success",
      });

      onSuccess?.();
      closeModal();
    },
  });

  const reset = () => {
    setUserError(null);
    resetMutation();
  };
  return {
    mutate,
    userError,
    isLoading,
    reset,
  } as const;
};

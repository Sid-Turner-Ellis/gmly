import {
  GameSelect,
  useGameSelect,
} from "@/features/game/components/game-select";
import { useToast } from "@/providers/toast-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GamerTagService } from "../gamer-tag-service";
import { StrapiError } from "@/utils/strapi-error";
import { USER_QUERY_KEY } from "@/constants";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/components/button";
import { TextInput } from "@/components/text-input";
import { Text } from "@/components/text";

export const CreateGamerTagModal = ({
  isOpen,
  closeModal,
  gameIdsToExclude,
}: {
  isOpen: boolean;
  closeModal: () => void;
  gameIdsToExclude?: number[];
}) => {
  const { selectedGame, setSelectedGame, setGameSelectError, gameSelectError } =
    useGameSelect();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createTagMutation,
    isLoading: createTagIsLoading,
    error: createTagError,
    isError: createTagIsError,
    data: createTagData,
    reset: resetCreateTagMutation,
  } = useMutation(
    ({ tagName }: { tagName: string }) =>
      GamerTagService.createGamerTag(selectedGame?.id!, tagName),
    {
      onError(error) {
        const isKnownError =
          StrapiError.isStrapiError(error) &&
          error.error.message === "GamerTagTakenForGame";

        if (!isKnownError) {
          addToast({
            message: "Something went wrong",
            type: "error",
          });

          closeModal();
        }
      },
      onSuccess() {
        // TODO: Consider adding the new gamer tag to the users cache
        addToast({
          message: "Gamer tag created successfully",
          type: "success",
        });
        queryClient.invalidateQueries(USER_QUERY_KEY);
        closeModal();
      },
    }
  );

  const closeModalIfNotLoading = useCallback(() => {
    if (!createTagIsLoading) {
      closeModal();
    }
  }, [createTagIsLoading]);

  const {
    handleSubmit,
    formState,
    register,
    reset: resetFormState,
  } = useForm<{ tagName: string }>();

  useEffect(() => {
    if (selectedGame) {
      setGameSelectError(false);
    }
  }, [selectedGame]);

  const onSubmit = () => {
    if (!selectedGame) {
      setGameSelectError(true);
      return;
    }

    handleSubmit(({ tagName }) => {
      createTagMutation({ tagName });
    })();
  };

  useEffect(() => {
    return () => {
      resetCreateTagMutation();
      setSelectedGame(null);
      setGameSelectError(false);
      resetFormState();
    };
  }, [isOpen]);

  const errorMessage =
    (gameSelectError && "Please select a game") ||
    (formState.errors["tagName"] && "Please enter a gamer tag") ||
    (createTagIsError &&
      (StrapiError.isStrapiError(createTagError) &&
      createTagError.error.message === "GamerTagTakenForGame"
        ? "Gamer tag already taken for this game"
        : "Something went wrong"));

  return (
    <Modal
      closeModal={closeModalIfNotLoading}
      isOpen={isOpen}
      isClosable
      isLoading={createTagIsLoading}
      size={"sm"}
      title="New Gamer Tag"
      description="Create a gamer tag so that the other team can find you in the game"
      Footer={
        <div className="flex justify-end gap-4">
          <Button
            title="Cancel"
            variant="secondary"
            onClick={closeModalIfNotLoading}
          />
          <Button
            title="Create"
            variant="primary"
            onClick={() => {
              onSubmit();
            }}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-2 max-w-80">
        <GameSelect
          selectedGame={selectedGame}
          setSelectedGame={setSelectedGame}
          gameIdsToExclude={gameIdsToExclude}
          gameSelectError={gameSelectError}
        />
        <TextInput
          error={!!formState.errors["tagName"]}
          {...register("tagName", { required: true })}
        />
        {!!errorMessage && (
          <Text className="font-semibold text-brand-status-error">
            {errorMessage}
          </Text>
        )}
      </div>
    </Modal>
  );
};

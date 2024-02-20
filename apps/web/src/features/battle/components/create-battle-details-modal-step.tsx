import { Control } from "react-hook-form";
import { CreateBattleLabelInputGroup } from "./create-battle-label-input-group";
import { DarkSimpleSelect } from "./dark-simple-select";
import { CreateBattleInputs } from "./create-battle-modal";
import { MatchRegions } from "../battle-service";
import { DarkToggleGroup } from "./dark-toggle-group";
import { SelectCustomAttribute } from "@/features/game/game-service";
import { CustomAttributeInput } from "./custom-attribute-input";
import { DollarInput, useDollarInput } from "@/components/dollar-input";
import { Button } from "@/components/button";
import { useToast } from "@/providers/toast-provider";
import {
  getCentsFromStringValue,
  getTeamSizeNumberFromTeamOption,
} from "../util";

const BATTLE_REGIONS: MatchRegions[] = [
  "Europe",
  "North America",
  "Asia",
  "Oceania",
];
const Content = ({
  control,
  timeOptions,
  teamSizeOptions,
  customAttributes,
  setValue,
  value,
  teamSize,
}: {
  control: Control<CreateBattleInputs>;
  timeOptions: string[];
  teamSizeOptions: string[];
  customAttributes: SelectCustomAttribute[];
  teamSize: number;
} & Omit<ReturnType<typeof useDollarInput>, "amountInCents">) => {
  return (
    <div className="flex flex-col gap-3">
      <CreateBattleLabelInputGroup title="Start time">
        <DarkSimpleSelect
          name="time"
          control={control}
          options={timeOptions}
          getOptionLabel={(iso) =>
            new Date(iso).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })
          }
        />
      </CreateBattleLabelInputGroup>
      <CreateBattleLabelInputGroup title="Region">
        <DarkSimpleSelect
          name="region"
          control={control}
          options={BATTLE_REGIONS}
        />
      </CreateBattleLabelInputGroup>
      <CreateBattleLabelInputGroup title="Team size">
        <DarkToggleGroup
          name="teamSize"
          control={control}
          options={teamSizeOptions}
        />
      </CreateBattleLabelInputGroup>
      <CreateBattleLabelInputGroup title="Series">
        <DarkToggleGroup
          name="series"
          control={control}
          options={["Bo1", "Bo3", "Bo5"]}
        />
      </CreateBattleLabelInputGroup>
      {customAttributes.map((customAttribute) => (
        <CustomAttributeInput
          key={customAttribute.attribute.attribute_id}
          control={control}
          customAttribute={customAttribute}
        />
      ))}
      <CreateBattleLabelInputGroup title="Wager">
        <DollarInput
          variant="small"
          setValue={setValue}
          value={value}
          stepInCents={teamSize * 100}
        />
      </CreateBattleLabelInputGroup>
    </div>
  );
};
const Footer = ({
  closeModal,
  profileBalance,
  wagerAmount,
  wagerModeEnabled,
  isFormValid,
  teamSize,
  nextStep,
}: {
  closeModal: () => void;
  profileBalance: number;
  wagerAmount: number;
  wagerModeEnabled: boolean;
  isFormValid: () => Promise<boolean>;
  teamSize: CreateBattleInputs["teamSize"];
  nextStep: () => void;
}) => {
  const { addToast } = useToast();
  return (
    <>
      <Button variant={"secondary"} title="Cancel" onClick={closeModal} />
      <Button
        title="Next"
        onClick={async () => {
          if (!(await isFormValid())) {
            return;
          }

          const meetsSettingsRequirements =
            wagerAmount > 0 ? wagerModeEnabled : true;

          const meetsBalanceRequirements =
            wagerAmount > 0
              ? profileBalance >=
                wagerAmount / getTeamSizeNumberFromTeamOption(teamSize)
              : true;

          const errorMessage = !meetsSettingsRequirements
            ? "You must enable wager mode before creating wagers"
            : !meetsBalanceRequirements
              ? "You do not have enough balance to create this battle"
              : null;

          if (errorMessage) {
            addToast({
              type: "error",
              message: errorMessage,
            });

            return;
          }

          nextStep();
        }}
      />
    </>
  );
};

export const CreateBattleDetailsStep = {
  Content,
  Footer,
};

import { Control } from "react-hook-form";
import { CreateBattleInputs } from "./create-battle-modal";
import { CreateBattleLabelInputGroup } from "./create-battle-label-input-group";
import { DarkSimpleSelect } from "./dark-simple-select";
import { SelectCustomAttribute } from "@/features/game/game-service";
import { DarkToggleGroup } from "./dark-toggle-group";

type CustomAttributeInputProps = {
  customAttribute: SelectCustomAttribute;
  control: Control<CreateBattleInputs>;
};

export const CustomAttributeInput = ({
  customAttribute,
  control,
}: CustomAttributeInputProps) => {
  const inputName = `customAttributes.${customAttribute.attribute.attribute_id}`;
  const options = customAttribute.options.map((o) => o.option_id);
  const getOptionLabel = (optionId: string) =>
    customAttribute.options.find((o) => o.option_id === optionId)
      ?.display_name ?? "";

  switch (customAttribute.__component) {
    case "custom-attributes.select":
      return (
        <CreateBattleLabelInputGroup
          title={customAttribute.attribute.display_name}
        >
          {customAttribute.input_type === "dropdown" && (
            <DarkSimpleSelect
              control={control}
              name={inputName}
              options={options}
              getOptionLabel={getOptionLabel}
            />
          )}
          {(customAttribute.input_type === "radio" ||
            customAttribute.input_type === "multi-select") && (
            <DarkToggleGroup
              allowMultiple={customAttribute.input_type === "multi-select"}
              control={control}
              name={inputName}
              options={options}
              getOptionLabel={getOptionLabel}
            />
          )}
        </CreateBattleLabelInputGroup>
      );

    default:
      return null;
  }
};

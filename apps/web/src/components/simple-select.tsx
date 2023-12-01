import { cn } from "@/utils/cn";
import * as SelectPrimitive from "@radix-ui/react-select";
import { textVariantClassnames } from "./text";
import { Icon } from "./icon";
import { ClassValue } from "clsx";
import { useMemo } from "react";

type CustomOption = {
  option: string;
  triggerClassName?: ClassValue;
  optionClassName?: ClassValue;
};

type Option = string | CustomOption;

type SimpleSelectProps = {
  options: Option[];
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  placeholder?: string;
  disabled?: boolean;
  disabledOptions?: string[];
  getOptionLabel?: (value: string) => string; // Allows you to pass in an ID as the option value and then get the label from the ID
};

export const SimpleSelect = ({
  options,
  value,
  setValue,
  disabled,
  disabledOptions = [],
  placeholder,
  getOptionLabel = (value) => value,
}: SimpleSelectProps) => {
  const isOptionDisabled = (option: string) => disabledOptions.includes(option);

  const resolvedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string" ? { option } : option
      ) as CustomOption[],
    [options]
  );

  const triggerClassName = useMemo(
    () =>
      resolvedOptions.find((option) => option.option === value)
        ?.triggerClassName || "",
    [resolvedOptions, value]
  );

  return (
    <SelectPrimitive.Root
      disabled={disabled}
      value={value}
      onValueChange={(v) => {
        setValue(v);
      }}
    >
      <SelectPrimitive.Trigger
        className={cn(
          "min-w-min outline-none focus:outline-none flex items-center gap-3",
          textVariantClassnames.p,
          triggerClassName
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        {!disabled && (
          <SelectPrimitive.Icon asChild>
            <Icon icon="chevron-down" size={12} />
          </SelectPrimitive.Icon>
        )}
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-50"
          position="popper"
          sideOffset={8}
          side="bottom"
        >
          <SelectPrimitive.Viewport className="w-full overflow-hidden rounded bg-brand-navy-light">
            {resolvedOptions.map(({ option, optionClassName }) => {
              return (
                <SelectPrimitive.Item
                  value={option}
                  key={option}
                  disabled={isOptionDisabled(option)}
                  className={cn(
                    textVariantClassnames.p,
                    "w-full gap-12 p-1 border-2 border-transparent transition-all bg-brand-navy-light  data-[highlighted]:outline-none data-[highlighted]:bg-white/5 outline-none data-[disabled]:opacity-50 cursor-default",
                    isOptionDisabled(option) && "hidden",
                    optionClassName
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {getOptionLabel(option)}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              );
            })}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

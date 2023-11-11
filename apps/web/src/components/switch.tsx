import * as SwitchPrimitive from "@radix-ui/react-switch";
import { ClassValue } from "clsx";

type SwitchProps = {
  value: boolean;
  setValue: (value: boolean) => void;
  className?: ClassValue;
};
const Switch = ({ value, setValue, className }: SwitchProps) => (
  <SwitchPrimitive.Root
    checked={value}
    onCheckedChange={setValue}
    className="w-[55px] shadow-2xl h-[27px] bg-brand-navy-accent-light rounded-full relative data-[state=checked]:bg-brand-primary/40 outline-none transition cursor-default border-2 border-solid border-transparent"
    id="airplane-mode"
  >
    <SwitchPrimitive.Thumb className="shadow-2xl block w-[21px] h-[21px] bg-brand-primary rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[28px]" />
  </SwitchPrimitive.Root>
);

export default Switch;

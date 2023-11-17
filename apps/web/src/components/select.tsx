// /**
//  * Variant (large or small)
//  *
//  */
// import * as SelectPrimitive from "@radix-ui/react-select";
// import { IconType } from "./icon";
// import { useRef } from "react";

// type SelectProps = {
//   setValue: (value: string) => void;
//   options: string[];
//   icon?: IconType;
//   value: string;
// };

// export const Select = ({ setValue, options, value, icon }: SelectProps) => {
//   const ref = useRef<null | HTMLElement>();

//   return (
//     <SelectPrimitive.Root
//       value={value}
//       onValueChange={(v) => {
//         setValue(v);
//       }}
//     >
//       <SelectPrimitive.Trigger
//         className="w-full outline-none focus:outline-none"
//         onFocus={() => {
//           ref.current?.focus();
//         }}
//         onBlur={() => {
//           ref.current?.blur();
//         }}
//         asChild
//       >
//         <InputLayout
//           icon="flag"
//           error={errors?.region?.message}
//           ref={ref}
//           tabIndex={-1}
//         >
//           <div className="flex items-center justify-between">
//             <Text className={cn({ "text-brand-white": !!region })}>
//               {region ?? "Region"}
//             </Text>

//             <Icon icon="chevron-down" size={12} />
//           </div>
//         </InputLayout>
//       </SelectPrimitive.Trigger>

//       <SelectPrimitive.Portal>
//         <SelectPrimitive.Content
//           className="w-[var(--radix-select-trigger-width)] z-50"
//           position="popper"
//           sideOffset={8}
//           side="bottom"
//         >
//           <SelectPrimitive.Viewport className="w-full overflow-hidden rounded bg-brand-navy-light">
//             {REGIONS.map((region) => (
//               <SelectPrimitive.Item
//                 value={region}
//                 key={region}
//                 className={cn(
//                   textVariantClassnames.p,
//                   "w-full gap-12 px-4 py-2 border-2 border-transparent transition-all bg-brand-navy-light  data-[highlighted]:outline-none data-[highlighted]:bg-white/5 outline-none text-brand-white"
//                 )}
//               >
//                 <SelectPrimitive.ItemText>{region}</SelectPrimitive.ItemText>
//               </SelectPrimitive.Item>
//             ))}
//           </SelectPrimitive.Viewport>
//         </SelectPrimitive.Content>
//       </SelectPrimitive.Portal>
//     </SelectPrimitive.Root>
//   );
// };

// /**
//  *

//               <SelectPrimitive.Root
//                 value={region ?? "Region"}
//                 onValueChange={(v) => {
//                   setRegion(v as Regions);
//                 }}
//               >
//                 <SelectPrimitive.Trigger
//                   className="w-full outline-none focus:outline-none"
//                   onFocus={() => {
//                     ref.current?.focus();
//                   }}
//                   onBlur={() => {
//                     ref.current?.blur();
//                   }}
//                   asChild
//                 >
//                   <InputLayout
//                     icon="flag"
//                     error={errors?.region?.message}
//                     ref={ref}
//                     tabIndex={-1}
//                   >
//                     <div className="flex items-center justify-between">
//                       <Text className={cn({ "text-brand-white": !!region })}>
//                         {region ?? "Region"}
//                       </Text>

//                       <Icon icon="chevron-down" size={12} />
//                     </div>
//                   </InputLayout>
//                 </SelectPrimitive.Trigger>

//                 <SelectPrimitive.Portal>
//                   <SelectPrimitive.Content
//                     className="w-[var(--radix-select-trigger-width)] z-50"
//                     position="popper"
//                     sideOffset={8}
//                     side="bottom"
//                   >
//                     <SelectPrimitive.Viewport className="w-full overflow-hidden rounded bg-brand-navy-light">
//                       {REGIONS.map((region) => (
//                         <SelectPrimitive.Item
//                           value={region}
//                           key={region}
//                           className={cn(
//                             textVariantClassnames.p,
//                             "w-full gap-12 px-4 py-2 border-2 border-transparent transition-all bg-brand-navy-light  data-[highlighted]:outline-none data-[highlighted]:bg-white/5 outline-none text-brand-white"
//                           )}
//                         >
//                           <SelectPrimitive.ItemText>
//                             {region}
//                           </SelectPrimitive.ItemText>
//                         </SelectPrimitive.Item>
//                       ))}
//                     </SelectPrimitive.Viewport>
//                   </SelectPrimitive.Content>
//                 </SelectPrimitive.Portal>
//               </SelectPrimitive.Root>

//  */

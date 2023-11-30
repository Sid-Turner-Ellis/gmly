import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { Heading } from "./heading";
import { Text } from "./text";
import { Button } from "./button";
import { Spinner } from "./spinner";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { Cross2Icon } from "@radix-ui/react-icons";

const modalVariants = cva("max-h-[85vh] w-full", {
  variants: {
    size: {
      sm: "max-w-[380px]",
      md: "max-w-[440px]",
      lg: "max-w-[550px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  isLoading?: boolean;
  isClosable?: boolean;
  onOverlayClick?: () => void;
  Footer?: ReactNode;
} & VariantProps<typeof modalVariants>;

const ModalContent = ({ children }: { children: ReactNode }) => (
  <div className="z-30 mt-6 mb-4 px-7">{children}</div>
);

const ModalFooter = ({ children }: { children: ReactNode }) => (
  <div className="relative py-4 -z-10 px-7">
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-brand-navy" />
    {children}
  </div>
);

export const Modal = ({
  isOpen,
  setIsOpen,
  title,
  isClosable,
  description,
  isLoading,
  children,
  onOverlayClick,
  size,
  Footer,
}: ModalProps) => {
  return (
    <div className="relative z-0">
      <DialogPrimitives.Root open={isOpen}>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay
            className="z-10 bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 backdrop-blur-sm"
            onClick={() => {
              onOverlayClick?.();

              if (isClosable) {
                setIsOpen(false);
              }
            }}
          />
          <DialogPrimitives.Content
            className={cn(
              "pt-7 z-20 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none bg-brand-navy-light",
              modalVariants({ size })
            )}
          >
            {isClosable && (
              <DialogPrimitives.Close asChild>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-[10px] right-[10px] inline-flex h-7 w-7  appearance-none items-center transition justify-center rounded-full focus:outline-none text-brand-gray hover:bg-white/10"
                  aria-label="Close"
                >
                  <Cross2Icon aria-label="Close" />
                </button>
              </DialogPrimitives.Close>
            )}
            <DialogPrimitives.Title className="px-7">
              <Heading variant="h2" className="mb-3">
                {title}
              </Heading>
            </DialogPrimitives.Title>
            {description && (
              <DialogPrimitives.Description className="px-7">
                <Text>{description}</Text>
              </DialogPrimitives.Description>
            )}
            <ModalContent>{children}</ModalContent>
            {Footer && <ModalFooter>{Footer}</ModalFooter>}
            {!Footer && <div className="pb-3" />}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
                <Spinner />
              </div>
            )}
          </DialogPrimitives.Content>
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>
    </div>
  );
};

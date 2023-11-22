import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { Heading } from "./heading";
import { Text } from "./text";
import { Button } from "./button";
import { Spinner } from "./spinner";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  isLoading?: boolean;
  onOverlayClick?: () => void;
  Footer?: ReactNode;
};

const ModalContent = ({ children }: { children: ReactNode }) => (
  <div className="z-30 px-4 mt-6 mb-4">{children}</div>
);

const ModalFooter = ({ children }: { children: ReactNode }) => (
  <div className="relative px-4 py-4">
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-brand-navy" />
    {children}
  </div>
);

export const Modal = ({
  isOpen,
  setIsOpen,
  title,
  description,
  isLoading,
  children,
  onOverlayClick,
  Footer,
}: ModalProps) => {
  return (
    <div className="relative z-0">
      <DialogPrimitives.Root open={isOpen}>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay
            className="z-10 bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 backdrop-blur-sm"
            onClick={onOverlayClick}
          />
          <DialogPrimitives.Content className="pt-4 z-20 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px]  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none bg-brand-navy-light">
            <DialogPrimitives.Title className="px-4">
              <Heading variant="h2" className="mb-3">
                {title}
              </Heading>
            </DialogPrimitives.Title>
            {description && (
              <DialogPrimitives.Description className="px-4">
                <Text>{description}</Text>
              </DialogPrimitives.Description>
            )}
            {children && <ModalContent>{children}</ModalContent>}
            {Footer && <ModalFooter>{Footer}</ModalFooter>}
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

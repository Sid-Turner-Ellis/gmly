import { ReactNode, createContext, useContext, useRef, useState } from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";

/**
 * WIP
 */
type ModalContextType = {
  activeModal: string | null;
  openModal: (params: { id: string; Modal: ReactNode }) => void;
  closeModal: (id: string) => void;
  closeActiveModal: () => void;
  closeAllModals: () => void;
};
const ModalContext = createContext<ModalContextType>({
  activeModal: null,
  openModal() {},
  closeActiveModal() {},
  closeAllModals() {},
  closeModal() {},
});

const useModal = () => {
  return useContext(ModalContext);
};

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<
    Parameters<ModalContextType["openModal"]>[0][]
  >([]);
  const activeModal = modals.length > 0 ? modals[modals.length - 1] : null;

  const openModal = (params: Parameters<ModalContextType["openModal"]>[0]) => {
    setModals((prev) => [...prev, params]);
  };
  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };
  const closeActiveModal = () => {
    setModals((prev) => prev.slice(0, prev.length - 1));
  };
  const closeAllModals = () => {
    setModals([]);
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal: activeModal?.id ?? null,
        openModal,
        closeModal,
        closeActiveModal,
        closeAllModals,
      }}
    >
      <DialogPrimitives.Root open={modals.length > 0}>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay className="z-10 bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 backdrop-blur-sm" />
          <DialogPrimitives.Content className="z-20 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%">
            {activeModal && activeModal.Modal}
          </DialogPrimitives.Content>
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>

      {children}
    </ModalContext.Provider>
  );
};

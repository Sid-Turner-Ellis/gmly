import { Icon, IconType } from "@/components/icon";
import { Text } from "@/components/text";
import { cn } from "@/utils/cn";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { ReactNode, createContext, useContext, useState } from "react";
import { v4 } from "uuid";

type BasicToast = {
  type: "success" | "error" | "warning";
  message: string;
};
type CustomToast = ReactNode;
type Toast = BasicToast | CustomToast;

const BasicToastComponent = ({ type, message }: BasicToast) => {
  const icon = {
    success: "thumb",
    error: "thumb",
    warning: "tool",
  }[type] as IconType;

  const variantTextClasses: Record<BasicToast["type"], string> = {
    error: "border-brand-status-error bg-brand-status-error-light ",
    success: "border-brand-status-success bg-brand-status-success-light",
    warning: "border-brand-status-warning bg-brand-status-warning-light",
  };
  const variantIconClasses: Record<BasicToast["type"], string> = {
    error: "text-brand-status-error",
    success: "text-brand-status-success",
    warning: "text-brand-status-warning",
  };

  return (
    <div
      key={Math.random()}
      className={cn(
        "flex gap-6 items-center justify-center border border-solid p-6 rounded text-red-500",
        variantTextClasses[type]
      )}
    >
      <div className={cn(type === "error" && "rotate-180")}>
        <Icon icon={icon} className={cn(variantIconClasses[type])} />
      </div>
      <Text variant="p" className="font-semibold text-brand-white">
        {message}
      </Text>
    </div>
  );
};

const isBasicToast = (toast: Toast): toast is BasicToast => {
  return (
    (toast as BasicToast).type !== undefined &&
    (toast as BasicToast).message !== undefined
  );
};

const ToastContext = createContext<{
  addToast: (toast: Toast) => string;
}>({
  addToast: (toast: Toast) => "",
});

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<{ id: string; Component: ReactNode }[]>(
    []
  );

  const addToast = (newToast: Toast) => {
    const id = v4();
    setToasts((prev) => [
      ...prev,
      {
        id,
        Component: isBasicToast(newToast) ? (
          <BasicToastComponent {...newToast} />
        ) : (
          newToast
        ),
      },
    ]);
    return id;
  };

  return (
    <ToastPrimitives.Provider>
      <ToastContext.Provider value={{ addToast }}>
        {toasts.map((toast, i) => (
          <ToastPrimitives.Root
            onOpenChange={(open) => {
              if (!open) {
                // Prevent the toast from being removed from the DOM until the animation has completed.
                setTimeout(() => {
                  setToasts((pt) => pt.filter((t) => t.id !== toast.id));
                }, 100);
              }
            }}
            key={toast.id}
            duration={3000}
            className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
          >
            {toast.Component}
          </ToastPrimitives.Root>
        ))}
        <ToastPrimitives.Viewport className="[--viewport-padding:_25px] fixed bottom-0 z-50 right-0 max-w-md flex flex-col gap-2  p-[var(--viewport-padding)]" />
        {children}
      </ToastContext.Provider>
    </ToastPrimitives.Provider>
  );
};

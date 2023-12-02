import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { PropsWithChildren, ReactNode } from "react";
import { Text } from "./text";
import { Image } from "./image";
import { Skeleton } from "./skeleton";

type TableImage = Parameters<typeof Image>[0];

export const TableImageSkeleton = ({ isDark }: { isDark?: boolean }) => (
  <div className="min-w-[40px] w-[40px] relative rounded overflow-hidden aspect-square">
    <Skeleton type="image" className="w-full h-full" />
  </div>
);
export const TableImage = (props: TableImage) => (
  <div className="min-w-[40px] w-[40px] relative rounded overflow-hidden aspect-square">
    <Image {...props} />
  </div>
);

type TableCellProps = PropsWithChildren<{
  isCentered?: boolean;
  className?: ClassValue;
  widthPercent?: number;
}>;
export const TableCell = ({
  isCentered,
  className,
  children,
}: TableCellProps) => (
  <div className={cn(isCentered && "text-center", className)}>{children}</div>
);

type TableRowProps = PropsWithChildren<{
  isDark?: boolean;
  className?: ClassValue;
}>;

export const TableRow = ({ children, isDark, className }: TableRowProps) => (
  <div
    className={cn(
      "flex py-4 px-4 md:px-12 items-center justify-between",
      isDark && "bg-brand-navy-dark",
      className
    )}
  >
    {children}
  </div>
);

type TableContainerProps = PropsWithChildren<{
  title: string | ReactNode;
  Right?: ReactNode;
}>;

export const TableContainer = ({
  children,
  title,
  Right,
}: TableContainerProps) => (
  <div className="overflow-hidden rounded shadow-md bg-brand-navy-light">
    <div>
      <TableRow className="my-4">
        {typeof title === "string" ? (
          <Text className="font-semibold text-brand-white text-md">
            {title}
          </Text>
        ) : (
          title
        )}
        {Right}
      </TableRow>
    </div>
    <div>{children}</div>
  </div>
);

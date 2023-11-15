import { ClassValue } from "clsx";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/utils/cn";

type ImageProps = {
  className?: ClassValue;
  imageClassName?: ClassValue;
  src: string;
} & Omit<Parameters<typeof NextImage>, "width" | "height" | "src">[0];

export const Image = ({
  className,
  src,
  imageClassName,
  ...rest
}: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      {!isLoaded && <Skeleton className="w-full h-full" type="image" />}
      <NextImage
        key={src}
        src={src}
        fill={true}
        onLoadingComplete={() => setIsLoaded(true)}
        className={cn("object-cover object-center transition", imageClassName)}
        {...rest}
      />
    </div>
  );
};

import { useMemo } from "react";
import { Heading } from "./heading";
import { Text } from "./text";
import { FaSearch } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";
import { cn } from "@/utils/cn";
import { useRouter } from "next/router";

type ErrorPageProps = {
  type: "notFound" | "somethingWentWrong";
};

export const ErrorPage = ({ type }: ErrorPageProps) => {
  const router = useRouter();
  const Icon = useMemo(
    () => (type === "notFound" ? FaQuestion : FaExclamationCircle),
    [type]
  );

  return (
    <div>
      <div className="flex flex-col justify-around h-full gap-20 md:items-center md:flex-row">
        <div>
          <Heading variant="h3">
            {type === "notFound"
              ? "GGWP! Sorry, we couldn't find what you're looking for!"
              : "Something wen't wrong"}
          </Heading>
          <Text className="mb-4">
            {type === "notFound"
              ? "If this error continues please let us know at support@gamerly.app"
              : "Something went wrong. If this error continues please let us know at support@gamerly.app"}
          </Text>
          <Text
            onClick={() => {
              if (type === "somethingWentWrong") {
                const onErrorPage =
                  router.asPath === "/500" || router.asPath === "/404";

                if (onErrorPage) {
                  router.replace("/");
                } else {
                  router.reload();
                }
              }
            }}
            className={cn(
              type === "somethingWentWrong" &&
                "underline underline-offset-2 cursor-pointer"
            )}
          >
            {type === "notFound"
              ? "Find the thing you're looking for with the sidebar or search!"
              : "Try refreshing the page"}
          </Text>
        </div>
        <div className="flex items-center justify-center w-48 rounded aspect-square bg-brand-navy-light">
          <Icon className="w-28 h-28 fill-brand-white" />
        </div>
      </div>
    </div>
  );
};

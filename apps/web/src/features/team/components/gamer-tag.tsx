import { Text } from "@/components/text";
import { CopyIcon } from "@radix-ui/react-icons";

export const GamerTag = ({ tag }: { tag: string }) => (
  <div className="inline-flex items-center gap-2 cursor-pointer text-brand-gray">
    <Text>{tag}</Text>
    <CopyIcon width={14} />
  </div>
);

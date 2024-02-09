import { Button } from "@/components/button";

export const PlusIconButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="secondary"
    className="bg-brand-navy-light-accent-light py-0.5 px-1 border-brand-navy-light-accent-light"
    onClick={onClick}
    icon={"round-plus"}
    iconSize={18}
  />
);

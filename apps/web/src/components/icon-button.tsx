import { Button } from "./button";
import { IconType } from "./icon";

type IconButtonProps = {
  icon: IconType;
  onClick?: () => void;
};
export const IconButton = ({ icon, onClick }: IconButtonProps) => (
  <Button
    variant="secondary"
    className="bg-brand-navy-light-accent-light py-0.5 px-1 border-brand-navy-light-accent-light"
    iconSize={20}
    icon={icon}
    onClick={onClick}
  />
);

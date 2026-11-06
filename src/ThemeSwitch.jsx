import { Switch } from "@heroui/react";
import { Moon, Sun } from "./icons";
export default function ThemeSwitch({ dark, setDark }) {
  return (
    <Switch size="sm" color="default" isSelected={dark} onValueChange={setDark} aria-label="Toggle dark mode"
      thumbIcon={({ isSelected, className }) => isSelected ? <Moon className={className} /> : <Sun className={className} />} />
  );
}

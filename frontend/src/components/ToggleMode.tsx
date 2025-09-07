import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/themeSlice";

interface ToggleModeProps {
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const ToggleMode: React.FC<ToggleModeProps> = ({
  variant = "ghost",
  size = "sm",
  showLabel = false,
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const getThemeIcon = () => {
    return theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;
  };

  const getThemeLabel = () => {
    return theme === 'light' ? 'Dark' : 'Light';
  };

  return (
    <Button
      onClick={handleToggle}
      variant={variant}
      size={size}
      className={`gap-2 hover:bg-accent transition-colors ${className}`}
    >
      {getThemeIcon()}
      {showLabel && <span>{getThemeLabel()}</span>}
    </Button>
  );
};
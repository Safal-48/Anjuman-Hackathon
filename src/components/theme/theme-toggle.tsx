"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="glass" size="icon" className="h-9 w-9 opacity-70" aria-label="Toggle theme">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = theme === "dark" || theme === "system";

  return (
    <Button
      variant="glass"
      size="icon"
      className="h-9 w-9 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-cyan-500 transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  );
}

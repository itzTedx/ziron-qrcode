"use client";

import { useTheme } from "next-themes";

export const Providers = ({ isDarkMode }: { isDarkMode?: boolean }) => {
  const { setTheme } = useTheme();

  setTheme(isDarkMode ? "dark" : "light");

  return null;
};

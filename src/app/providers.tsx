"use client";

import React from "react";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";

function NextUiProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute={"class"}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </ThemeProvider>
  );
}

export { NextUiProviderWrapper };

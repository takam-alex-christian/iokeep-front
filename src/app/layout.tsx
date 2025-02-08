import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { NextUiProviderWrapper } from "./providers";

// const inter = Inter({ subsets: ["latin"] });
const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Iokeepv3",
  description: " A note taking web application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppinsFont.className}`}>
        <NextUiProviderWrapper>{children}</NextUiProviderWrapper>
      </body>
    </html>
  );
}

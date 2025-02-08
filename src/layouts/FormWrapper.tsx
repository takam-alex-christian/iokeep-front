import React from "react";
import Image from "next/image";

import Logo from "@/assets/logo.svg";

//this component wraps any form
export default function FormWrapper({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-2 text-center">
        <div className="flex flex-col items-center">
          <Image width={128} alt="iokeep v2 logo" src={Logo} />
        </div>
        <h2 className="text-xl">{label}</h2>
      </div>

      {children}
    </div>
  );
}

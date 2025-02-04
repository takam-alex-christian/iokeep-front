
"use client"

import React from "react"

import { HeroUIProvider } from "@heroui/react";

function NextUiProviderWrapper({children}: {children: React.ReactNode}){
    return (
        <HeroUIProvider>
            {children}
        </HeroUIProvider>
    )
}

export {NextUiProviderWrapper}
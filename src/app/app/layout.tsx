"use client";

import React, { useReducer } from "react";

import { initialLiveData, liveDataContext } from "@/contexts/liveDataContext";

import liveDataReducer from "@/lib/liveDataReducer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [liveAppData, liveAppDataDispatch] = useReducer(
    liveDataReducer,
    initialLiveData
  );

  return (
    <liveDataContext.Provider value={{ liveAppData, liveAppDataDispatch }}>
      {children}
    </liveDataContext.Provider>
  );
}

"use client";

import React, { useReducer, useRef, useEffect } from "react";

import { initialLiveData, liveDataContext } from "@/contexts/liveDataContext";

import liveDataReducer from "@/lib/liveDataReducer";

import { LiveDataDispatchAction, LiveDataState } from "@/types";

export default function ({ children }: { children: React.ReactNode }) {
  const [liveAppData, liveAppDataDispatch] = useReducer<
    React.Reducer<LiveDataState, LiveDataDispatchAction>
  >(liveDataReducer, initialLiveData);

  useEffect(() => {
    let selectedTheme = window.localStorage.getItem("iokeepSelectedTheme");

    if (selectedTheme) document.body.classList.add(selectedTheme);
  }, []);

  return (
    <liveDataContext.Provider value={{ liveAppData, liveAppDataDispatch }}>
      {children}
    </liveDataContext.Provider>
  );
}

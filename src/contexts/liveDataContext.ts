import { createContext, Dispatch } from "react";

import type { LiveDataState, LiveDataDispatchAction } from "@/types";

const initialLiveData: LiveDataState = {
  selectedFolderId: null,
  selectedNoteId: null,
  noteOrder: "lmd",
};

const liveDataContext = createContext<{
  liveAppData: LiveDataState;
  liveAppDataDispatch: Dispatch<LiveDataDispatchAction>;
}>({
  liveAppData: initialLiveData,
  liveAppDataDispatch: () => {},
});

export { liveDataContext, initialLiveData };

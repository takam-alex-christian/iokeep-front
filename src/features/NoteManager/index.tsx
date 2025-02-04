"use client";

import { useFolders } from "@/lib/folderUtils";

import { Skeleton } from "@heroui/react";

import NoteToolBar from "./components/NoteToolBar";

import NotesContainer from "./components/NotesContainer";
import { useContext } from "react";
import { liveDataContext } from "@/contexts/liveDataContext";
import { useNotes } from "@/lib/noteUtils";

export default function NoteManager() {
  // some app contex will tell what folder is selected
  // let's assume these notes are from the currently selected folder

  return (
    <div className="flex flex-col h-full gap-2 p-4 bg-white rounded-3xl">
      <NoteToolBar />
      <NotesContainer />
    </div>
  );
}

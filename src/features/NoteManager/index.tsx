"use client";

import { useFolders } from "@/lib/folderUtils";

import { Divider, Skeleton } from "@heroui/react";

import NoteToolBar from "./components/NoteToolBar";

import NotesContainer from "./components/NotesContainer";

export default function NoteManager() {
  // some app contex will tell what folder is selected
  // let's assume these notes are from the currently selected folder

  return (
    <div className="custom-container flex flex-col h-full gap-0 py-0 rounded-3xl">
      <NoteToolBar />
      <Divider className="bg-default-100" />
      <NotesContainer />
    </div>
  );
}

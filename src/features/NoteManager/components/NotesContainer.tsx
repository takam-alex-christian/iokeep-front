"use client";

import { Divider, ScrollShadow } from "@heroui/react";

import { liveDataContext } from "@/contexts/liveDataContext";
import { useFolders } from "@/lib/folderUtils";
import { useNotes } from "@/lib/noteUtils";
import { useContext, useEffect } from "react";

import NoteItem from "./NoteItem";
import NoteSkeleton from "./NoteSkeleton";

export default function NotesContainer() {
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const { isLoading: areFoldersLoading } = useFolders();
  const { notesData, isLoading: areNotesLoading, error } = useNotes(); //because this componenet renders its content only when folders are done loading

  useEffect(() => {
    if (
      liveAppData.selectedNoteId != null &&
      liveAppData.selectedFolderId !=
        window.localStorage.getItem("persistedNoteId")
    ) {
      window.localStorage.setItem(
        "persistedNoteId",
        liveAppData.selectedNoteId ? liveAppData.selectedNoteId : ""
      );
      if (!areNotesLoading && notesData) {
        const selectedNote = notesData.find((eachNote) => {
          return eachNote._id == liveAppData.selectedNoteId;
        });
        if (selectedNote)
          window.localStorage.setItem(
            "persistedFolderId",
            selectedNote.folderId
          );
      }
    } else {
      liveAppDataDispatch({
        type: "changedSelectedNote",
        payload: {
          noteId: window.localStorage.getItem("persistedNoteId")!,
        },
      });
    }
  }, [liveAppData.selectedNoteId]);

  // useEffect(() => {
  //   let persistedNoteId = window.localStorage.getItem("persistedNoteId");

  //   if (notesData && notesData.length > 0)
  //     liveAppDataDispatch({
  //       type: "changedSelectedNote",
  //       payload: {
  //         noteId: persistedNoteId ? persistedNoteId : notesData[0]._id,
  //       },
  //     });
  // }, []);

  return (
    // <></>
    <ScrollShadow className="h-full">
      <div className="py-4 px-4 flex flex-col h-full  gap-1 ">
        {!areNotesLoading &&
          !areFoldersLoading &&
          notesData &&
          notesData?.map((eachNote, i) => {
            return (
              <div key={eachNote._id}>
                <NoteItem key={eachNote._id} {...eachNote} />
                {notesData.length - 1 != i && (
                  <div className="px-3">
                    <Divider
                      className="bg-primary-100/50"
                      orientation="horizontal"
                    />
                  </div>
                )}
              </div>
            );
          })}
        {/* when folder is empty */}
        {!areNotesLoading &&
          !areFoldersLoading &&
          notesData &&
          notesData.length == 0 && (
            <div className=" flex flex-col gap-2 rounded-2xl  h-full w-full justify-center items-center px-6 text-center">
              <h3 className="font-bold">This Folder is empty</h3>
              <p className="text-default-500 text-sm">Take some notes </p>
            </div>
          )}
        {(areFoldersLoading || areNotesLoading) && (
          <div className="flex flex-col gap-2">
            <NoteSkeleton key={0} />
            <NoteSkeleton key={1} />
            <NoteSkeleton key={2} />
          </div>
        )}
      </div>
    </ScrollShadow>
  );
}

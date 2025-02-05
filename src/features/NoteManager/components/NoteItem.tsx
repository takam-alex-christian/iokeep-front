"use client";

import { useContext } from "react";
import { Button } from "@heroui/react";
import { liveDataContext } from "@/contexts/liveDataContext";
import { NoteItemDataType } from "@/types";

export default function NoteItem(props: NoteItemDataType) {
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const noteCreationDate = new Date(props.creationDate);
  const noteLastModifiedDate = new Date(props.lastModifiedDate);

  const isNoteSelected: boolean = liveAppData.selectedNoteId == props._id;

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  function notePressHandler() {
    liveAppDataDispatch({
      type: "changedSelectedNote",
      payload: { noteId: props._id },
    });
  }

  return (
    <Button
      onPress={notePressHandler}
      key={props._id}
      className={`flex flex-row justify-start text-left h-fit px-0 w-full ${
        liveAppData.selectedNoteId == props._id
          ? "bg-primary-50 text-primary-800"
          : "bg-transparent text-primary-800/80"
      }`}
    >
      <div className="flex flex-col gap-0 p-3 rounded-lg w-full ">
        <div className="text-xl py-0  overflow-hidden overflow-ellipsis">
          {props.description.length > 0
            ? props.description[0]
            : "Note is empty!"}
        </div>

        <div className="flex flex-col gap-3 ">
          {/* {peak first p after heading} */}
          <p className="text-base overflow-hidden font-medium overflow-ellipsis flex-grow">
            {props.description.length >= 2
              ? props.description[1]
              : "Start writing."}
          </p>
          {/* date p */}
          <div className={` text-primary-800/70 text-xs flex flex-col gap-1`}>
            {/* {noteCreationDate.getDate()} {noteCreationDate.getMonth()}{" "}
            {noteCreationDate.getFullYear()} */}
            <div>
              <span className="font-semibold">Created </span>
              {dateFormatter.format(noteCreationDate)}
            </div>
            <div>
              <span className="font-semibold">Last modified </span>
              {dateFormatter.format(noteLastModifiedDate)}
            </div>
          </div>
        </div>
      </div>
    </Button>
  );
}

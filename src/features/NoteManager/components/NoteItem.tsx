"use client";

import { useContext } from "react";
import { Button } from "@nextui-org/react";
import { liveDataContext } from "@/contexts/liveDataContext";
import { NoteItemDataType } from "@/types";

export default function NoteItem(props: NoteItemDataType) {
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const noteCreationDate = new Date(props.creationDate);
  const noteLastModifiedDate = new Date(props.lastModifiedDate);

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
      className={`flex flex-row justify-start text-left h-fit px-0 py-2 w-full ${
        liveAppData.selectedNoteId == props._id
          ? "bg-default/45"
          : "bg-transparent"
      }`}
    >
      <div className="flex flex-col gap-0 p-3 rounded-lg bg-none w-full ">
        <div className="text-base py-0 font-semibold text-default-600 overflow-hidden overflow-ellipsis">
          {props.description.length > 0
            ? props.description[0]
            : "no description"}
        </div>

        <div className="flex flex-col gap-1 ">
          {/* {peak first p after heading} */}
          <p className="overflow-hidden overflow-ellipsis flex-grow text-default-400">
            {props.description.length >= 2 ? props.description[1] : ""}
          </p>
          {/* date p */}
          <p className="text-sm text-default-400 flex flex-col gap-1">
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
          </p>
        </div>
      </div>
    </Button>
  );
}

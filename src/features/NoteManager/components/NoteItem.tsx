"use client";

import React, { useContext, useState, useRef, ReactElement } from "react";
import { Button } from "@heroui/react";
import { liveDataContext } from "@/contexts/liveDataContext";
import { NoteItemDataType } from "@/types";
import DragDropVerticalIcon from "@/assets/drag-drop-vertical-stroke-rounded";

export default function NoteItem(props: NoteItemDataType) {
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const [noteItemInternalState, setNoteItemInternalState] = useState<{
    isDraggable: boolean;
  }>({
    isDraggable: false,
  });

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

  function onDragIndicatorMouseEnter() {
    //make note draggable
    setNoteItemInternalState((prevState) => {
      return { ...prevState, isDraggable: true };
    });
  }

  function onDragIndicatorMouseLeave() {
    setNoteItemInternalState((prevState) => {
      return { ...prevState, isDraggable: false };
    });
  }

  function onNoteDragStart(e: React.DragEvent) {
    const dragImage = document.createElement("div");
    dragImage.className =
      "fixed top-[10000px] left-[10000px]  w-fit bg-background rounded-xl p-2 max-w-[200px]";

    const pEl = document.createElement("p");
    pEl.innerText = props.description[0] ? props.description[0] : "This Note";
    pEl.className = "text-ellipsis whitespace-nowrap overflow-hidden";

    dragImage.appendChild(pEl);

    document.body.appendChild(dragImage);

    e.dataTransfer.setData("text/plain", props._id);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  }

  return (
    <div
      className="relative group flex items-center rounded-xl  "
      draggable={noteItemInternalState.isDraggable}
      onDragStart={onNoteDragStart}
    >
      <div
        className="absolute opacity-0 group-hover:opacity-100 -left-5 transition-all"
        role="button"
        onMouseEnter={onDragIndicatorMouseEnter}
        onMouseLeave={onDragIndicatorMouseLeave}
      >
        <DragDropVerticalIcon />
      </div>
      <Button
        // ref={noteRef}

        onPress={notePressHandler}
        key={props._id}
        className={`flex flex-row justify-start text-left h-fit px-0 w-full group-hover:bg-primary-50 ${
          isNoteSelected
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
    </div>
  );
}

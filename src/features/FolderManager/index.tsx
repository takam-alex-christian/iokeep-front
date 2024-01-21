"use client"

import { useState, useReducer } from "react"

import { Accordion, AccordionItem } from "@nextui-org/react";

import FolderItem from "./components/FolderItem";

import { FolderManagerReducerActionType, FolderManagerStateType } from "./types"

import folderTestData from "@/data/test/folders.json"
import FolderInput from "./components/FolderInput";


function folderManagerReducer(prevState: FolderManagerStateType, action: FolderManagerReducerActionType): FolderManagerStateType {
    switch (action.type) {
        case "changedSelectedFolder": return { ...prevState, selectedFolderId: action.payload.folderId }
        default: return prevState
    }

}

export default function () {

    const [folderManagerState, folderManagerDispatch] = useReducer(folderManagerReducer, { selectedFolderId: folderTestData[0].folderId })


    return (
        <div className="p-4">
            <Accordion defaultExpandedKeys={["0"]}>
                <AccordionItem key={0} isCompact={false} title={"Folders"}>
                    <ul className="flex flex-col gap-0">
                        {folderTestData.map((eachFolder, i) => {
                            return (
                                <li key={i}>
                                    <FolderItem
                                        key={i}
                                        folderManagerDispatch={folderManagerDispatch}
                                        folderId={eachFolder.folderId}
                                        name={eachFolder.name}
                                        isSelected={folderManagerState.selectedFolderId == eachFolder.folderId}
                                    />
                                </li>
                            )
                        })}

                    </ul>
                    <div>
                        <FolderInput />
                    </div>
                </AccordionItem>
            </Accordion>

            {/* list folders */}
            {/* toggled visibity folder creation form */}
        </div>
    )
}
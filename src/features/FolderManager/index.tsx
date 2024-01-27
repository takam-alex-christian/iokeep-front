"use client"

import { useState, useReducer } from "react"

import { Accordion, AccordionItem, Button } from "@nextui-org/react";

import { AnimatePresence, motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import FolderItem from "./components/FolderItem";

import { FolderManagerReducerActionType, FolderManagerStateType } from "./types"

import folderTestData from "@/data/test/folders.json"
import FolderInput from "./components/FolderInput";


function folderManagerReducer(prevState: FolderManagerStateType, action: FolderManagerReducerActionType): FolderManagerStateType {
    switch (action.type) {
        case "changedSelectedFolder": return { ...prevState, selectedFolderId: action.payload.folderId }
        case "toggledFolderInput": return { ...prevState, showFolderInput: !prevState.showFolderInput }
        default: return prevState
    }

}

export default function () {

    const [folderManagerState, folderManagerDispatch] = useReducer(folderManagerReducer, { selectedFolderId: folderTestData[0].folderId, showFolderInput: false })

    function toggleFolderInputHandler() {
        folderManagerDispatch({ type: "toggledFolderInput" })
    }

    return (
        <div className="px-4 py-0">
            <Accordion defaultExpandedKeys={["0"]}>
                <AccordionItem
                    // classNames={{ title: "" }}
                    key={0} isCompact={false} title={"Folders"}>
                    <div className="flex flex-col gap-2">
                        <div>
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

                            <AnimatePresence>
                                {folderManagerState.showFolderInput &&
                                    <motion.div
                                        initial={{ opacity: 0, y: -40, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 40 }}
                                        exit={{ opacity: 0, y: -40, height: 0 }}
                                    >
                                        <FolderInput />
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>

                        <div>
                            <Button
                                onPress={toggleFolderInputHandler} //toggle folder input component
                                color={"success"}
                                startContent={<FontAwesomeIcon icon={faPlus} />}

                            >New Folder</Button>
                        </div>
                    </div>
                </AccordionItem>
            </Accordion>

            {/* list folders */}
            {/* toggled visibity folder creation form */}
        </div>
    )
}
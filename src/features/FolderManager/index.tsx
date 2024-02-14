"use client"

import { useReducer, useContext, useEffect} from "react"

import { Accordion, AccordionItem, Button } from "@nextui-org/react";

import { AnimatePresence, motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import FolderItem from "./components/FolderItem";

import { FolderManagerReducerActionType, FolderManagerStateType, FolderItemType } from "./types"

import folderTestData from "@/data/test/folders.json"
import FolderInput from "./components/FolderInput";

import {liveDataContext} from "@/contexts/liveDataContext"
import { useFolders } from "@/lib/folderUtils";


function folderManagerReducer(prevState: FolderManagerStateType, action: FolderManagerReducerActionType): FolderManagerStateType {
    switch (action.type) {
        case "folderItemsInitialized": {return {...prevState, folderItems: action.payload.folderItems}}
        // case "changedSelectedFolder": return { ...prevState, selectedFolderId: action.payload.folderId }
        case "toggledFolderInput": return { ...prevState, showFolderInput: !prevState.showFolderInput }
        default: return prevState
    }

}

async function loadTestData(){
    return folderTestData
}

export default function () {

    const {liveAppData, liveAppDataDispatch} = useContext(liveDataContext)

    const [folderManagerState, folderManagerDispatch] = useReducer(folderManagerReducer, {showFolderInput: false, folderItems: []})

    const {folderData, isLoading} = useFolders()

    function toggleFolderInputHandler() {
        folderManagerDispatch({ type: "toggledFolderInput" })
    }

    useEffect(()=>{
        //initilize selectedFolder once folder data is loaded
        loadTestData().then((loadedFolderData: FolderItemType[])=>{
            // initialize the folder items
            folderManagerDispatch({type: "folderItemsInitialized", payload: {folderItems: loadedFolderData}})
            
            liveAppDataDispatch({type: "changedSelectedFolder", payload: {folderId: loadedFolderData.length > 0 ? loadedFolderData[0].folderId : ""}})
        }, (e)=>{
            console.log(e)
        })
        
    }, [])

    

    return (
        <div className="px-4 py-0">
            <Accordion defaultExpandedKeys={["0"]}>
                <AccordionItem
                    // classNames={{ title: "" }}
                    key={0} isCompact={false} title={"Folders"}>
                    <div className="flex flex-col gap-2">
                        <div>
                            {/* display loading component here when isLoading */}

                            {!isLoading && <ul className="flex flex-col gap-0">
                                {folderData.map((eachFolder, i) => {
                                    return (
                                        <li key={i}>
                                            <FolderItem
                                                key={i}
                                                folderManagerDispatch={folderManagerDispatch}
                                                folderId={eachFolder._id}
                                                name={eachFolder.folderName}
                                            />
                                        </li>
                                    )
                                })}

                            </ul>}

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
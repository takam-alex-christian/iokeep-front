import {motion, AnimatePresence} from "motion/react"


import { HugeiconsIcon } from "@hugeicons/react";
import {CloudUploadIcon, CloudSavingDone01Icon, CloudIcon} from "@hugeicons/core-free-icons"

//type imports
import { CustomNoteEditorContext } from "../libs/customEditorContext";
import { useContext } from "react";


function SyncIndicator(props: {isSyncing: boolean}){
    return (
        <motion.div
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -40}}
            transition={{duration: 0.3}}
        >
            <div className="flex flex-row gap-2 items-center">
                <span><HugeiconsIcon  icon={props.isSyncing ? CloudUploadIcon : CloudSavingDone01Icon} /></span>
                <span className={`font-normal text-sm ${props.isSyncing ? "text-gray-800" : "text-gray-500"}`}>{props.isSyncing ? "Syncing..." : "Synced"}</span>
            </div>

        </motion.div>
    )
}
//status bar displays the status of the note and other informative messages
function StatusBar() {

    const {customNoteEditorState} = useContext(CustomNoteEditorContext)

    return (
        <AnimatePresence>
        <div className="flex flex-row gap-2 py-1 px-2 bg-gray-50 rounded-md">
            
            <div className="overflow-hidden">
                {/*  */}
                {customNoteEditorState.isSyncing && 
                    <SyncIndicator key="syncing" isSyncing={customNoteEditorState.isSyncing} />
                }
                {!customNoteEditorState.isSyncing && 
                    <SyncIndicator key="synced" isSyncing={customNoteEditorState.isSyncing} />
                }
            </div>
            
        </div>
        </AnimatePresence>
    )
}

export default StatusBar;
import {motion, AnimatePresence} from "motion/react"


import { HugeiconsIcon } from "@hugeicons/react";
import {CloudUploadIcon, CloudSavingDone01Icon, CloudIcon} from "@hugeicons/core-free-icons"

//type imports
import { CustomNoteEditorContext } from "../libs/customEditorContext";
import { useContext } from "react";


//status bar displays the status of the note and other informative messages
function StatusBar() {

    const {customNoteEditorState} = useContext(CustomNoteEditorContext)

    return (
        <div className="flex flex-row gap-2">
            <div className="overflow-hidden">
                {customNoteEditorState.isSyncing && 
                    <motion.div>Saving...</motion.div>
                }
                {!customNoteEditorState.isSyncing && 
                    <motion.div>Synced</motion.div>
                }
            </div>
        </div>
    )
}

export default StatusBar;
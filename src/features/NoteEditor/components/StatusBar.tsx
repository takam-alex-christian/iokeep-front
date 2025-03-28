import {motion, AnimatePresence} from "motion/react"


import { HugeiconsIcon } from "@hugeicons/react";
import {CloudUploadIcon, CloudSavingDone01Icon, CloudIcon} from "@hugeicons/core-free-icons"

//type imports
import { NoteSyncState } from "../libs/types";
import { CustomNoteEditorContext } from "../libs/customEditorContext";
import { useContext } from "react";

type SavingStatusProps = {
    syncState: NoteSyncState
}

function SavingStatus(props: SavingStatusProps) {

    return (
        <div className="flex flex-row gap-2">
            <AnimatePresence>
                {
                    props.syncState === "syncing" && (
                        <motion.div
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}

                        >
                            <div><HugeiconsIcon icon={CloudUploadIcon} /></div>
                            <p>Sync in progress...</p>

                        </motion.div>
                    )
                }

                {
                    props.syncState === "synced" && (
                        <motion.div
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}
                        >
                            <div><HugeiconsIcon icon={CloudSavingDone01Icon} /></div>
                            <p>Sync completed!</p>
                        </motion.div>
                    )
                }

                {
                    props.syncState === "idle" && (
                        <motion.div>
                            <div><HugeiconsIcon icon={CloudIcon} /></div>
                            <p>All good!</p>
                        </motion.div>
                    )
                }
                
            </AnimatePresence>
            
        </div>
    )
}

//status bar displays the status of the note and other informative messages
function StatusBar() {

    const {customNoteEditorState} = useContext(CustomNoteEditorContext)

    return (
        <div className="flex flex-row gap-2">
            <div className="overflow-hidden">
                <SavingStatus syncState={customNoteEditorState.syncState} />
            </div>
        </div>
    )
}

export default StatusBar;
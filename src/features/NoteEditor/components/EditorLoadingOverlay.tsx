"use client"

import {CircularProgress} from "@heroui/react"
import {AnimatePresence, motion} from "motion/react"

export default function EditorLoadingOverlay(props: {
    isLoading: boolean
}) {

    return (
        <AnimatePresence>
            {props.isLoading &&
                <motion.div
                    key={"editorLoadingOverlay"}
                    className={"absolute z-50 w-full h-full bg-[#ffffff88] rounded-3xl"}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <div
                        className={"flex flex-col w-full h-full items-center justify-center p-2 rounded-2xl bg-[rgba(255,255,255, 0.6)]"}>
                        <div className={"flex flex-row gap-2 w-fit items-center justify-center"}>
                            <CircularProgress/>
                            Loading...
                        </div>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    )
}
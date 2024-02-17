"use client"

import { Divider, Skeleton } from "@nextui-org/react"

import { liveDataContext } from "@/contexts/liveDataContext"
import { useFolders } from "@/lib/folderUtils"
import { useNotes } from "@/lib/noteUtils"
import { useContext, useEffect } from "react"

import NoteItem from "./NoteItem"


export default function () {

    const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext)

    const { isLoading: areFoldersLoading } = useFolders()
    const { notesData, isLoading: areNotesLoading, error } = useNotes() //because this componenet renders its content only when folders are done loading

    useEffect(() => {
        if (!areNotesLoading && notesData && notesData.length > 0) {
            liveAppDataDispatch({ type: "changedSelectedNote", payload: { noteId: notesData[0]._id } })
        }else liveAppDataDispatch({type: "changedSelectedNote", payload: {noteId: ""}})
    }, [liveAppData.selectedFolderId, areNotesLoading])

    return (
        <div className="py-2 flex flex-col gap-0">
            {!areNotesLoading && !areFoldersLoading && notesData && notesData?.map((eachNote, i) => {
                return (
                    <div key={eachNote._id}>
                        <NoteItem key={eachNote._id} {...eachNote} />
                        {notesData.length - 1 != i && <div className="px-3"><Divider className="bg-default/40" orientation="horizontal" /></div>}

                    </div>
                )
            })}
            {
                (areFoldersLoading || areNotesLoading) && <div className="f">
                    loading
                </div>
            }
        </div>
        // <></>
    )
}
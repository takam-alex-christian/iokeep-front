"use client"

import { useFolders } from "@/lib/folderUtils"
import NoteToolBar from "./components/NoteToolBar"

import NotesContainer from "./components/NotesContainer"
import { useContext } from "react"
import { liveDataContext } from "@/contexts/liveDataContext"



export default function NoteManager() {

    // some app contex will tell what folder is selected
    // let's assume these notes are from the currently selected folder

    const {liveAppData} = useContext(liveDataContext)
    const {isLoading: areFoldersLoading, folderData} = useFolders()
    
    return (
        <div className="flex flex-col gap-2 p-2">
            <NoteToolBar />

            {liveAppData.selectedFolderId && !areFoldersLoading ? <NotesContainer /> : <div>Loading Folders</div>}
            

        </div>

    )
}
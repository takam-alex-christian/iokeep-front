


import useSWR from "swr"
import { FolderDataType } from "@/types"

//@ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

async function createFolder(folderName: string){

    //refer to CreateFolderJsonResponse type definition in be folderManagerFeature 
    //jsonResponse: CreateFolderJsonResponse

    const cfHeaders = new Headers()

    cfHeaders.append('Content-Type', 'application/json')

    const cfBody = JSON.stringify({folderName})

    const jsonResponse: {success: boolean, error: null | {message: string}, timeStamp: number} = await fetch('be/folders', {
        method: "POST",
        headers: cfHeaders,
        body: cfBody
    }).then((res)=> res.json())

    return jsonResponse

}

function useFolders(){
    
    // refer to jsonResponse type definition for ReadFolderJsonResponse
    
    const {data: jsonResponse, error, isLoading} = useSWR(`be/folders`, fetcher)

    let folderData: Array<FolderDataType> = []
    
    if (!isLoading && !error) folderData = jsonResponse.data
    
    return {
        folderData,
        isLoading
    }
    
}

async function deleteFolder(_id: string){
    
    const dlHeaders = new Headers()

    const jsonResponse: {success: boolean, error: null | {message: string}, timeStamp: number} = await fetch(`be/folders/${_id}`, {
        method: "DELETE",
        headers: dlHeaders
    }).then((res)=> res.json())

    return jsonResponse
}



export {useFolders, createFolder, deleteFolder}
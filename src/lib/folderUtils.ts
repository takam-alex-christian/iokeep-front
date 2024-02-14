


import useSWR from "swr"

//@ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

type FolderDataType = {
    _id: string,
    folderName: string,
    creationDate: string
}

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



export {useFolders, createFolder}



import useSWR from "swr"

//@ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

type FolderDataType = {
    _id: string,
    folderName: string,
    creationDate: string
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

export {useFolders}
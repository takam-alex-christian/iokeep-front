


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
    
    const {data: jsonResponse, error, isLoading} = useSWR(`/be/folders`, fetcher)

    let folderData: Array<FolderDataType> = jsonResponse.data || []

    if (jsonResponse.error) console.log(jsonResponse.error)

    return {
        folderData,
        error,
        isLoading
    }
    
}

export {useFolders}
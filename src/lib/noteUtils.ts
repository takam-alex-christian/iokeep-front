


async function createNote(noteData: {editorState: string, folderId: string}){

    const cnHeaders = new Headers()
    cnHeaders.append("Content-Type", "application/json")

    const cnBody = JSON.stringify(noteData)

    const jsonResponse: {success: boolean,data: {_id: string}, error: null | {message: string}, timeStamp: number} = await fetch(`be/notes`, {
        method: "POST",
        headers: cnHeaders,
        body: cnBody
    }).then((res)=> res.json())

    return jsonResponse
}


export {createNote}
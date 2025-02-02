

type NoteItemType = {
    noteId: string,
    description: string[],
    creationDate: {
        day: number | string, //better be a number
        month: number | string,
        year: number | string,
        hour: number | string,
        minute: number | string,
        second: number | string
    }
}


export type {NoteItemType}
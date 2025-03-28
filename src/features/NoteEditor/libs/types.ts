


/**
 * idle: editor content not changed & no sync in progress
 * syncing: sync in progress
 * synced: sync completed
 */
type NoteSyncState = "idle" | "syncing" | "synced" 

export type {
    NoteSyncState
}
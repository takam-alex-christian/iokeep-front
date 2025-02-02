
import { Skeleton } from "@nextui-org/react"

export default function NoteSkeleton() {

    return (
        <div className="flex flex-col gap-2 bg-default-100  rounded-lg py-6 px-3">
            <Skeleton className="rounded-full"><div className="h-4 w-full"></div></Skeleton>
            <Skeleton className="rounded-full"><div className="h-3 w-full"></div></Skeleton>
            <Skeleton className="rounded-full w-3/5"><div className="h-3 "></div></Skeleton>
        </div>
    )

}
import { Skeleton } from "@nextui-org/react";

export default function FoldersSkeleton() {
  const skelItemsNumber = 4; //numbers of folder skeletons to display could vary later with respect to screen size and platform
  const skeletons: Array<React.ReactElement> = [];

  for (let i = 0; i < skelItemsNumber; i++) {
    skeletons.push(<Skeleton key={i} className="w-full h-9 rounded-xl" />);
  }
  return <div className="flex flex-col h-fit gap-1">{skeletons}</div>;
}

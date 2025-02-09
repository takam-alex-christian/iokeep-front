import NavbarFeature from "@/features/NavbarFeature";
import { ReadOnlyEditor } from "@/features/NoteEditor";
import Footer from "@/layouts/Footer";
import { NoteItemDataType } from "@/types";

import { beUrl } from "@/lib/config";

export default async function NoteReaderPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const noteId = (await params).noteId;

  let noteData: NoteItemDataType | null = null;
  //fetch the note and return it
  await fetch(`${beUrl}/notes/${noteId}`)
    .then((res) => res.json())
    .then((jsonResponse) => {
      if (!jsonResponse.error) {
        noteData = { ...jsonResponse.data };
      }
    });
  return (
    <main className="custom-bg-image flex flex-col gap-6 h-svh overflow-hidden">
      <NavbarFeature />
      <div className="flex flex-col w-full h-full items-center">
        <div className="max-w-screen-lg w-full ">
          <ReadOnlyEditor {...noteData!} isEditable={false} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

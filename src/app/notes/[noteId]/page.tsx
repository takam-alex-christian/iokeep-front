import NavbarFeature from "@/features/NavbarFeature";
import { ReadOnlyEditor } from "@/features/NoteEditor";
import { NoteItemDataType } from "@/types";

export default async function NoteReaderPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const noteId = (await params).noteId;

  let noteData: NoteItemDataType | null = null;
  //fetch the note and return it
  await fetch(`${process.env.BE_URL}/notes/${noteId}`)
    .then((res) => res.json())
    .then((jsonResponse) => {
      if (!jsonResponse.error) {
        noteData = { ...jsonResponse.data };
      }
    });
  return (
    <main className="custom-bg-image flex flex-col gap-6 h-screen overflow-hidden">
      <NavbarFeature />
      <div>
        <ReadOnlyEditor {...noteData!} isEditable={false} />
      </div>
    </main>
  );
}

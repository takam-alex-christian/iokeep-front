import FolderManager from "@/features/FolderManager";
import NoteEditor from "@/features/NoteEditor"
import NoteManager from "@/features/NoteManager";
import Footer from "@/layouts/Footer";
import Navbar from "@/layouts/Navbar";
import { Divider } from "@nextui-org/react";



export default function () {

    return (
        <main className="flex flex-col gap-6 min-h-screen bg-default-100">
            <Navbar />
            <div className="flex-grow flex flex-row justify-center">

                <div className="w-4/5 flex flex-row gap-8">
                    <div className=" w-1/5">
                        <FolderManager />
                    </div>
                    <div className="flex flex-row gap-8 flex-grow">
                        
                        <div className="w-2/5 rounded-xl bg-neutral-50">
                            {/* noteManager */}
                            <NoteManager />
                        </div>
                        {/* <Divider orientation="vertical" /> */}
                        <div className="flex-grow w-3/5 flex flex-col ">
                            <NoteEditor />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
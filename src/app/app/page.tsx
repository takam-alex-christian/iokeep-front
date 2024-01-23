import FolderManager from "@/features/FolderManager";
import NoteEditor from "@/features/NoteEditor"
import Footer from "@/layouts/Footer";
import Navbar from "@/layouts/Navbar";



export default function () {

    return (
        <main className="flex flex-col gap-6 min-h-screen ">
            <Navbar />
            <div className="flex-grow flex flex-row justify-center">

                <div className="w-4/5 flex flex-row gap-8">
                    <div className=" w-1/5">
                        <FolderManager />
                    </div>
                    <div className="flex flex-row gap-2 flex-grow">
                        
                        <div className="w-2/5 bg-red-100">
                            {/* noteManager */}
                            noteManager
                        </div>
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
import FolderManager from "@/features/FolderManager";
import Footer from "@/layouts/Footer";
import Navbar from "@/layouts/Navbar";




export default function () {

    return (
        <main className="flex flex-col gap-6 min-h-screen">
            <Navbar />
            <div className="flex-grow flex flex-row justify-center">

                <div className="w-4/5 flex flex-row gap-8">
                    <div className=" w-1/5">
                        <FolderManager />
                    </div>
                    <div className="bg-slate-50 flex-grow">
                        sdf
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
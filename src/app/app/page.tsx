"use client";

import FolderManager from "@/features/FolderManager";
import NoteEditor from "@/features/NoteEditor";
import NoteManager from "@/features/NoteManager";
import Footer from "@/layouts/Footer";
import NavbarFeature from "@/features/NavbarFeature";

import { getAccessToken } from "@/lib/authUtils";
import { useEffect } from "react";


function getAccessTokenFuction(){
  getAccessToken()
  .then((jsonResponse) => {
    console.log(jsonResponse)
    if (jsonResponse.error) console.log(jsonResponse.error.message);
    else {
      if (!jsonResponse.success) console.log(jsonResponse.info);
    }
    console.log("new auth token received");
  })
  .catch((err) => {
    console.log(err);
  });
}

export default function LandingPage() {
  //verify token and query new token at every interval before token expire
  //access_token lifetime is 10 minutes

  useEffect(() => {
    
    getAccessTokenFuction()

    const gati = setInterval(() => {
      //get access token interval
      getAccessTokenFuction()
    }, 59000); // this time corresponds to the validity period of an access token, ideally should be a few tens of seconds lower than the actual token validity period

    return () => {
      clearInterval(gati);
    };
  }, []);

  return (
    <main className="custom-bg-image flex flex-col gap-6 h-screen overflow-hidden ">
      <NavbarFeature />
      <div className="flex-grow flex flex-row  overflow-hidden justify-center">
        <div className="w-full px-10 grid h-full overflow-hidden  grid-cols-5 gap-8">
          <div className=" col-span-1">
            <FolderManager />
          </div>
          <div className=" col-span-4 grid grid-cols-5 gap-8 h-full overflow-hidden  flex-grow">
            <div className="col-span-2 rounded-xl h-full overflow-hidden">
              {/* noteManager */}
              <NoteManager />
            </div>
            <div className=" relative col-span-3 h-full overflow-hidden  flex-grow flex flex-col ">
              <NoteEditor />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

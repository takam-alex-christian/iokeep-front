"use client";

import FolderManager from "@/features/FolderManager";
import NoteEditor from "@/features/NoteEditor";
import NoteManager from "@/features/NoteManager";
import Footer from "@/layouts/Footer";
import Navbar from "@/features/NavbarFeature";

import { getAccessToken } from "@/lib/authUtils";
import { useEffect } from "react";

export default function () {
  //verify token and query new token at every interval before token expire
  //access_token lifetime is 10 minutes

  useEffect(() => {
    const gati = setInterval(() => {
      //get access token interval
      getAccessToken()
        .then((jsonResponse) => {
          if (jsonResponse.error) console.log(jsonResponse.error.message);
          else {
            if (!jsonResponse.success) console.log(jsonResponse.info);
          }
          console.log("new auth token received");
        })
        .catch((err) => {
          console.log(err);
        });
    }, 59000); // this time corresponds to the validity period of a token, ideally should be a few tens of seconds lower than the actual token validity period

    return () => {
      clearInterval(gati);
    };
  }, []);

  return (
    <main className="flex flex-col gap-6 min-h-screen bg-background">
      <Navbar />
      <div className="flex-grow flex flex-row justify-center">
        <div className="w-4/5 grid grid-cols-5 gap-8">
          <div className=" col-span-1">
            <FolderManager />
          </div>
          <div className=" col-span-4 grid grid-cols-5 gap-8 flex-grow">
            <div className="col-span-2 rounded-xl">
              {/* noteManager */}
              <NoteManager />
            </div>
            <div className="col-span-3 flex-grow flex flex-col ">
              <NoteEditor />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

"use client";

import { logoutRequest } from "@/lib/authUtils";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Button,
} from "@heroui/react";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProfileManager() {
  const router = useRouter();

  const storedUsername = window.localStorage.getItem("username");

  function logoutButtonHandler() {
    logoutRequest().then((jsonResponse) => {
      if (jsonResponse.error) {
        //maybe show a modal to communicate the error with user for improved user experience
        alert(jsonResponse.error.message);
      } else {
        if (jsonResponse.success) {
          window.localStorage.clear(); //clear local storage
          router.replace("/login");
        } else {
          alert(jsonResponse.info);
        }
      }
    });
  }
  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button className="hover:bg-primary-100 hover:text-primary-900 bg-default-200">
            {storedUsername}
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {/* <DropdownItem key={""}></DropdownItem> */}
          <DropdownItem
            key="logout"
            onPress={logoutButtonHandler}
            color="danger"
            variant="flat"
          >
            logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default ProfileManager;

import Link from "next/link";

import iokeeplogo from "../../public/logo.svg";

import Image from "next/image";

export default function PublicNavBar() {
  return (
    <nav className="w-full flex flex-col items-center ">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between items-center w-full max-w-screen-lg py-4">
        <div>
          <Link href={"/"}>
            <div className="flex flex-row gap-0 items-center">
              <Image src={iokeeplogo} width={48} alt="Iokeep logo" />
              <span>
                Iokeep
                <span className="text-primary-800 bg-primary-100 py-1 ml-1 px-2 rounded-full font-semibold">
                  v3 Alpha
                </span>
              </span>
            </div>
          </Link>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <a
            href={"mailto:takamalexchristian@126.com"}
            className="text-lg hover:underline text-primary-600"
          >
            Give a feedback
          </a>
          <Link
            href="/login"
            className="bg-primary-800 dark:bg-primary-500 text-white rounded-full py-2 px-3 hover:rotate-12 transition-transform"
          >
            login
          </Link>
        </div>
      </div>
    </nav>
  );
}

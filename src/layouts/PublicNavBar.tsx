import Link from "next/link";

import iokeeplogo from "../../public/logo.svg";

import Image from "next/image";

function ButtonLink(props: { href: string; children: React.ReactNode }) {
  return (
    <Link
      className="px-2 py-1 bg-primary-500 text-primary-50 rounded-lg"
      href={props.href}
      role="button"
    >
      {props.children}
    </Link>
  );
}

export default function PublicNavBar() {
  return (
    <nav className="w-full flex flex-col items-center ">
      <div className="flex flex-row justify-between items-center w-full max-w-screen-lg py-4">
        <div>
          <Link href={"/"}>
            <div className="flex flex-row gap-0 items-center">
              <Image src={iokeeplogo} width={48} alt="Iokeep logo" />
              <span>
                Iokeep
                <span className="text-primary-800 bg-primary-100 py-1 ml-1 px-2 rounded-full font-semibold">
                  v3
                </span>
              </span>
            </div>
          </Link>
        </div>
        <div className="flex flex-row gap-2">
          <ButtonLink href="/">Github</ButtonLink>
          <ButtonLink href="/login">Login</ButtonLink>
        </div>
      </div>
    </nav>
  );
}

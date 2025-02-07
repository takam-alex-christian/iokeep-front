import PublicNavBar from "@/layouts/PublicNavBar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-svh">
      <PublicNavBar />
      <section>
        <div className="w-full flex flex-col items-center">
          <div className=" flex flex-col gap-4 max-w-screen-lg px-6 text-center">
            <h1 className="text-7xl font-semibold">
              Start taking{" "}
              <span className="font-bold text-primary-600">Notes</span> <br />{" "}
              The smart way
              <span className="text-7xl leading-3 text-primary-500">.</span>
            </h1>
            <p className="px-40">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              dignissim orci ullamcorper tellus ultricies tincidunt vel tempor
              enim. Quisque non nisl id nulla consectetur dignissim nec sit amet
              ligula.
            </p>
            <div className="flex items-center justify-center">
              <Link
                href="/signup"
                className="border-2 border-black rounded-full py-2 px-4"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

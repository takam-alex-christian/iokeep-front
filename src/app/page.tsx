import PublicNavBar from "@/layouts/PublicNavBar";
import Link from "next/link";
import Image from "next/image";

import lighAppImage from "../../public/light-app-image.png";
import Footer from "@/layouts/Footer";
import AiMagicIcon from "@/assets/ai-magic-stroke-rounded";

function AppArticle(props: { title: string; children: React.ReactNode }) {
  return (
    <article>
      <div className="flex flex-col gap-2 p-2">
        <h2 className="text-3xl font-semibold text-primary-600">
          {props.title}
        </h2>
        <div className="flex flex-col gap-4">{props.children}</div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col gap-2 ">
      <PublicNavBar />
      <section className="flex-grow flex flex-col">
        <div className="flex-grow w-full flex flex-col items-center justify-center  h-full">
          <div className=" flex flex-col gap-8 items-center  px-6 my-40 text-center">
            <h1 className="text-3xl md:text-7xl  font-semibold">
              Start taking{" "}
              <span className="font-bold text-primary-600 dark:text-primary-400 drop-shadow-lg">
                Notes
              </span>{" "}
              <br /> <span className="">The smart way</span>
              <span className="text-7xl leading-3 text-primary-500">.</span>
            </h1>
            <p className=" text-xl md:text-2xl">
              {/* A comprehensive web app to boost your note taking process.  */}
              Opensource and Still under{" "}
              <span className="bg-primary-50 rounded-full py-[2px] px-2">
                development.
              </span>{" "}
              <span className="flex flex-row items-center justify-center gap-2">
                <AiMagicIcon />
                Ai and more features coming soon.
              </span>{" "}
            </p>
            <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-center">
              <Link
                href="/signup"
                className="bg-primary-800 dark:bg-primary-500 text-white rounded-full py-3 px-5 hover:rotate-12 transition-transform"
              >
                Get Started
              </Link>
              <Link
                href="/signup"
                className="border-2 border-primary-500 text-primary-500 rounded-full py-2 px-4 hover:rotate-3 transition-transform"
              >
                Participate in the development
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="flex  flex-col  gap-6 items-center justify-center">
          <div className=" w-full max-w-screen-lg rounded-2xl overflow-hidden shadow-2xl">
            <Image src={lighAppImage} width={1024} alt="Iokeep app image" />
          </div>
          <div className="max-w-screen-sm flex flex-col gap-10 py-8">
            <AppArticle title="A digital Notebook">
              <p>
                Physical notebooks are not about to be replaced just yet.
                It&apos;s still a big part of our daily productivity tools. Just
                like me, i&apos;m sure you've used a lot of them over the years.
              </p>
              <p>
                Iokeep is a great alternative which allows you to create
                multiple notebooks or folders within a single account. These
                folder can then be populated with contextual notes by your own
                convenience. A special folder for work specific matters, a
                personal journal to document your periodic activities or even
                just a public notebook to share your ideas ? Iokeep has got you
                covered.
              </p>
            </AppArticle>

            <AppArticle title="Powered by the Cloud">
              <p>
                While a lot of other note taking apps really just store your
                notes locally just like your conventional paper notebook, iokeep
                takes a different approach.
              </p>
              <p>
                iokeep stores all your notes on a remote server. This not only
                allows you to access them across devices but also shields you
                from potential issues with a particular node be it a compromised
                phone or an accidental flush of local data.
              </p>
            </AppArticle>

            <AppArticle title="Multi-Device support">
              <p>
                We&apos;ve all been there. You can take notes on your mac but
                can&apos;t view or edit them on your android ? you can use the
                Samsung notes app on your phone but can&apos;t access it on your
                PC ?{" "}
              </p>
              <p>
                Iokeep is a full stack web app that can be accessible from a
                browser, be it on your phone or your pc irrespective of your
                operating system.
              </p>
            </AppArticle>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

import FileUpload from "@/components/FileUpload";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className=" w-screen min-h-screen bg-gradient-to-r from-blue-100 via-blue-300 to-blue-300">
      <div className="absolute top-1/2 left-1/2 text-black -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-4xl font-semibold">Chat with PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <p className=" max-w-xl mt-1 text-slate-600">
            An interactive AI assistant to chat with any PDF. You can ask any
            questions about the uploaded PDF.
          </p>

          <div className=" w-full mt-4">
            {isAuth ? (
              <FileUpload/>
            ) : (
              <Link href="/sign-in">
                <button className=" bg-violet-950 rounded-md text-white text-sm px-2 py-1 inline-flex items-center">
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Twitter, Instagram } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden min-h-screen">
      <aside className="sm:w-1/3 md:1/4 w-full flex p-4 bg-slate-900 items-center">
        <div className="sticky top-0 p-4 w-full">
          <div className="w-96">
            {children}
            <div className="text-center mt-4">
              <Button variant="link" className="text-blue-400">
                <Link
                  href={"https://forms.gle/3asXLy1aHCoaBKy69"}
                  target="_blank"
                >
                  Help build Ampuverse
                </Link>
                <ExternalLink className="ml-2 w-4" />
              </Button>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <Link
                href={"https://www.instagram.com/glen.padua/"}
                target="_blank"
              >
                <Instagram className="w-8" color="#fff" />
              </Link>
              <Link href={"https://twitter.com/glenp01"} target="_blank">
                <Twitter className="w-8" color="#fff" />
              </Link>
            </div>
          </div>
        </div>
      </aside>
      <main className="w-full min-h-full bg-[url('/images/image_1.png')] bg-cover bg-no-repeat bg-center" />
    </div>
  );
}

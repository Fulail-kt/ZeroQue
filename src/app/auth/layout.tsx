import "~/styles/globals.css";
import {SessionProvider} from "next-auth/react";

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen flex">
        <div className="w-full  flex items-center justify-center">
          <SessionProvider>
            <div className="w-full">
              {children}
            </div>
          </SessionProvider>
        </div>
      </div>
    )
  }

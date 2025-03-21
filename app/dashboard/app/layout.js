import localFont from "next/font/local";
import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { InterfaceNameProvider } from "@/context/InterfaceNameContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "WG Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InterfaceNameProvider>
          <Header />
          <div className="max-w-[1440px] mx-auto h-[calc(100vh_-_56px)] flex">
            <Sidebar />
            <div className="w-full flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
              {children}
              <Toaster position="bottom-left" />
            </div>
          </div>
        </InterfaceNameProvider>
      </body>
    </html>
  );
}

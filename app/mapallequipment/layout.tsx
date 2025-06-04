// equipment/layout.tsx
"use client";
import Nav from "@/components/ui/nav";
import Topbar from "@/components/ui/topbar";
import { SearchProvider } from "@/contexts/SearchContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SearchProvider>
      <div>
        {/* Content top bar */}
        <div className="md:block fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Topbar search={false}/>
        </div>
        {/* Main content area */}
        <div>
          <div className="mx-auto w-full py-18">{children}</div>
        </div>
        {/* Navigation bar */}
        <div className="fixed md:hidden bottom-0 left-0 w-full bg-white shadow-md z-50">
          <Nav />
        </div>
      </div>
    </SearchProvider>
  );
}
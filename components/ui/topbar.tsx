//topbar.tsx
import * as React from "react";
import { Search, Menu, Bell, User } from "lucide-react";
import { useSearch } from '@/contexts/SearchContext'
import { listmenu } from "@/listmenu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Topbar() {
  const { searchValue, setSearchValue } = useSearch()
  const [isFocused, setIsFocused] = React.useState(false)

  const handleSearch = () => {
    console.log("Searching for:", searchValue);
    // Add your search logic here
  };

  interface KeyPressEvent extends React.KeyboardEvent<HTMLInputElement> {}

  const handleKeyPress = (e: KeyPressEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Sheet>
      <SheetContent side="left" className="p-0">
        <SheetHeader>
          <SheetTitle>
          <div className="flex items-center space-x-2">
            <img
              src="/icon-full.png"
              alt="Logo"
              className="w-14 h-14 rounded-full mb-2"
            />
            <h1 className="text-2xl font-bold text-gray-900 font-sans ">NPD Applocation</h1>
          </div>
          <hr></hr>

          </SheetTitle>
          <SheetDescription>
           {
            listmenu.map((item) => (
              <li key={item.id} className="flex text-xl items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => {
                  if (item.path) {
                    window.location.href = item.path; // Navigate to the path
                  } else {
                    console.log("No path defined for this item");
                  }
                }}
              >
                {item.icon}
                <span className="text-gray-800 font-semibold">{item.name}</span>
              </li>
            ))
           }
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center space-x-2">

              <SheetTrigger className="hidden md:flex p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200 backdrop-blur-sm">
                <Menu size={20} className="text-gray-300 hover:text-white" />
              </SheetTrigger>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center">
                <img
                  src="/icon-full.png"
                  alt="Logo"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <h1 className="hidden md:block text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                NPD
              </h1>
            </div>
          </div>

          {/* Center - Search Box */}
        <div className="flex-1 max-w-2xl mx-2 md:mx-8">
          <div className={`relative flex items-center bg-gray-700/30 backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
            isFocused 
              ? 'border-blue-400/50 shadow-lg shadow-blue-500/20 bg-gray-700/40' 
              : 'border-gray-600/30 hover:border-gray-500/50'
          }`}>
            <div className="absolute left-4">
              <Search size={18} className={`transition-colors duration-300 ${
                isFocused ? 'text-blue-400' : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="สิ่งที่ต้องการค้นหา..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full py-3 pl-12 pr-16 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-2 p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <Search size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </Sheet>
  );
}

export default Topbar;

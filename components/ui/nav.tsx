"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { House, Table, Map, LogOut } from "lucide-react";

function nav() {
  const router = useRouter();
  const [type, setType] = React.useState("");
   const handlogout = async () => {
    console.log("Logging out...");
       const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        router.push('/');
      } else {
        console.error('Logout failed');
      }
  }

  const listmenu = [
  {
    id: 1,
    name: "Home",
    icon: <House className="h-6 w-6" />,
    path: "/menu",
  },
  {
    id: 2,
    name: "Categories",
    icon: <Table className="h-6 w-6" />,
    path: "/equipment",
  },
  {
    id: 3,
    name: "Map",
    icon: <Map className="h-6 w-6" />,
    path: "/mapallequipment",
  },
  {
    id: 4,
    name: "Log out",
    icon: <LogOut className="h-6 w-6" />,
    path: "/menu",
  },
];


  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const type = searchParams.get("type");
      setType(type || "");
    }
  }, []);
  return (
    <nav>
      <div className="flex items-center justify-center w-full bg-gray-800">
        <ul className="flex space-x-8 bg-gray-800 p-2 text-white">
          {type === ""
            ? listmenu
                .filter((item) => item.id !== 2 && item.id !== 3)
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 p-2 rounded"
                    onClick={() => {
                      if (item.path) {
                        if (item.name === 'Log out') {
                          handlogout();
                        }else{
                          router.push(item.path + "?type=" + type);
                        }
                        
                      } else {
                        console.log("No path defined for this item");
                      }
                    }}
                  >
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </li>
                ))
            : listmenu.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col items-center justify-center  cursor-pointer hover:bg-gray-700 p-2 rounded"
                  onClick={() => {
                    if (item.path) {
                      router.push(item.path + "?type=" + type);
                    } else {
                      // Handle logout or other actions
                      console.log("Logging out...");
                    }
                  }}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </li>
              ))}
        </ul>
      </div>
    </nav>
  );
}

export default nav;

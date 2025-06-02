'use client'
import * as React from "react";
import { useRouter } from "next/navigation";
import {listmenu} from "@/listmenu"; // Assuming you have a Listmenu component

function nav() {
    const router = useRouter();
  return (
    <nav>
      <div className="flex items-center justify-center w-full bg-gray-800">
        <ul className="flex space-x-8 bg-gray-800 p-2 text-white">
          {listmenu.map((item) => (
            <li
              key={item.id}
              className="flex flex-col items-center justify-center  cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => {
                if (item.path) {
                  router.push(item.path);
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

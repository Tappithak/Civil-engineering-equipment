import { House, Table, Map, LogOut } from "lucide-react";
export const listmenu = [
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
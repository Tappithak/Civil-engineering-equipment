// equipment/page.tsx
"use client";
import * as React from "react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { useSearch } from "@/contexts/SearchContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Equipment() {
  type EquipmentItem = { ID: string | number; Name?: string };
  const [listmenu, setListmenu] = React.useState<EquipmentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState("category"); // 'category' หรือ 'table'
  const { searchValue } = useSearch();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get?dbname=categoryequipments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setListmenu(data);
      console.log("Data fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Filter รายการตาม search value
  const filteredList = React.useMemo(() => {
    if (!searchValue.trim()) {
      return listmenu;
    }

    return listmenu.filter((item) => {
      const name = item["Name"]?.toLowerCase() || "";
      const id = item["ID"]?.toString().toLowerCase() || "";
      const searchTerm = searchValue.toLowerCase();

      return name.includes(searchTerm) || id.includes(searchTerm);
    });
  }, [listmenu, searchValue]);

  if (loading) {
    return <div className="text-center p-8">Loading equipment...</div>;
  }

  // Component สำหรับแสดงแบบ Category (Grid Cards)
  const CategoryView = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-4">
      {filteredList.length > 0 ? (
        filteredList.map((item) => (
          <SheetTrigger
            key={item["ID"]}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out hover:cursor-pointer"
          >
            <ImageWithFallback
              src={item["ID"]?.toString()}
              alt={item["Name"] || `Equipment ${item["ID"]}`}
              className="w-full h-40 md:h-48 object-cover"
            />
            <div className="p-1">
              <h3 className="font-bold text-[16px] text-slate-700 text-center mb-2">
                {item["Name"]}
              </h3>
            </div>
          </SheetTrigger>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg">ไม่พบเครื่องทุ่นแรงที่ค้นหา</p>
            <p className="text-sm">ลองค้นหาด้วยคำอื่น หรือตรวจสอบการสะกดคำ</p>
          </div>
        </div>
      )}
    </div>
  );

  // Component สำหรับแสดงแบบตาราง
  const TableView = () => (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                รูปภาพ
              </th>
              <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                เครื่องจักรทุ่นแรง
              </th>
              <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                ดูรายละเอียด
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 overflow-auto">
            {filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <tr
                  key={item["ID"]}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ImageWithFallback
                      src={item["ID"]?.toString()}
                      alt={item["Name"] || `Equipment ${item["ID"]}`}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item["Name"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <SheetTrigger
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:cursor-pointer"
                    >
                      ดูรายละเอียด
                    </SheetTrigger>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-4 text-gray-500">
                    <svg
                      className="w-16 h-16 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-lg">ไม่พบเครื่องทุ่นแรงที่ค้นหา</p>
                    <p className="text-sm">
                      ลองค้นหาด้วยคำอื่น หรือตรวจสอบการสะกดคำ
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Sheet>
      <SheetContent side="left" className="w-[90%] md:w-[1200px] mx-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>เครื่องทุ่นแรง</SheetTitle>
          <SheetDescription>
            เลือกดูเครื่องทุ่นแรงตามหมวดหมู่หรือแบบตาราง
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
      <div className="p-4">
        {/* Header พร้อมปุ่มเลือกการแสดงผล */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">เครื่องทุ่นแรง</h1>
            {searchValue && (
              <p className="text-sm text-gray-600 mt-1">
                ผลการค้นหา: "{searchValue}" ({filteredList.length} รายการ)
              </p>
            )}
          </div>

          {/* ปุ่มเลือกการแสดงผล */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("category")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === "category"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span className="hidden md:block">Category</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === "table"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 6h18m-9 8h9"
                  />
                </svg>
                <span className="hidden md:block">Table</span>
              </div>
            </button>
          </div>
        </div>

        {/* แสดงเนื้อหาตามโหมดที่เลือก */}
        {viewMode === "category" ? <CategoryView /> : <TableView />}
      </div>
    </Sheet>
  );
}

export default Equipment;

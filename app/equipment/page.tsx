// equipment/page.tsx
"use client";
import * as React from "react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { useSearch } from "@/contexts/SearchContext";
import MapReport from "@/components/MapReport";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function Equipment() {
  type EquipmentItem = { ID: string | number; Name?: string };

  interface EquipmentData {
    id: string | number;
    groups: string;
    items?: string;
    status?: string;
    card?: string;
    text?: string;
    position?: string;
    matchid?: string;
    count?: number;
  }

  interface MapReportProps {
  data: EquipmentData[];
  selected: string;
  onProvinceClick?: (province: string, count: number) => void;
}

  const [listmenu, setListmenu] = React.useState<EquipmentItem[]>([]);
  const [equipments, setEquipments] = React.useState<EquipmentData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState("category"); // 'category' หรือ 'table'
  const { searchValue } = useSearch();
  const [selectedEquipment, setSelectedEquipment] =
    React.useState<EquipmentItem | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("details");
  const [selectedEquipmentDetail, setSelectedEquipmentDetail] =
    React.useState<EquipmentData | null>(null);

  const getdataequipments = async () => {
    await fetch("/api/get?dbname=equip", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEquipments(data);
        // Handle the fetched data as needed
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

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
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    getdataequipments();
  }, []);

  React.useEffect(() => {
    const getdata = async () => {
      await fetch("/api/get?dbname=equip", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data fetched successfully:", data);
          // Handle the fetched data as needed
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // Handle the error as needed
        });
    };
    getdata();
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
            onClick={() => setSelectedEquipment(item["Name"] ? item : null)}
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
                      onClick={() =>
                        setSelectedEquipment(item["Name"] ? item : null)
                      }
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
      <SheetContent
        side="left"
        className="w-[95%] md:w-[1200px] mx-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center space-x-2 gap-4">
              <ImageWithFallback
                src={selectedEquipment?.ID?.toString() || ""}
                alt={selectedEquipment?.Name || "เครื่องทุ่นแรง"}
                className="w-36 h-36  mb-2"
              />
              <h1 className="text-xl font-bold text-gray-800">
                {selectedEquipment?.Name || "เครื่องทุ่นแรง"}
              </h1>
            </div>
          </SheetTitle>
          <div className="mt-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="max-w-[98%] max-h-[800px] overflow-hidden"
              >
                <DialogHeader>
                  <DialogTitle>
                    รายละเอียด {selectedEquipmentDetail?.items}
                  </DialogTitle>
                  <DialogDescription>
                    ข้อมูลเพิ่มเติมเกี่ยวกับ {selectedEquipmentDetail?.items}{" "}
                    หน่วย {selectedEquipmentDetail?.groups}
                  </DialogDescription>
                </DialogHeader>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === "details"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    รายละเอียด
                  </button>
                  <button
                    onClick={() => setActiveTab("other")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === "other"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    MAP
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 max-h-[450px] overflow-y-auto">
                  {activeTab === "details" && (
                    <div className="space-y-4">
                      {selectedEquipmentDetail ? (
                        <div className="bg-white">
                          {/* Summary Section */}
                          {(() => {
                            const filteredItems = equipments.filter(
                              (item) =>
                                item.items === selectedEquipmentDetail?.items &&
                                item.groups === selectedEquipmentDetail?.groups
                            );

                            const totalCount = filteredItems.length;
                            const workingCount = filteredItems.filter(
                              (item) => item.status === "ใช้งานได้"
                            ).length;
                            const brokenCount = filteredItems.filter(
                              (item) => item.status !== "ใช้งานได้"
                            ).length;
                            const workingPercentage =
                              totalCount > 0
                                ? ((workingCount / totalCount) * 100).toFixed(1)
                                : 0;
                            const brokenPercentage =
                              totalCount > 0
                                ? ((brokenCount / totalCount) * 100).toFixed(1)
                                : 0;

                            return (
                              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                  สรุปสถานะ:{" "}
                                  {selectedEquipmentDetail?.items || "อุปกรณ์"}
                                </h3>
                                <div className="w-full overflow-x-auto">
                                  <div className="grid grid-cols-4 gap-4 w-[600px]">
                                    {/* Total Count */}
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg
                                              className="w-4 h-4 text-blue-600"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="ml-3">
                                          <p className="text-sm font-medium text-gray-500">
                                            ทั้งหมด
                                          </p>
                                          <p className="text-2xl font-bold text-gray-900">
                                            {totalCount}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Working Count */}
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg
                                              className="w-4 h-4 text-green-600"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="ml-3">
                                          <p className="text-sm font-medium text-gray-500">
                                            ใช้งานได้
                                          </p>
                                          <p className="text-2xl font-bold text-green-600">
                                            {workingCount}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {workingPercentage}%
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Broken Count */}
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <svg
                                              className="w-4 h-4 text-red-600"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="ml-3">
                                          <p className="text-sm font-medium text-gray-500">
                                            ชำรุด
                                          </p>
                                          <p className="text-2xl font-bold text-red-600">
                                            {brokenCount}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {brokenPercentage}%
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Status Bar */}
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                      <p className="text-sm font-medium text-gray-500 mb-2">
                                        สัดส่วนสถานะ
                                      </p>
                                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                        <div
                                          className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                          style={{
                                            width: `${workingPercentage}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-600">
                                        <span>
                                          ใช้งานได้ {workingPercentage}%
                                        </span>
                                        <span>ชำรุด {brokenPercentage}%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    หมวดหมู่:{" "}
                                    {selectedEquipmentDetail?.groups ||
                                      "ไม่ระบุ"}
                                  </span>
                                  {totalCount > 0 && (
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        Number(workingPercentage) >= 80
                                          ? "bg-green-100 text-green-800"
                                          : Number(workingPercentage) >= 50
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {Number(workingPercentage) >= 80
                                        ? "สถานะดี"
                                        : Number(workingPercentage) >= 50
                                        ? "ต้องดูแล"
                                        : "ต้องแก้ไขด่วน"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Table Section */}
                          <div className="mt-2">
                            <table className="w-full border-collapse border border-gray-300">
                              <thead className="sticky top-0 bg-gray-100 z-10">
                                <tr className="bg-gray-100">
                                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    ทะเบียน
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    ตราอักษร
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    สถานที่
                                  </th>
                                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    สถานะ
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {equipments
                                  .filter(
                                    (item) =>
                                      item.items ===
                                        selectedEquipmentDetail?.items &&
                                      item.groups ===
                                        selectedEquipmentDetail?.groups
                                  )
                                  .map((item) => (
                                    <tr
                                      key={item.id}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                        {item.card || ""}
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                        {item.text || ""}
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                        {item.position || ""}
                                      </td>
                                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                        {item.status === "ใช้งานได้" ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <svg
                                              className="w-3 h-3 mr-1"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                            ใช้งานได้
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            <svg
                                              className="w-3 h-3 mr-1"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                            ชำรุด
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-lg">
                              เลือกรายการจากตารางเพื่อดูรายละเอียด
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "other" && (
                    <div className="text-center py-8 text-gray-500">
                      <MapReport
                        data={equipments}
                        selected={selectedEquipmentDetail?.groups ?? ""}
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
              {/* Search Box */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="ค้นหารายการ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Table Container with Overflow */}
              <div className="max-h-[400px] md:min-h-[550px] overflow-y-auto border border-gray-300 rounded-md">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr>
                      <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-100">
                        รายการ
                      </th>
                      <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-100">
                        หน่วย
                      </th>
                      <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-100">
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(
                      equipments
                        .filter(
                          (item) => item.items === selectedEquipment?.Name
                        )
                        .filter(
                          (item) =>
                            !searchTerm ||
                            item.items
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            item.groups
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                        .reduce((groupMap, item) => {
                          const key = item.groups || "no-group";
                          if (!groupMap.has(key)) {
                            groupMap.set(key, { ...item, count: 1 });
                          } else {
                            const existing = groupMap.get(key);
                            existing.count += 1;
                          }
                          return groupMap;
                        }, new Map())
                        .values()
                    ).map((item) => (
                      <tr
                        key={item.groups || item.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {item.items || "ไม่ระบุ"}
                        </td>
                        <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-600">
                          {item.groups || "ไม่ระบุ"}
                          {item.count > 1 && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              ×{item.count}
                            </span>
                          )}
                        </td>
                        <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-600">
                          <DialogTrigger
                            onClick={() => {
                              setSelectedEquipmentDetail(item);
                              setActiveTab("details");
                            }}
                          >
                            <ClipboardList className="inline-block mr-1" />
                          </DialogTrigger>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Dialog>
          </div>
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

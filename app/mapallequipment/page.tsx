// vehicle-map/page.tsx
"use client";
import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MapReport from "@/components/MapReport";
import { MapPinned, Settings, Filter, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiVehicleData {
  id: string;
  groups: string;
  items: string;
  status: string;
  card: string;
  text: string;
  position: string;
  matchid: string;
  count: string;
  type?: string;
}

interface VehicleData {
  id: string;
  groups: string;
  items: string;
  status: string;
  card: string;
  text: string;
  position: string;
  matchid: string;
  count: string;
}

// แยก component ที่ใช้ useSearchParams ออกมา
function VehicleMapContent() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = React.useState<VehicleData[]>([]);
  const [filteredVehicles, setFilteredVehicles] = React.useState<VehicleData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProvince, setSelectedProvince] = React.useState<string>("all");
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showStats, setShowStats] = React.useState(false);
  const [isMounted, setMounted] = React.useState(false);
  const [namePage, setNamePage] = React.useState("เครื่องทุ่นแรง");

  // แยก mount effect
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data effect
  React.useEffect(() => {
    if (!isMounted || !searchParams) return;

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        
        const typemenu = searchParams.get("type") || "";
        console.log("Type menu:", typemenu);

        // Set page name
        switch (typemenu) {
          case "generator":
            setNamePage("เครื่องกำเนิดไฟฟ้า");
            break;
          case "frquency":
            setNamePage("เครื่องกำเนิดความถี่");
            break;
          default:
            setNamePage("เครื่องทุ่นแรง");
        }

        const response = await fetch("/api/get?dbname=equip", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Filter data by type
        const filteredData: ApiVehicleData[] = typemenu 
          ? (data as ApiVehicleData[]).filter((item: ApiVehicleData) => item.type === typemenu)
          : data;

        console.log("Filtered data:", filteredData);

        setVehicles(filteredData);
        setFilteredVehicles(filteredData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [isMounted, searchParams]);

  // Filter logic
  React.useEffect(() => {
    let filtered = vehicles;

    // Filter by province
    if (selectedProvince !== "all") {
      filtered = filtered.filter(
        (vehicle) => vehicle.position === selectedProvince
      );
    }

    // Filter by group
    if (selectedGroup !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.groups === selectedGroup);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (vehicle) => vehicle.status === selectedStatus
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.card?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.groups?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.items?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  }, [vehicles, selectedProvince, selectedGroup, selectedStatus, searchTerm]);

  // Get unique values for filters
  const provinces = React.useMemo(
    () => [...new Set(vehicles.map((v) => v.position))].filter(Boolean).sort(),
    [vehicles]
  );

  const groups = React.useMemo(
    () => [...new Set(vehicles.map((v) => v.groups))].filter(Boolean).sort(),
    [vehicles]
  );

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = filteredVehicles.length;
    const working = filteredVehicles.filter(
      (v) => v.status === "ใช้งานได้"
    ).length;
    const broken = filteredVehicles.filter((v) => v.status === "ชำรุด").length;
    const workingPercentage =
      total > 0 ? ((working / total) * 100).toFixed(1) : "0";
    const brokenPercentage =
      total > 0 ? ((broken / total) * 100).toFixed(1) : "0";

    return { total, working, broken, workingPercentage, brokenPercentage };
  }, [filteredVehicles]);

  // แสดง loading state หรือ not mounted
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!isMounted ? "กำลังเตรียมข้อมูล..." : "กำลังโหลดข้อมูล..."}
          </p>
        </div>
      </div>
    );
  }

  // แสดงข้อความเมื่อไม่มีข้อมูล
  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">ไม่พบข้อมูล</h2>
          <p className="text-gray-500 mb-4">
            ไม่มีข้อมูล{namePage}ในระบบ หรือเกิดข้อผิดพลาดในการโหลดข้อมูล
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            ลองใหม่อีกครั้ง
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-20 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  สรุป{namePage}
                </h1>
                <p className="text-sm text-gray-500">
                  ทั้งหมด {stats.total} รายการ
                  {filteredVehicles.length !== vehicles.length && 
                    ` (แสดง ${filteredVehicles.length} รายการ)`
                  }
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowStats(!showStats)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{showStats ? "ซ่อนสถิติ" : "แสดงสถิติ"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Settings className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">ทั้งหมด</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">
                      ใช้งานได้
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {stats.working}
                    </p>
                    <p className="text-xs text-green-600">
                      {stats.workingPercentage}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-600">ชำรุด</p>
                    <p className="text-2xl font-bold text-red-900">
                      {stats.broken}
                    </p>
                    <p className="text-xs text-red-600">
                      {stats.brokenPercentage}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPinned className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">จังหวัด</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {provinces.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาทะเบียน, ยี่ห้อ, หน่วย..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select
                value={selectedProvince}
                onValueChange={setSelectedProvince}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกจังหวัด</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="เลือกหน่วย" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกหน่วย</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="ใช้งานได้">ใช้งานได้</SelectItem>
                <SelectItem value="ชำรุด">ชำรุด</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset filters */}
            {(selectedProvince !== "all" ||
              selectedGroup !== "all" ||
              selectedStatus !== "all" ||
              searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProvince("all");
                  setSelectedGroup("all");
                  setSelectedStatus("all");
                  setSearchTerm("");
                }}
                className="text-xs"
              >
                ล้างตัวกรอง
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 pb-16 md:p-0">
        {filteredVehicles.length > 0 ? (
          <MapReport
            data={filteredVehicles.map((item) => ({
              ...item,
              position: item.position ?? "",
              matchid: item.matchid ?? "",
              items: item.items ?? "",
            }))}
            selected="*"
          />
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-gray-600">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</p>
              <p className="text-sm text-gray-500">ลองปรับเงื่อนไขการกรองข้อมูล</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component
function VehicleMapLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">กำลังโหลดหน้าเว็บ...</p>
      </div>
    </div>
  );
}

// Main component ที่ห่อด้วย Suspense
function VehicleMapPage() {
  return (
    <Suspense fallback={<VehicleMapLoading />}>
      <VehicleMapContent />
    </Suspense>
  );
}

export default VehicleMapPage;
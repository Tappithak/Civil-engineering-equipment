// vehicle-map/page.tsx
"use client";
import * as React from "react";
import MapReport from "@/components/MapReport";
import { MapPinned, Car, Filter, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function VehicleMapPage() {
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

  const [vehicles, setVehicles] = React.useState<VehicleData[]>([]);
  const [filteredVehicles, setFilteredVehicles] = React.useState<VehicleData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProvince, setSelectedProvince] = React.useState<string>("all");
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showStats, setShowStats] = React.useState(false);

  // Mock data based on your example
  const mockVehicleData: VehicleData[] = [
    {
      "id": "1",
      "groups": "สพ.ทร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "40984",
      "text": "40984",
      "position": "ชลบุรี",
      "matchid": "สพ.ทร.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "2",
      "groups": "สพ.ทร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "43924",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "สพ.ทร.รถกระเช้าไฟฟ้า",
      "count": "2"
    },
    {
      "id": "26",
      "groups": "สพ.ทร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "สพ.ทร.รถกระเช้าไฟฟ้า",
      "count": "3"
    },
    {
      "id": "38",
      "groups": "นย.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "นย.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "122",
      "groups": "อจปร.อร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "43654",
      "text": "ISUZU",
      "position": "สมุทรปราการ",
      "matchid": "อจปร.อร.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "191",
      "groups": "สอ.รฝ.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "สอ.รฝ.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "210",
      "groups": "ฐท.สข.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "43848",
      "text": "อีซูซุ TLD ๕๖ Y",
      "position": "สงขลา",
      "matchid": "ฐท.สข.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "211",
      "groups": "ฐท.สข.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "42171",
      "text": "ฮีโน่ WU ๓๔๐ R",
      "position": "สงขลา",
      "matchid": "ฐท.สข.รถกระเช้าไฟฟ้า",
      "count": "2"
    },
    {
      "id": "232",
      "groups": "ฐท.พง.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "41552",
      "text": "ISUZU",
      "position": "พังงา",
      "matchid": "ฐท.พง.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "233",
      "groups": "ฐท.พง.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "41635",
      "text": "MITSUBISHI",
      "position": "พังงา",
      "matchid": "ฐท.พง.รถกระเช้าไฟฟ้า",
      "count": "2"
    },
    {
      "id": "272",
      "groups": "กสพ.ฐท.สส.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "40070",
      "text": "HINO",
      "position": "ชลบุรี",
      "matchid": "กสพ.ฐท.สส.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "364",
      "groups": "กชธ.ฐทสส.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "43586",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "กชธ.ฐทสส.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "365",
      "groups": "กชธ.ฐทสส.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ชำรุด",
      "card": "43587",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "กชธ.ฐทสส.รถกระเช้าไฟฟ้า",
      "count": "2"
    },
    {
      "id": "366",
      "groups": "กชธ.ฐทสส.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ชำรุด",
      "card": "43589",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "กชธ.ฐทสส.รถกระเช้าไฟฟ้า",
      "count": "3"
    },
    {
      "id": "367",
      "groups": "กชธ.ฐทสส.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "43590",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "กชธ.ฐทสส.รถกระเช้าไฟฟ้า",
      "count": "4"
    },
    {
      "id": "368",
      "groups": "กชธ.ฐทสส.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "40020",
      "text": "HINO",
      "position": "ชลบุรี",
      "matchid": "กชธ.ฐทสส.รถกระเช้าไฟฟ้า",
      "count": "5"
    },
    {
      "id": "369",
      "groups": "กชธ.ฐทสส.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "43799",
      "text": "HINO",
      "position": "ชลบุรี",
      "matchid": "กชธ.ฐทสส.รถกระเช้าไฟฟ้า",
      "count": "6"
    },
    {
      "id": "371",
      "groups": "กชธ.ฐทสส.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "กชธ.ฐทสส.รถกระเช้าไฟฟ้า",
      "count": "7"
    },
    {
      "id": "391",
      "groups": "กรง.ฐท.สส.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "41507",
      "text": "ISUZU",
      "position": "ชลบุรี",
      "matchid": "กรง.ฐท.สส.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "402",
      "groups": "ยศ.ทร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "41575",
      "text": "ISUZU",
      "position": "นครปฐม",
      "matchid": "ยศ.ทร.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "502",
      "groups": "ชย.ทร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "42705",
      "text": "MITSUBISHI",
      "position": "กรุงเทพ",
      "matchid": "ชย.ทร.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "503",
      "groups": "ชย.ทร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "42181",
      "text": "MITSUBISHI",
      "position": "กรุงเทพ",
      "matchid": "ชย.ทร.รถกระเช้าไฟฟ้า",
      "count": "2"
    },
    {
      "id": "515",
      "groups": "ยศ.ทร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "40103",
      "text": "ISUZU",
      "position": "กรุงเทพ",
      "matchid": "ยศ.ทร.รถกระเช้าไฟฟ้า",
      "count": "2"
    },
    {
      "id": "529",
      "groups": "กบร.กร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ชำรุด",
      "card": "42611",
      "text": "TOYOTA",
      "position": "ชลบุรี",
      "matchid": "กบร.กร.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "530",
      "groups": "กบร.กร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "41370",
      "text": "HINO",
      "position": "ชลบุรี",
      "matchid": "กบร.กร.รถกระเช้าไฟฟ้า",
      "count": "2"
    },
    {
      "id": "561",
      "groups": "กอง สน.กร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "40020",
      "text": "HINO",
      "position": "ชลบุรี",
      "matchid": "กอง สน.กร.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "610",
      "groups": "อล.ทร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "",
      "text": "ISUZU",
      "position": "สมุทรปราการ",
      "matchid": "อล.ทร.รถกระเช้าไฟฟ้า",
      "count": "1"
    },
    {
      "id": "611",
      "groups": "อล.ทร.",
      "items": "รถกระเช้าไฟฟ้า",
      "status": "ใช้งานได้",
      "card": "",
      "text": "",
      "position": "สมุทรปราการ",
      "matchid": "อล.ทร.รถกระเช้าไฟฟ้า",
      "count": "2"
    }
  ];

  // Initialize data
  React.useEffect(() => {
    // Fetch data from API
    const fetchVehicles = async () => {
      try {
        setLoading(true);
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
        console.log("Fetched vehicle data:", data);
        
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        // Fallback to mock data if API fails
        console.log("Using mock data as fallback");
        setVehicles(mockVehicleData);
        setFilteredVehicles(mockVehicleData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);

  // Filter logic
  React.useEffect(() => {
    let filtered = vehicles;

    // Filter by province
    if (selectedProvince !== "all") {
      filtered = filtered.filter(vehicle => vehicle.position === selectedProvince);
    }

    // Filter by group
    if (selectedGroup !== "all") {
      filtered = filtered.filter(vehicle => vehicle.groups === selectedGroup);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(vehicle => vehicle.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(vehicle =>
        vehicle.card.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.groups.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  }, [vehicles, selectedProvince, selectedGroup, selectedStatus, searchTerm]);

  // Get unique values for filters
  const provinces = React.useMemo(() => 
    [...new Set(vehicles.map(v => v.position))].filter(Boolean).sort()
  , [vehicles]);

  const groups = React.useMemo(() => 
    [...new Set(vehicles.map(v => v.groups))].filter(Boolean).sort()
  , [vehicles]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = filteredVehicles.length;
    const working = filteredVehicles.filter(v => v.status === "ใช้งานได้").length;
    const broken = filteredVehicles.filter(v => v.status === "ชำรุด").length;
    const workingPercentage = total > 0 ? ((working / total) * 100).toFixed(1) : "0";
    const brokenPercentage = total > 0 ? ((broken / total) * 100).toFixed(1) : "0";

    return { total, working, broken, workingPercentage, brokenPercentage };
  }, [filteredVehicles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลรถยนต์...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ตำแหน่งเครื่องทุ่นแรง</h1>
                <p className="text-sm text-gray-500">เครื่องทุ่นแรง - ทั้งหมด {stats.total} คัน</p>
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
                      <Car className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">ทั้งหมด</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">ใช้งานได้</p>
                    <p className="text-2xl font-bold text-green-900">{stats.working}</p>
                    <p className="text-xs text-green-600">{stats.workingPercentage}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-600">ชำรุด</p>
                    <p className="text-2xl font-bold text-red-900">{stats.broken}</p>
                    <p className="text-xs text-red-600">{stats.brokenPercentage}%</p>
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
                    <p className="text-2xl font-bold text-gray-900">{provinces.length}</p>
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
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
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
            {(selectedProvince !== "all" || selectedGroup !== "all" || selectedStatus !== "all" || searchTerm) && (
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
      <div className="flex-1" style={{ height: "calc(100vh - 200px)" }}>
        <MapReport
          data={filteredVehicles.map(item => ({
            ...item,
            position: item.position ?? "",
            matchid: item.matchid ?? "",
            items: item.items ?? "",
          }))}
          selected="*"
        />
      </div>
    </div>
  );
}

export default VehicleMapPage;
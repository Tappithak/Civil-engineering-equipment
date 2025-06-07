// civilian-report/page.tsx
"use client";
import * as React from "react";
import { Suspense } from "react";
import { 
  Users, 
  UserCheck,
  Building2,
  TrendingUp,
  Filter, 
  Search, 
  Grid3X3,
  List,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalData {
  id: number;
  fname: string;
  position: string;
  note?: string;
  group: string;
}

function CivilianReportContent() {
  const [personnel, setPersonnel] = React.useState<PersonalData[]>([]);
  const [filteredPersonnel, setFilteredPersonnel] = React.useState<PersonalData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [selectedPosition, setSelectedPosition] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isMounted, setMounted] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;

    const fetchPersonnel = async () => {
      try {
        setLoading(true);
        
        const response = await fetch("/api/get?dbname=personnel", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Personnel data:", data);
        
        setPersonnel(data);
        setFilteredPersonnel(data);
      } catch (error) {
        console.error("Error fetching personnel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [isMounted]);

  // Filter logic
  React.useEffect(() => {
    let filtered = personnel;

    if (selectedGroup !== "all") {
      filtered = filtered.filter(person => person.group === selectedGroup);
    }

    if (selectedPosition !== "all") {
      filtered = filtered.filter(person => person.position === selectedPosition);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(person =>
        person.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.note && person.note.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPersonnel(filtered);
  }, [personnel, selectedGroup, selectedPosition, searchTerm]);

  // Get unique values for filters
  const groups = React.useMemo(
    () => [...new Set(personnel.map(p => p.group))].filter(Boolean).sort(),
    [personnel]
  );

  const positions = React.useMemo(
    () => [...new Set(personnel.map(p => p.position))].filter(Boolean).sort(),
    [personnel]
  );

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = filteredPersonnel.length;
    const totalPersonnel = personnel.length;
    
    const groupCounts = groups.map(group => ({
      name: group.replace('กำลังพลสูญปฏิบัติงานซ่อมกำราง', 'ชุดที่'),
      count: personnel.filter(p => p.group === group).length,
      percentage: personnel.length > 0 ? ((personnel.filter(p => p.group === group).length / personnel.length) * 100).toFixed(1) : "0"
    }));

    const topPositions = positions.slice(0, 3).map(position => ({
      position,
      count: personnel.filter(p => p.position === position).length
    }));

    const hasNotes = personnel.filter(p => p.note && p.note.trim() !== "").length;

    return { 
      total, 
      totalPersonnel, 
      groupCounts, 
      topPositions, 
      hasNotes,
      uniquePositions: positions.length 
    };
  }, [filteredPersonnel, personnel, groups, positions]);

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">กำลังโหลดข้อมูลบุคลากร...</p>
        </div>
      </div>
    );
  }

  if (personnel.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">ไม่พบข้อมูลบุคลากร</h2>
          <p className="text-gray-500 mb-4">ระบบยังไม่มีข้อมูลบุคลากร หรือเกิดข้อผิดพลาดในการโหลด</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            ลองใหม่อีกครั้ง
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-18">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-[18px] font-bold text-gray-900">กำลังพลชุดปฏิบัติงาน</h1>
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center space-x-1"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">รายการ</span>
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center space-x-1"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">กริด</span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* <Button variant="outline" className="flex items-center space-x-2 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                <span>ส่งออก Excel</span>
              </Button> */}
              
              
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">บุคลากรทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPersonnel}</p>
                <p className="text-sm text-green-600 mt-1">+{stats.total} แสดงผล</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">กลุ่มงาน</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{groups.length}</p>
                <p className="text-sm text-blue-600 mt-1">กลุ่มทั้งหมด</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ตำแหน่งงาน</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uniquePositions}</p>
                <p className="text-sm text-purple-600 mt-1">ตำแหน่งต่างๆ</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">มีหมายเหตุ</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.hasNotes}</p>
                <p className="text-sm text-orange-600 mt-1">รายการที่มีหมายเหตุ</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Group Statistics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">การกระจายตามกลุ่มงาน</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.groupCounts.map((group, index) => (
              <div key={group.name} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{group.name}</span>
                  <span className="text-lg font-bold text-gray-900">{group.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${group.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{group.percentage}% ของทั้งหมด</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, ตำแหน่ง, หมายเหตุ..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="เลือกกลุ่ม" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกกลุ่ม</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group.replace('กำลังพลสูญปฏิบัติงานซ่อมกำราง', 'ชุดที่')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="เลือกตำแหน่ง" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกตำแหน่ง</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(selectedGroup !== "all" || selectedPosition !== "all" || searchTerm) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                แสดงผล {filteredPersonnel.length} จาก {personnel.length} รายการ
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedGroup("all");
                  setSelectedPosition("all");
                  setSearchTerm("");
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                ล้างตัวกรอง
              </Button>
            </div>
          )}
        </div>

        {/* Data Display */}
        {filteredPersonnel.length > 0 ? (
          viewMode === "list" ? (
            /* List View */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-auto h-[500px]">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กลุ่ม</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมายเหตุ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPersonnel.map((person, index) => (
                      <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {person.fname.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{person.fname}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {person.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {person.group.replace('กำลังพลสูญปฏิบัติงานซ่อมกำราง', 'ชุดที่')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {person.note && person.note.trim() !== "" ? (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              {person.note}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[300px] md:h-[700px] p-4 md:p-2 overflow-auto">
              {filteredPersonnel.map((person) => (
                <div key={person.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {person.fname.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{person.fname}</h3>
                      <p className="text-sm text-gray-600 mt-1">{person.position}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {person.group.replace('กำลังพลสูญปฏิบัติงานซ่อมกำราง', 'ชุดที่')}
                      </p>
                      {person.note && person.note.trim() !== "" && (
                        <div className="mt-3">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            {person.note}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูล</h3>
            <p className="text-gray-500">ไม่มีข้อมูลที่ตรงกับเงื่อนไขการค้นหา ลองปรับเงื่อนไขใหม่</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component
function CivilianReportLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">กำลังโหลดหน้าเว็บ...</p>
      </div>
    </div>
  );
}

// Main component ที่ห่อด้วย Suspense
function CivilianReportPage() {
  return (
    <Suspense fallback={<CivilianReportLoading />}>
      <CivilianReportContent />
    </Suspense>
  );
}

export default CivilianReportPage;
// documents/page.tsx
"use client";
import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  FileText, 
  Download, 
  Eye,
  Search, 
  Filter,
  Folder,
  Calendar,
  User,
  ExternalLink,
  BookOpen,
  Archive,
  Star,
  Clock,
  Grid3X3,
  List,
  SortAsc,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DocumentData {
  id: string;
  name: string;
  description?: string;
  category: string;
  fileId: string; // Google Drive file ID
  uploadDate: string;
  size: string;
  version?: string;
  tags?: string[];
  author?: string;
  thumbnail?: string;
}

// แยก component ที่ใช้ useSearchParams ออกมา
function DocumentCategoryContent() {
  const searchParams = useSearchParams();
  const [documents, setDocuments] = React.useState<DocumentData[]>([]);
  const [filteredDocuments, setFilteredDocuments] = React.useState<DocumentData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<string>("date");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isMounted, setMounted] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<DocumentData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  // Sample data - ในความจริงจะดึงจาก API
  const sampleDocuments: DocumentData[] = [
    {
      id: "1",
      name: "คู่มือการใช้งานระบบ",
      description: "คู่มือการใช้งานระบบจัดการอุปกรณ์และบุคลากร",
      category: "คู่มือใช้งาน",
      fileId: "1jwpiG2bWsSQEUyRNjO7xUn-8cd7bbHXp",
      uploadDate: "2024-01-15",
      size: "2.5 MB",
      version: "1.0",
      tags: ["คู่มือ", "ระบบ", "การใช้งาน"],
      author: "ฝ่ายเทคนิค"
    },
    {
      id: "2",
      name: "มาตรฐานการซ่อมบำรุง",
      description: "มาตรฐานและขั้นตอนการซ่อมบำรุงอุปกรณ์",
      category: "มาตรฐาน",
      fileId: "1jwpiG2bWsSQEUyRNjO7xUn-8cd7bbHXp",
      uploadDate: "2024-01-20",
      size: "1.8 MB",
      version: "2.1",
      tags: ["มาตรฐาน", "ซ่อมบำรุง", "อุปกรณ์"],
      author: "ฝ่ายวิศวกรรม"
    },
    {
      id: "3",
      name: "ระเบียบการเบิกจ่าย",
      description: "ระเบียบและขั้นตอนการเบิกจ่ายอุปกรณ์",
      category: "ระเบียบ",
      fileId: "1jwpiG2bWsSQEUyRNjO7xUn-8cd7bbHXp",
      uploadDate: "2024-02-01",
      size: "1.2 MB",
      version: "1.5",
      tags: ["ระเบียบ", "เบิกจ่าย", "อนุมัติ"],
      author: "ฝ่ายการเงิน"
    },
    {
      id: "4",
      name: "แผนการดำเนินงาน 2024",
      description: "แผนการดำเนินงานประจำปี 2024",
      category: "แผนงาน",
      fileId: "1jwpiG2bWsSQEUyRNjO7xUn-8cd7bbHXp",
      uploadDate: "2024-01-01",
      size: "3.2 MB",
      version: "1.0",
      tags: ["แผนงาน", "2024", "ดำเนินงาน"],
      author: "ฝ่ายแผนงาน"
    },
    {
      id: "5",
      name: "คู่มือความปลอดภัย",
      description: "คู่มือการปฏิบัติงานอย่างปลอดภัย",
      category: "ความปลอดภัย",
      fileId: "1jwpiG2bWsSQEUyRNjO7xUn-8cd7bbHXp",
      uploadDate: "2024-01-10",
      size: "4.1 MB",
      version: "3.0",
      tags: ["ความปลอดภัย", "คู่มือ", "ปฏิบัติงาน"],
      author: "ฝ่ายความปลอดภัย"
    },
    {
      id: "6",
      name: "รายงานประจำปี 2023",
      description: "รายงานผลการดำเนินงานประจำปี 2023",
      category: "รายงาน",
      fileId: "1jwpiG2bWsSQEUyRNjO7xUn-8cd7bbHXp",
      uploadDate: "2024-01-05",
      size: "5.7 MB",
      version: "1.0",
      tags: ["รายงาน", "2023", "ผลการดำเนินงาน"],
      author: "ฝ่ายบริหาร"
    }
  ];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        
        // ในความจริงจะเป็น API call
        // const response = await fetch("/api/get?dbname=documents");
        // const data = await response.json();
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDocuments(sampleDocuments);
        setFilteredDocuments(sampleDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [isMounted]);

  // Filter and sort logic
  React.useEffect(() => {
    let filtered = documents;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort documents
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case "size":
          return parseFloat(b.size) - parseFloat(a.size);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
  }, [documents, selectedCategory, searchTerm, sortBy]);

  // Get unique categories
  const categories = React.useMemo(
    () => [...new Set(documents.map(doc => doc.category))].sort(),
    [documents]
  );

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum, doc) => sum + parseFloat(doc.size), 0);
    const categoryStats = categories.map(category => ({
      category,
      count: documents.filter(doc => doc.category === category).length
    }));

    return { totalDocuments, totalSize: totalSize.toFixed(1), categoryStats };
  }, [documents, categories]);

  // Function to get Google Drive preview/download URL
  const getGoogleDriveUrl = (fileId: string, action: 'view' | 'download') => {
    if (action === 'view') {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    } else {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">กำลังโหลดเอกสาร...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ศูนย์เอกสาร</h1>
                <p className="text-gray-600 mt-1">
                  คลังเอกสารและคู่มือทั้งหมด {stats.totalDocuments} ไฟล์ ({stats.totalSize} MB)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center space-x-1"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">กริด</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center space-x-1"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">รายการ</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">เอกสารทั้งหมด</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalDocuments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Folder className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">หมวดหมู่</p>
                <p className="text-xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Archive className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ขนาดรวม</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalSize} MB</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">อัปเดตล่าสุด</p>
                <p className="text-sm font-medium text-gray-900">วันนี้</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาเอกสาร, คำอธิบาย, แท็ก..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="เรียงตาม" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">วันที่อัปโหลด</SelectItem>
                  <SelectItem value="name">ชื่อไฟล์</SelectItem>
                  <SelectItem value="category">หมวดหมู่</SelectItem>
                  <SelectItem value="size">ขนาดไฟล์</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(selectedCategory !== "all" || searchTerm) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                แสดงผล {filteredDocuments.length} จาก {documents.length} ไฟล์
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                ล้างตัวกรอง
              </Button>
            </div>
          )}
        </div>

        {/* Documents Display */}
        {filteredDocuments.length > 0 ? (
          viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate group-hover:text-green-600 transition-colors">
                            {doc.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {doc.category}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {doc.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(doc.uploadDate)}</span>
                        </div>
                        <span>{doc.size}</span>
                      </div>
                      
                      {doc.author && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{doc.author}</span>
                        </div>
                      )}

                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doc.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Dialog open={isPreviewOpen && selectedDocument?.id === doc.id} 
                             onOpenChange={(open) => {
                               setIsPreviewOpen(open);
                               if (open) setSelectedDocument(doc);
                             }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            ดูเอกสาร
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{doc.name}</DialogTitle>
                            <DialogDescription>{doc.description}</DialogDescription>
                          </DialogHeader>
                          <div className="flex-1 overflow-hidden">
                            <iframe
                              src={getGoogleDriveUrl(doc.fileId, 'view')}
                              className="w-full h-[600px] border rounded-lg"
                              title={doc.name}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        size="sm" 
                        onClick={() => window.open(getGoogleDriveUrl(doc.fileId, 'download'), '_blank')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        ดาวน์โหลด
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">เอกสาร</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">หมวดหมู่</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">วันที่อัปโหลด</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">ขนาด</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <FileText className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(doc.uploadDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-6xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>{doc.name}</DialogTitle>
                                  <DialogDescription>{doc.description}</DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 overflow-hidden">
                                  <iframe
                                    src={getGoogleDriveUrl(doc.fileId, 'view')}
                                    className="w-full h-[600px] border rounded-lg"
                                    title={doc.name}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button 
                              size="sm" 
                              onClick={() => window.open(getGoogleDriveUrl(doc.fileId, 'download'), '_blank')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Download className="w-4 h-4" />
                            </Button>

                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`https://drive.google.com/file/d/${doc.fileId}/view`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบเอกสาร</h3>
            <p className="text-gray-500">ไม่มีเอกสารที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component
function DocumentCategoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">กำลังโหลดเอกสาร...</p>
      </div>
    </div>
  );
}

// Main component ที่ห่อด้วย Suspense
function DocumentCategoryPage() {
  return (
    <Suspense fallback={<DocumentCategoryLoading />}>
      <DocumentCategoryContent />
    </Suspense>
  );
}

export default DocumentCategoryPage;
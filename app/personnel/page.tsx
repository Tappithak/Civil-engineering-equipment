'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, ExternalLink, Upload, Edit, Trash2, Save, Loader2 } from 'lucide-react';

// TypeScript Interfaces
interface ManualItem {
  id: string;
  fname: string;
  path: string;
  group: string;
  set: string;
  note?: string;
}

type ManualData = Record<string, ManualItem[]>;

interface ApiResponse {
  success: boolean;
  data: ManualItem[];
  message?: string;
}

interface UploadPayload {
  fname: string;
  group: string;
  set: string;
  path: string;
  note?: string;
}

export default function ThaiRepairManualSystem() {
  // State Management
  const [currentPage, setCurrentPage] = useState<'home' | 'group' | 'pdf'>('home');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ManualItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showManageModal, setShowManageModal] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState<string>('');
  const [uploadGroup, setUploadGroup] = useState<string>('');
  const [uploadSet, setUploadSet] = useState<string>('');
  const [editingItem, setEditingItem] = useState<ManualItem | null>(null);
  const [manualData, setManualData] = useState<ManualData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  // API Functions
  const fetchManualData = async (): Promise<void> => {
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

      const result = await response.json();
      
      // ตรวจสอบว่า result เป็น array โดยตรง หรือมี result.data
      const dataArray = Array.isArray(result) ? result : result.data;
      
      if (Array.isArray(dataArray)) {
        // Group data by category
        const groupedData: ManualData = {};
        dataArray.forEach((item: ManualItem) => {
          const groupKey = item.group || 'อื่นๆ';
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = [];
          }
          groupedData[groupKey].push(item);
        });
        setManualData(groupedData);
      } else {
        console.error('Invalid data format:', result);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ API');
    } finally {
      setLoading(false);
    }
  };

  const uploadNewFile = async (payload: UploadPayload): Promise<boolean> => {
    try {
      setUploading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        alert('อัพโหลดไฟล์เรียบร้อยแล้ว');
        await fetchManualData(); // Refresh data
        return true;
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.message}`);
        return false;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('เกิดข้อผิดพลาดในการอัพโหลด');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const updateItem = async (id: string, updatedData: Partial<ManualItem>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        alert('แก้ไขข้อมูลเรียบร้อยแล้ว');
        await fetchManualData(); // Refresh data
        return true;
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.message}`);
        return false;
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไข');
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        alert('ลบไฟล์เรียบร้อยแล้ว');
        await fetchManualData(); // Refresh data
        return true;
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.message}`);
        return false;
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('เกิดข้อผิดพลาดในการลบ');
      return false;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchManualData();
  }, []);

  // Event Handlers
  const handleGroupSelect = (groupName: string): void => {
    setSelectedGroup(groupName);
    setCurrentPage('group');
  };

  const handleItemSelect = (item: ManualItem): void => {
    setSelectedItem(item);
    setCurrentPage('pdf');
  };

  const goBack = (): void => {
    if (currentPage === 'pdf') {
      setCurrentPage('group');
      setSelectedItem(null);
    } else if (currentPage === 'group') {
      setCurrentPage('home');
      setSelectedGroup(null);
    }
  };

  const convertGoogleDriveUrl = (url: string): string => {
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadFile(file);
      setUploadName(file.name.replace('.pdf', ''));
    } else {
      alert('กรุณาเลือกไฟล์ PDF เท่านั้น');
    }
  };

  const submitUpload = async (): Promise<void> => {
    if (!uploadFile || !uploadName.trim() || !uploadGroup.trim() || !uploadSet.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // สร้าง mock URL สำหรับ demo (ในการใช้งานจริงจะต้องอัพโหลดไฟล์ไปยัง Google Drive ก่อน)
    const mockUrl = `https://drive.google.com/file/d/mock_${Date.now()}/view?usp=drive_link`;
    
    const payload: UploadPayload = {
      fname: uploadName,
      group: uploadGroup,
      set: uploadSet,
      path: mockUrl,
      note: '',
    };

    const success = await uploadNewFile(payload);
    
    if (success) {
      // รีเซ็ตฟอร์ม
      setUploadFile(null);
      setUploadName('');
      setUploadGroup('');
      setUploadSet('');
      setShowUploadModal(false);
    }
  };

  const handleDeleteItem = async (itemId: string): Promise<void> => {
    if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
      await deleteItem(itemId);
    }
  };

  const handleEditItem = (item: ManualItem): void => {
    setEditingItem({ ...item });
  };

  const saveEditItem = async (): Promise<void> => {
    if (!editingItem || !editingItem.fname.trim()) {
      alert('กรุณากรอกชื่อไฟล์');
      return;
    }

    const success = await updateItem(editingItem.id, {
      fname: editingItem.fname,
      group: editingItem.group,
      set: editingItem.set,
    });

    if (success) {
      setEditingItem(null);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // หน้าแรก - เลือกกลุ่ม
  if (currentPage === 'home') {
    return (
      <div className="h-[calc(100dvh_-_80px)] pt-8 bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Group Selection */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {Object.keys(manualData).map((groupName, index) => (
              <button
                key={groupName}
                onClick={() => handleGroupSelect(groupName)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-blue-300 group"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    index === 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {groupName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {manualData[groupName].length} รายการ
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // หน้าแสดงรายการในกลุ่ม
  if (currentPage === 'group' && selectedGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center mb-8 pt-4">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>กลับ</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{selectedGroup}</h1>
          </div>

          {/* Items Grid */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์ใหม่'}</span>
              </button>
            </div>

            {manualData[selectedGroup]?.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 text-left group w-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.fname}
                      </h3>
                      <p className="text-sm text-gray-500">คลิกเพื่อดูเอกสาร PDF</p>
                      {item.set && (
                        <p className="text-xs text-gray-400">ชุดที่: {item.set}</p>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">อัพโหลดไฟล์ใหม่</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อไฟล์ *
                      </label>
                      <input
                        type="text"
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="กรอกชื่อไฟล์"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        กลุ่ม *
                      </label>
                      <select
                        value={uploadGroup}
                        onChange={(e) => setUploadGroup(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">เลือกกลุ่ม</option>
                        <option value="กำลังพลชุดปฏิบัติงานสำรวจอากาศ">กำลังพลชุดปฏิบัติงานสำรวจอากาศ</option>
                        <option value="ชุดปฏิบัติการซ่อมชุดที่">ชุดปฏิบัติการซ่อมชุดที่</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชุด *
                      </label>
                      <select
                        value={uploadSet}
                        onChange={(e) => setUploadSet(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">เลือกชุด</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        เลือกไฟล์ PDF *
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {uploadFile && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700">
                          ไฟล์ที่เลือก: {uploadFile.name}
                        </p>
                      </div>
                    )}

                    {/* แสดงข้อมูลที่กรอก */}
                    {(uploadName || uploadGroup || uploadSet) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">ข้อมูลที่จะบันทึก:</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          {uploadName && <p>• ชื่อไฟล์: {uploadName}</p>}
                          {uploadGroup && <p>• กลุ่ม: {uploadGroup}</p>}
                          {uploadSet && <p>• ชุด: {uploadSet}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={submitUpload}
                      disabled={uploading}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'กำลังอัพโหลด...' : 'อัพโหลด'}
                    </button>
                    <button
                      onClick={() => {
                        setShowUploadModal(false);
                        setUploadFile(null);
                        setUploadName('');
                        setUploadGroup('');
                        setUploadSet('');
                      }}
                      disabled={uploading}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // หน้าแสดง PDF
  if (currentPage === 'pdf' && selectedItem) {
    return (
      <div className="min-h-screen bg-gray-100 pb-[80px]">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>กลับ</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">{selectedItem.fname}</h1>
                <p className="text-sm text-gray-500">{selectedGroup}</p>
              </div>
            </div>
            {/* <a
              href={selectedItem.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>เปิดใน Google Drive</span>
            </a> */}
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
              <iframe
                src={convertGoogleDriveUrl(selectedItem.path)}
                className="w-full h-full border-0"
                title={selectedItem.fname}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
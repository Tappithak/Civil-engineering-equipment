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

interface UploadFileResponse {
  message: string;
  file: {
    id: string;
    name: string;
    webViewLink: string;
  };
}

// SearchableSelect Component
interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ value, onChange, options, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  interface HandleSelectOption {
    (option: string): void;
  }

  const handleSelect: HandleSelectOption = (option) => {
    onChange(option);
    setSearchTerm(option);
    setIsOpen(false);
  };

  interface HandleInputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleInputChange: (e: HandleInputChangeEvent) => void = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          disabled={disabled}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
              onMouseDown={() => handleSelect(option)}
            >
              <span className={value === option ? 'font-medium text-blue-600' : 'text-gray-700'}>
                {option}
              </span>
            </button>
          ))}
          {filteredOptions.length === 0 && searchTerm && (
            <div className="px-4 py-3 text-gray-500 text-sm">
              ไม่พบผลลัพธ์ที่ตรงกับ "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
  const [uploadProgress, setUploadProgress] = useState<string>('');

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

  // ฟังก์ชันใหม่สำหรับอัพโหลดไฟล์ไปยัง Google Drive
  const uploadFileToGoogleDrive = async (file: File, filename: string): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);
    
    // ถ้ามี folder ID เฉพาะ สามารถเพิ่มได้
    // formData.append('folderId', 'your-folder-id');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData, // ไม่ต้องใส่ Content-Type header เพราะ browser จะใส่ให้อัตโนมัติ
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  // ฟังก์ชันเพิ่มข้อมูลลงในฐานข้อมูล
  const addManualRecord = async (payload: UploadPayload): Promise<boolean> => {
    try {
      const response = await fetch("/api/add", {
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
        return true;
      } else {
        throw new Error(result.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error('Add record error:', error);
      throw error;
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

  // ================ UTILITY FUNCTIONS ================

  // ฟังก์ชั่นเริ่มแก้ไขไฟล์
  interface HandleEditItem {
    (item: ManualItem): void;
  }

  const handleEditItem: HandleEditItem = (item) => {
    setEditingItem({ ...item });
    setShowManageModal(false); // ปิด modal จัดการไฟล์
  };

  // ฟังก์ชั่นบันทึกการแก้ไข (ปรับปรุงใหม่)
  const saveEditItem = async () => {
    if (!editingItem || !editingItem.fname.trim()) {
      alert('กรุณากรอกชื่อไฟล์');
      return;
    }

    if (!editingItem.group.trim()) {
      alert('กรุณาเลือกกลุ่ม');
      return;
    }

    if (!editingItem.set.trim()) {
      alert('กรุณาเลือกชุด');
      return;
    }

    try {
      const success = await updateItem(editingItem.id, {
        fname: editingItem.fname.trim(),
        group: editingItem.group.trim(),
        set: editingItem.set.trim(),
      });

      if (success) {
        setEditingItem(null);
        // ถ้าแก้ไขกลุ่มใหม่ ให้กลับไปหน้าแรก
        if (editingItem.group !== selectedGroup) {
          setCurrentPage('home');
          setSelectedGroup(null);
        }
      }
    } catch (error) {
      console.error('Error saving edit:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  // ฟังก์ชั่นยกเลิกการแก้ไข
  const cancelEdit = () => {
    setEditingItem(null);
  };

  // ฟังก์ชั่นลบไฟล์ (ปรับปรุงใหม่)
  interface HandleDeleteItem {
    (itemId: string): Promise<void>;
  }

  const handleDeleteItem: HandleDeleteItem = async (itemId) => {
    const item = manualData[selectedGroup as string]?.find((i: ManualItem) => i.id === itemId);
    if (!item) return;

    if (confirm(`คุณต้องการลบไฟล์ "${item.fname}" หรือไม่?\n\nการดำเนินการนี้ไม่สามารถยกเลิกได้`)) {
      try {
        const success = await deleteItem(itemId);
        if (success) {
          // ถ้าไฟล์ในกลุ่มหมดแล้ว ให้กลับไปหน้าแรก
          const remainingFiles = manualData[selectedGroup as string]?.filter((i: ManualItem) => i.id !== itemId);
          if (!remainingFiles || remainingFiles.length === 0) {
            setCurrentPage('home');
            setSelectedGroup(null);
            setShowManageModal(false);
          }
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('เกิดข้อผิดพลาดในการลบไฟล์');
      }
    }
  };

  // ฟังก์ชั่นรีเซ็ตฟอร์มอัพโหลด
  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadName('');
    setUploadGroup('');
    setUploadSet('');
    setUploadProgress('');
    setShowUploadModal(false);
  };

  // ฟังก์ชั่นตรวจสอบความถูกต้องของข้อมูลอัพโหลด
  const validateUploadData = () => {
    const errors = [];

    if (!uploadFile) {
      errors.push('กรุณาเลือกไฟล์ PDF');
    } else if (uploadFile.type !== 'application/pdf') {
      errors.push('กรุณาเลือกไฟล์ PDF เท่านั้น');
    } else if (uploadFile.size > 50 * 1024 * 1024) { // 50MB
      errors.push('ขนาดไฟล์ต้องไม่เกิน 50MB');
    }

    if (!uploadName.trim()) {
      errors.push('กรุณากรอกชื่อไฟล์');
    } else if (uploadName.trim().length < 3) {
      errors.push('ชื่อไฟล์ต้องมีอย่างน้อย 3 ตัวอักษร');
    }

    if (!uploadGroup.trim()) {
      errors.push('กรุณาเลือกกลุ่ม');
    }

    if (!uploadSet.trim()) {
      errors.push('กรุณาเลือกชุด');
    }

    return errors;
  };

  // ฟังก์ชั่นอัพโหลดไฟล์ (ปรับปรุงใหม่พร้อม validation)
  const submitUpload = async () => {
    // ตรวจสอบความถูกต้องของข้อมูล
    const validationErrors = validateUploadData();
    if (validationErrors.length > 0) {
      alert('ข้อมูลไม่ถูกต้อง:\n' + validationErrors.join('\n'));
      return;
    }

    setUploading(true);
    setUploadProgress('');

    try {
      // ขั้นตอนที่ 1: อัพโหลดไฟล์ไปยัง Google Drive
      setUploadProgress('กำลังอัพโหลดไฟล์ไปยัง Google Drive...');
      if (!uploadFile) {
        throw new Error('ไม่พบไฟล์สำหรับอัพโหลด');
      }
      const uploadResult = await uploadFileToGoogleDrive(uploadFile, `${uploadName.trim()}.pdf`);
      
      // ขั้นตอนที่ 2: บันทึกข้อมูลลงในฐานข้อมูล
      setUploadProgress('กำลังบันทึกข้อมูลลงฐานข้อมูล...');
      const payload = {
        fname: uploadName.trim(),
        group: uploadGroup.trim(),
        set: uploadSet.trim(),
        path: uploadResult.file.webViewLink,
        note: '',
      };

      await addManualRecord(payload);
      
      // ขั้นตอนที่ 3: รีเฟรชข้อมูล
      setUploadProgress('กำลังอัพเดทข้อมูล...');
      await fetchManualData();
      
      alert('อัพโหลดไฟล์เรียบร้อยแล้ว!');
      resetUploadForm();
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(`เกิดข้อผิดพลาดในการอัพโหลด: ${error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ'}`);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  // ฟังก์ชั่นค้นหาไฟล์ในกลุ่ม
  interface SearchFilesInGroup {
    (groupName: string, searchTerm: string): ManualItem[];
  }

  const searchFilesInGroup: SearchFilesInGroup = (groupName, searchTerm) => {
    if (!manualData[groupName] || !searchTerm.trim()) {
      return manualData[groupName] || [];
    }

    const term = searchTerm.toLowerCase();
    return manualData[groupName].filter((item: ManualItem) => 
      item.fname.toLowerCase().includes(term) ||
      item.set.toLowerCase().includes(term) ||
      (item.note && item.note.toLowerCase().includes(term))
    );
  };

  // ฟังก์ชั่นนับจำนวนไฟล์ในแต่ละกลุ่ม
  const getFileCountByGroup = () => {
    const counts: { [key: string]: number } = {};
    Object.keys(manualData).forEach(group => {
      counts[group] = manualData[group]?.length || 0;
    });
    return counts;
  };

  // ฟังก์ชั่นเรียงลำดับไฟล์
  interface SortFilesOptions {
    sortBy?: 'name' | 'set' | 'group';
    order?: 'asc' | 'desc';
  }

  interface SortableManualItem {
    fname: string;
    set: string;
    group: string;
    [key: string]: any;
  }

  const sortFiles = (
    files: SortableManualItem[],
    sortBy: SortFilesOptions['sortBy'] = 'name',
    order: SortFilesOptions['order'] = 'asc'
  ): SortableManualItem[] => {
    const sorted = [...files].sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.fname.toLowerCase();
          bValue = b.fname.toLowerCase();
          break;
        case 'set':
          aValue = parseInt(a.set) || 0;
          bValue = parseInt(b.set) || 0;
          break;
        case 'group':
          aValue = a.group.toLowerCase();
          bValue = b.group.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  // ฟังก์ชั่นส่งออกข้อมูลเป็น CSV
  const exportToCSV = () => {
    if (Object.keys(manualData).length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const headers = ['ID', 'ชื่อไฟล์', 'กลุ่ม', 'ชุด', 'ลิงก์', 'หมายเหตุ'];
    interface CsvRow extends Array<string | number | undefined> {}

    const rows: CsvRow[] = [];

    Object.values(manualData).flat().forEach(item => {
      rows.push([
        item.id,
        item.fname,
        item.group,
        item.set,
        item.path,
        item.note || ''
      ]);
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `repair_manual_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // ฟังก์ชั่นตรวจสอบสถานะการโหลด
  const isDataLoaded = () => {
    return !loading && Object.keys(manualData).length > 0;
  };

  // ฟังก์ชั่นตรวจสอบว่าไฟล์ซ้ำหรือไม่
  interface CheckDuplicateFile {
    (fileName: string, groupName: string): boolean;
  }

  const checkDuplicateFile: CheckDuplicateFile = (fileName, groupName) => {
    if (!manualData[groupName]) return false;
    
    return manualData[groupName].some((item: ManualItem) => 
      item.fname.toLowerCase().trim() === fileName.toLowerCase().trim()
    );
  };

  // ฟังก์ชั่นรีเฟรชข้อมูลด้วยการแสดง loading
  const refreshData = async () => {
    try {
      setLoading(true);
      await fetchManualData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('เกิดข้อผิดพลาดในการรีเฟรชข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชั่นจัดการปิด modal ทั้งหมด
  const closeAllModals = () => {
    setShowUploadModal(false);
    setShowManageModal(false);
    setEditingItem(null);
    resetUploadForm();
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
      // รีเซ็ต input
      event.target.value = '';
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
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์ใหม่'}</span>
              </button>
              
              {/* <button
                onClick={() => {
                  console.log('จัดการไฟล์ clicked'); // Debug log
                  setShowManageModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>จัดการไฟล์</span>
              </button>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>ส่งออก CSV</span>
              </button>

              <button
                onClick={refreshData}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>รีเฟรช</span>
              </button> */}
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
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Upload className="w-6 h-6" />
                    อัพโหลดไฟล์ใหม่
                  </h3>
                  <p className="text-blue-100 mt-1">เพิ่มไฟล์ PDF คู่มือการซ่อมใหม่เข้าสู่ระบบ</p>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {/* File Upload Area */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        📄 เลือกไฟล์ PDF
                      </label>
                      <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                        uploadFile 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      } ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                        
                        {uploadFile ? (
                          <div className="space-y-3">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                              <FileText className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                              <p className="text-green-700 font-medium">{uploadFile.name}</p>
                              <p className="text-green-600 text-sm">
                                ขนาด: {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                              <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-gray-700 font-medium">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก</p>
                              <p className="text-gray-500 text-sm">รองรับเฉพาะไฟล์ PDF เท่านั้น</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* File Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📝 ชื่อไฟล์ *
                        </label>
                        <input
                          type="text"
                          value={uploadName}
                          onChange={(e) => setUploadName(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="กรอกชื่อไฟล์..."
                          disabled={uploading}
                        />
                      </div>

                      {/* Group Combobox */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          🏢 กลุ่ม *
                        </label>
                        <SearchableSelect
                          value={uploadGroup}
                          onChange={setUploadGroup}
                          options={[
                            'กำลังพลชุดปฏิบัติงานสำรวจอากาศ',
                            'ชุดปฏิบัติการซ่อมชุดที่',
                            'หน่วยบำรุงรักษา',
                            'หน่วยจัดหา',
                            'กลุ่มควบคุมคุณภาพ'
                          ]}
                          placeholder="ค้นหาหรือเลือกกลุ่ม..."
                          disabled={uploading}
                        />
                      </div>

                      {/* Set Combobox */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📋 ชุด *
                        </label>
                        <SearchableSelect
                          value={uploadSet}
                          onChange={setUploadSet}
                          options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                          placeholder="เลือกชุด..."
                          disabled={uploading}
                        />
                      </div>
                    </div>

                    {/* Progress */}
                    {uploading && uploadProgress && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <div className="flex-1">
                            <p className="text-blue-700 font-medium">{uploadProgress}</p>
                            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                              <div className="bg-blue-600 h-2 rounded-full w-3/5 transition-all duration-1000"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview */}
                    {(uploadName || uploadGroup || uploadSet) && !uploading && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                        <h4 className="text-emerald-800 font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          ตัวอย่างข้อมูลที่จะบันทึก
                        </h4>
                        <div className="space-y-2">
                          {uploadName && (
                            <div className="flex items-center gap-2 text-emerald-700">
                              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                              <span className="text-sm">ชื่อไฟล์: <strong>{uploadName}</strong></span>
                            </div>
                          )}
                          {uploadGroup && (
                            <div className="flex items-center gap-2 text-emerald-700">
                              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                              <span className="text-sm">กลุ่ม: <strong>{uploadGroup}</strong></span>
                            </div>
                          )}
                          {uploadSet && (
                            <div className="flex items-center gap-2 text-emerald-700">
                              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                              <span className="text-sm">ชุด: <strong>{uploadSet}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={submitUpload}
                      disabled={uploading || !uploadFile || !uploadName.trim() || !uploadGroup.trim() || !uploadSet.trim()}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 shadow-lg"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          กำลังอัพโหลด...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          อัพโหลดไฟล์
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (!uploading) {
                          resetUploadForm();
                        }
                      }}
                      disabled={uploading}
                      className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      {uploading ? 'กำลังดำเนินการ...' : 'ยกเลิก'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manage Files Modal */}
          {showManageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Edit className="w-6 h-6" />
                    จัดการไฟล์ - {selectedGroup}
                  </h3>
                  <p className="text-blue-100 mt-1">แก้ไขหรือลบไฟล์ในกลุ่มนี้</p>
                </div>

                <div className="p-6">
                  {/* Files List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {manualData[selectedGroup || '']?.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">{item.fname}</h4>
                              <p className="text-sm text-gray-500">ชุดที่: {item.set}</p>
                              <p className="text-xs text-gray-400 truncate">กลุ่ม: {item.group}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="flex items-center gap-1 bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              <span>แก้ไข</span>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>ลบ</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(!manualData[selectedGroup || ''] || manualData[selectedGroup || ''].length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>ไม่มีไฟล์ในกลุ่มนี้</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Close Button */}
                  <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        console.log('ปิด modal'); // Debug log
                        setShowManageModal(false);
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      ปิด
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit File Modal */}
          {editingItem && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
              <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 rounded-t-2xl">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Edit className="w-6 h-6" />
                    แก้ไขข้อมูลไฟล์
                  </h3>
                  <p className="text-orange-100 mt-1">แก้ไขชื่อไฟล์และข้อมูลกลุ่ม</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {/* File Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📝 ชื่อไฟล์ *
                      </label>
                      <input
                        type="text"
                        value={editingItem.fname}
                        onChange={(e) => setEditingItem({ ...editingItem, fname: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        placeholder="กรอกชื่อไฟล์..."
                      />
                    </div>

                    {/* Group */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🏢 กลุ่ม *
                      </label>
                      <SearchableSelect
                        value={editingItem.group}
                        onChange={(value) => setEditingItem({ ...editingItem, group: value })}
                        options={[
                          'กำลังพลชุดปฏิบัติงานสำรวจอากาศ',
                          'ชุดปฏิบัติการซ่อมชุดที่',
                          'หน่วยบำรุงรักษา',
                          'หน่วยจัดหา',
                          'กลุ่มควบคุมคุณภาพ'
                        ]}
                        placeholder="ค้นหาหรือเลือกกลุ่ม..."
                      />
                    </div>

                    {/* Set */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📋 ชุด *
                      </label>
                      <SearchableSelect
                        value={editingItem.set}
                        onChange={(value) => setEditingItem({ ...editingItem, set: value })}
                        options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                        placeholder="เลือกชุด..."
                      />
                    </div>

                    {/* File Path (Read Only) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🔗 ลิงก์ไฟล์
                      </label>
                      <div className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-600 text-sm">
                        {editingItem.path.length > 60 
                          ? `${editingItem.path.substring(0, 60)}...` 
                          : editingItem.path
                        }
                      </div>
                      <p className="text-xs text-gray-500 mt-1">ลิงก์ไฟล์ไม่สามารถแก้ไขได้</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={saveEditItem}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      บันทึกการแก้ไข
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
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
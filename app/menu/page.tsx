import React from 'react';
import { ChevronRight, Anchor, Package, Truck, Ship, MapPin, Shield, Zap, Target } from 'lucide-react';

const NPDLogisticsHub = () => {
  const menuItems = [
    { label: 'รถ รถยนต์นรง', icon: <Truck className="w-5 h-5" /> },
    { label: 'เครื่องแปลงความคี่', icon: <Zap className="w-5 h-5" /> },
    { label: 'เครื่องกำเนิดไฟฟ้า', icon: <Package className="w-5 h-5" /> },
    { label: 'กำลังพลชุดปฏิบัติงาน', icon: <Shield className="w-5 h-5" /> },
    { label: 'คู่มือ/เอกสารอ้างอิง', icon: <Target className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Panel - Hero Section */}
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden min-h-[650px] border border-gray-600">
            {/* Simple Background Pattern */}
            <div className="absolute inset-0">
              <svg className="w-full h-full opacity-10" viewBox="0 0 400 650" fill="none">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6b7280" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="400" height="650" fill="url(#grid)" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 py-12 text-center">
              {/* Logo */}
              <div className="mb-8">
                <img
                  src="/icon-full.png"
                  alt="NPD Military Logo"
                  width={120}
                  height={120}
                  className="mx-auto mb-6 drop-shadow-lg"
                />
              </div>

              {/* Title Section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-100 tracking-wide uppercase">
                    NPD LOGISTICS
                  </h1>
                  <h1 className="text-4xl lg:text-5xl font-bold text-yellow-400 tracking-wide uppercase">
                    HUB
                  </h1>
                </div>
                
                <div className="bg-gray-900/80 rounded-lg border border-yellow-400 p-4 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-100 mb-2 uppercase">
                    SMART LOGISTICS SYSTEM
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    ระบบส่งกำลังบำรุงสายช่างโยธา<br/>
                    เพื่อสนับสนุนภารกิจกองทัพเรือ
                  </p>
                </div>
                
                {/* Action Button */}
                <button className="px-12 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-400 font-bold text-lg rounded-lg border-2 border-yellow-400 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 uppercase">
                  <span className="flex items-center space-x-3">
                    <Shield className="w-5 h-5" />
                    <span>เข้าสู่ระบบ</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Menu */}
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="group bg-gradient-to-r from-gray-900 to-slate-800 rounded-xl p-6 shadow-lg border border-gray-600 hover:border-yellow-400 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600 group-hover:border-yellow-400 group-hover:bg-yellow-400 transition-all duration-300">
                      <div className="text-gray-300 group-hover:text-gray-900 transition-colors">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-gray-100 font-semibold text-lg group-hover:text-yellow-400 transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </div>
              </div>
            ))}
            
            {/* Bottom Cards */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-4 border border-green-600 hover:border-green-400 transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <Ship className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-100 font-semibold text-sm">ติดตามเรือ</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 border border-blue-600 hover:border-blue-400 transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-100 font-semibold text-sm">แผนที่</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-gray-900 rounded-lg border border-gray-600 p-4">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <Anchor className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-gray-300 text-sm font-medium">
              กรมทหารเรือ • ศูนย์โลจิสติกส์ทางเรือ • ระบบปฏิบัติการ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NPDLogisticsHub;
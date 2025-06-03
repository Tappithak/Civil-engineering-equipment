// components/MapReport.tsx
"use client";
import * as React from "react";

interface MapReportProps {
  data: any[];
  selected: string;
}

interface HighchartsChart {
  destroy: () => void;
  series: Array<{
    setData: (data: any[], redraw?: boolean) => void;
  }>;
  update: (options: any, redraw?: boolean) => void;
}

type ProvinceData = [string, number];

export default function MapReport({ data, selected }: MapReportProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = React.useState<HighchartsChart | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // ปรับปรุงฟังก์ชัน countLocation
  function countLocationData(dataArray: any[], selectedGroup: string): ProvinceData[] {
    if (!dataArray || dataArray.length === 0 || !selectedGroup) {
      return [];
    }

    // จับคู่ province กับ Highcharts key
    const provinceMapping: { [key: string]: string } = {
      "ชลบุรี": "th-cb",
      "สมุทรปราการ": "th-sp", 
      "สงขลา": "th-sg",
      "พังงา": "th-pg",
      "นครปฐม": "th-np",
      "ตราด": "th-tt",
      "กรุงเทพ": "th-bm",
      "กรุงเทพมหานคร": "th-bm",
      "นครพนม": "th-nf",
      "เชียงใหม่": "th-cm",
      "เชียงราย": "th-cr",
      "นครราชสีมา": "th-nk",
      "ภูเก็ต": "th-pk",
      "ระยอง": "th-ry",
      "จันทบุรี": "th-cn",
      "กาญจนบุรี": "th-kn",
      "ราชบุรี": "th-rb",
      "เพชรบุรี": "th-pb",
      "อุบลราชธานี": "th-ub",
      "ขอนแก่น": "th-kk",
      "นครสวรรค์": "th-ns",
      "สุโขทัย": "th-sk",
      "พิษณุโลก": "th-pi",
      "ลำปาง": "th-lg",
      "น่าน": "th-nn",
      "แพร่": "th-pr",
      "อุทัยธานี": "th-ut",
      "สิงห์บุรี": "th-si",
      "อ่างทอง": "th-at",
      "สระบุรี": "th-sb",
      "ลพบุรี": "th-lb",
      "นนทบุรี": "th-nb",
      "ปทุมธานี": "th-pt",
      "สมุทรสาคร": "th-sk",
      "สมุทรสงคราม": "th-ss"
    };

    // นับจำนวนในแต่ละจังหวัด
    const locationCount = dataArray.reduce((acc, item) => {
      const position = item.position || item.posistion;
      const group = item.groups || item.group;
      
      if (position && group === selectedGroup) {
        const province = position.trim();
        acc[province] = (acc[province] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    // สร้างข้อมูลสำหรับ Highcharts
    const allProvinces = [
      "th-ct", "th-4255", "th-pg", "th-st", "th-kr", "th-sa", "th-tg", 
      "th-tt", "th-pl", "th-ps", "th-kp", "th-pc", "th-sh", "th-at", 
      "th-lb", "th-pa", "th-np", "th-sb", "th-cn", "th-bm", "th-pt", 
      "th-no", "th-sp", "th-ss", "th-sm", "th-pe", "th-cc", "th-nn", 
      "th-cb", "th-br", "th-kk", "th-ph", "th-kl", "th-sr", "th-nr", 
      "th-si", "th-re", "th-le", "th-nk", "th-ac", "th-md", "th-sn", 
      "th-nw", "th-pi", "th-rn", "th-nt", "th-sg", "th-pr", "th-py", 
      "th-so", "th-ud", "th-kn", "th-tk", "th-ut", "th-ns", "th-pk", 
      "th-ur", "th-sk", "th-ry", "th-cy", "th-su", "th-nf", "th-bk", 
      "th-mh", "th-pu", "th-cp", "th-yl", "th-cr", "th-cm", "th-ln", 
      "th-na", "th-lg", "th-pb", "th-rt", "th-ys", "th-ms", "th-un", "th-nb"
    ];

    return allProvinces.map(provinceKey => {
      const provinceName = Object.keys(provinceMapping).find(
        name => provinceMapping[name] === provinceKey
      );
      const count = provinceName ? (locationCount[provinceName] || 0) : 0;
      return [provinceKey, count];
    });
  }

  // ตรวจสอบ Highcharts และ Map module
  const checkHighchartsReady = () => {
    if (typeof window === "undefined") return false;
    
    const highcharts = (window as any).Highcharts;
    if (!highcharts) {
      console.log("❌ Highcharts core not loaded");
      return false;
    }
    
    if (!highcharts.mapChart) {
      console.log("❌ Highcharts Map module not loaded");
      return false;
    }
    
    console.log("✅ Highcharts and Map module loaded successfully");
    return true;
  };

  // สร้าง/อัพเดทแผนที่
  const createOrUpdateChart = React.useCallback(
    async (dataArray: any[], selectedGroup: string): Promise<void> => {
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // ตรวจสอบ Highcharts พร้อมใช้งาน
        if (!checkHighchartsReady()) {
          throw new Error("Highcharts หรือ Map module ยังไม่พร้อมใช้งาน");
        }

        // โหลด topology data
        console.log("🌍 Loading Thailand map data...");
        const topology = await fetch(
          "https://code.highcharts.com/mapdata/countries/th/th-all.topo.json"
        ).then(async (response) => {
          if (!response.ok) {
            throw new Error(`การโหลดแผนที่ล้มเหลว: ${response.status}`);
          }
          return response.json();
        });

        const dataLocation: ProvinceData[] = countLocationData(dataArray, selectedGroup);
        const maxValue: number = Math.max(...dataLocation.map(([, value]) => value), 1);

        console.log("📊 Chart data prepared:", { dataLocation, maxValue });

        // ทำลาย chart เก่า
        if (chartInstance) {
          console.log("🧹 Destroying previous chart");
          chartInstance.destroy();
        }

        // สร้าง chart ใหม่
        console.log("🎨 Creating new map chart...");
        const chart = (window as any).Highcharts.mapChart(containerRef.current, {
          chart: {
            map: topology,
            backgroundColor: "#f8fafc",
            borderRadius: 15,
            spacing: [10, 10, 10, 10],
          },
          title: {
            text: `การกระจายรถ: ${selectedGroup || "ทั้งหมด"}`,
            style: {
              fontSize: "18px",
              fontWeight: "bold",
              color: "#1f2937",
            },
          },
          subtitle: {
            text: `ข้อมูลจำนวนรถในแต่ละจังหวัด`,
            style: {
              color: "#6b7280",
            },
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              verticalAlign: "bottom",
              theme: {
                fill: "white",
                "stroke-width": 1,
                stroke: "#ccc",
                r: 3,
                style: {
                  color: "#333",
                },
              },
            },
          },
          colorAxis: {
            min: 0,
            max: maxValue,
            minColor: "#e3f2fd",
            maxColor: "#1565c0",
            labels: {
              style: {
                color: "#374151",
              },
            },
          },
          tooltip: {
            headerFormat: "",
            pointFormat: "<b>{point.name}</b><br/>จำนวนรถ: <b>{point.value}</b> คัน",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            style: {
              color: "white",
            },
          },
          legend: {
            title: {
              text: "จำนวนรถ (คัน)",
              style: {
                color: "#374151",
              },
            },
            align: "left",
            verticalAlign: "bottom",
            floating: true,
            layout: "vertical",
            valueDecimals: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 5,
          },
          series: [{
            data: dataLocation,
            name: "จำนวนรถ",
            borderColor: "#ffffff",
            borderWidth: 1,
            states: {
              hover: {
                color: "#ff6b6b",
                borderColor: "#ffffff",
              },
            },
            dataLabels: {
              enabled: true,
              format: "{point.value}",
              style: {
                color: "#ffffff",
                textOutline: "2px contrast",
                fontWeight: "bold",
              },
              filter: {
                property: "value",
                operator: ">",
                value: 0,
              },
            },
          }],
          credits: {
            enabled: false,
          },
        });

        setChartInstance(chart);
        setIsLoading(false);
        console.log("✅ Chart created successfully");

      } catch (error) {
        console.error("❌ Error creating chart:", error);
        setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
        setIsLoading(false);
      }
    },
    [chartInstance]
  );

  // ตรวจสอบ Highcharts loading
  React.useEffect(() => {
    let retryCount = 0;
    const maxRetries = 50; // รอสูงสุด 5 วินาที (50 x 100ms)

    const checkHighcharts = () => {
      if (checkHighchartsReady()) {
        createOrUpdateChart(data, selected);
        return;
      }

      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`⏳ Waiting for Highcharts... (${retryCount}/${maxRetries})`);
        setTimeout(checkHighcharts, 100);
      } else {
        console.error("❌ Timeout waiting for Highcharts");
        setError("ไม่สามารถโหลด Highcharts ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
        setIsLoading(false);
      }
    };
    
    checkHighcharts();
  }, [data, selected, createOrUpdateChart]);

  // Cleanup เมื่อ component unmount
  React.useEffect(() => {
    return () => {
      if (chartInstance) {
        console.log("🧹 Cleaning up chart on unmount");
        chartInstance.destroy();
      }
    };
  }, [chartInstance]);

  return (
    <div className="w-full">
      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
          <strong>Debug:</strong> Highcharts: {typeof window !== 'undefined' && (window as any).Highcharts ? '✅' : '❌'} | 
          Map Module: {typeof window !== 'undefined' && (window as any).Highcharts?.mapChart ? '✅' : '❌'} | 
          Data: {data?.length || 0} items | 
          Selected: {selected || 'none'}
        </div>
      )}

      {/* แสดงสถิติก่อนแผนที่ */}
      {data && selected && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            สรุปข้อมูล: {selected}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.filter(item => (item.groups || item.group) === selected).length}
              </div>
              <div className="text-gray-600">รวมทั้งหมด</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {new Set(data
                  .filter(item => (item.groups || item.group) === selected)
                  .map(item => item.position || item.posistion)
                  .filter(Boolean)
                ).size}
              </div>
              <div className="text-gray-600">จังหวัด</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {data
                  .filter(item => (item.groups || item.group) === selected && (item.status === "ใช้งานได้"))
                  .length}
              </div>
              <div className="text-gray-600">ใช้งานได้</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {data
                  .filter(item => (item.groups || item.group) === selected && (item.status !== "ใช้งานได้"))
                  .length}
              </div>
              <div className="text-gray-600">ชำรุด</div>
            </div>
          </div>
        </div>
      )}

      {/* Container สำหรับ Highcharts */}
      <div 
        ref={containerRef}
        className="w-full border border-gray-200 rounded-2xl shadow-sm bg-white relative"
        style={{ height: 500 }}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">กำลังโหลดแผนที่...</p>
              <p className="text-xs text-gray-400 mt-1">โปรดรอสักครู่</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center text-red-600 max-w-md p-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium mb-1">ไม่สามารถแสดงแผนที่ได้</p>
              <p className="text-sm text-gray-500 mb-3">{error}</p>
              <div className="space-y-2">
                <button 
                  onClick={() => createOrUpdateChart(data, selected)}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  ลองใหม่
                </button>
                <div className="text-xs text-gray-400">
                  <p>แนวทางแก้ไข:</p>
                  <ul className="text-left mt-1 space-y-1">
                    <li>• ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
                    <li>• รีเฟรชหน้าเว็บ</li>
                    <li>• ลองใหม่อีกครั้งในภายหลัง</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data?.length && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p>ไม่มีข้อมูลแผนที่</p>
              <p className="text-sm text-gray-400 mt-1">เลือกหมวดหมู่เครื่องจักรเพื่อดูการกระจาย</p>
            </div>
          </div>
        )}
      </div>

      {/* หมายเหตุ */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>* คลิกและลากเพื่อเลื่อนแผนที่ | ใช้ปุ่ม +/- เพื่อซูม</p>
      </div>
    </div>
  );
}
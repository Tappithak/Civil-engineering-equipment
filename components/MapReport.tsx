// components/ThailandMap.jsx
"use client";

import { useEffect, useRef } from "react";
import Highcharts from "highcharts/highmaps";

interface LocationData {
  position: string;
  matchid: string;
  items?: string;
}

interface ExtendedLocationData extends LocationData {
  items?: string;
}

interface ThailandMapProps {
  data: LocationData[];
  selected: string;
}

const ThailandMap: React.FC<ThailandMapProps> = ({ data, selected }) => {
  const chartRef = useRef(null);

  interface CountLocationResult extends Array<[string, number]> {}

  const countLocation = (
    dataArray: ExtendedLocationData[],
    selectedType: string
  ): CountLocationResult => {
    if (!dataArray || dataArray.length === 0 || !selectedType) return [];

    const cb: string[] = [];
    const sm: string[] = [];
    const sk: string[] = [];
    const png: string[] = [];
    const nt: string[] = [];
    const tt: string[] = [];
    const bm: string[] = [];
    const nm: string[] = [];
    if (selectedType === "*") {
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].position == "ชลบุรี") {
          cb.push(dataArray[i].position);
        } else if (dataArray[i].position == "สมุทรปราการ") {
          sm.push(dataArray[i].position);
        } else if (dataArray[i].position == "สงขลา") {
          sk.push(dataArray[i].position);
        } else if (dataArray[i].position == "พังงา") {
          png.push(dataArray[i].position);
        } else if (dataArray[i].position == "นครปฐม") {
          nt.push(dataArray[i].position);
        } else if (dataArray[i].position == "ตราด") {
          tt.push(dataArray[i].position);
        } else if (dataArray[i].position == "กรุงเทพ") {
          bm.push(dataArray[i].position);
        } else if (dataArray[i].position == "นครพนม") {
          nm.push(dataArray[i].position);
        }
      }
    } else {
      for (let i = 0; i < dataArray.length; i++) {
        if (
          dataArray[i].position == "ชลบุรี" &&
          (dataArray[i].matchid == selectedType ||
            dataArray[i].items == selectedType)
        ) {
          cb.push(dataArray[i].position);
        } else if (
          dataArray[i].position == "สมุทรปราการ" &&
          (dataArray[i].matchid == selectedType ||
            dataArray[i].items == selectedType)
        ) {
          sm.push(dataArray[i].position);
        } else if (
          dataArray[i].position == "สงขลา" &&
          (dataArray[i].matchid == selectedType ||
            dataArray[i].items == selectedType)
        ) {
          sk.push(dataArray[i].position);
        } else if (
          dataArray[i].position == "พังงา" &&
          (dataArray[i].matchid == selectedType ||
            dataArray[i].items == selectedType)
        ) {
          png.push(dataArray[i].position);
        } else if (
          dataArray[i].position == "นครปฐม" &&
          (dataArray[i].matchid == selectedType ||
            dataArray[i].items == selectedType)
        ) {
          nt.push(dataArray[i].position);
        } else if (
          dataArray[i].position == "ตราด" &&
          (dataArray[i].matchid == selectedType ||
            dataArray[i].items == selectedType)
        ) {
          tt.push(dataArray[i].position);
        } else if (
          dataArray[i].position == "กรุงเทพ" &&
          (dataArray[i].matchid == selectedType ||
            dataArray[i].items == selectedType)
        ) {
          bm.push(dataArray[i].position);
        } else if (
          dataArray[i].position == "นครพนม" &&
          (dataArray[i].matchid == selectedType ||
            dataArray[i].items == selectedType)
        ) {
          nm.push(dataArray[i].position);
        }
      }
    }

    const dataLocation: CountLocationResult = [
      ["th-ct", 0],
      ["th-4255", 0],
      ["th-pg", png.length],
      ["th-st", 0],
      ["th-kr", 0],
      ["th-sa", 0],
      ["th-tg", 0],
      ["th-tt", tt.length],
      ["th-pl", 0],
      ["th-ps", 0],
      ["th-kp", 0],
      ["th-pc", 0],
      ["th-sh", 0],
      ["th-at", 0],
      ["th-lb", 0],
      ["th-pa", 0],
      ["th-np", nt.length],
      ["th-sb", 0],
      ["th-cn", 0],
      ["th-bm", bm.length],
      ["th-pt", 0],
      ["th-no", 0],
      ["th-sp", sm.length],
      ["th-ss", 0],
      ["th-sm", 0],
      ["th-pe", 0],
      ["th-cc", 0],
      ["th-nn", 0],
      ["th-cb", cb.length],
      ["th-br", 0],
      ["th-kk", 0],
      ["th-ph", 0],
      ["th-kl", 0],
      ["th-sr", 0],
      ["th-nr", 0],
      ["th-si", 0],
      ["th-re", 0],
      ["th-le", 0],
      ["th-nk", 0],
      ["th-ac", 0],
      ["th-md", 0],
      ["th-sn", 0],
      ["th-nw", 0],
      ["th-pi", 0],
      ["th-rn", 0],
      ["th-nt", 0],
      ["th-sg", sk.length],
      ["th-pr", 0],
      ["th-py", 0],
      ["th-so", 0],
      ["th-ud", 0],
      ["th-kn", 0],
      ["th-tk", 0],
      ["th-ut", 0],
      ["th-ns", 0],
      ["th-pk", 0],
      ["th-ur", 0],
      ["th-sk", 0],
      ["th-ry", 0],
      ["th-cy", 0],
      ["th-su", 0],
      ["th-nf", nm.length],
      ["th-bk", 0],
      ["th-mh", 0],
      ["th-pu", 0],
      ["th-cp", 0],
      ["th-yl", 0],
      ["th-cr", 0],
      ["th-cm", 0],
      ["th-ln", 0],
      ["th-na", 0],
      ["th-lg", 0],
      ["th-pb", 0],
      ["th-rt", 0],
      ["th-ys", 0],
      ["th-ms", 0],
      ["th-un", 0],
      ["th-nb", 0],
    ];

    return dataLocation;
  };

  interface LocationData {
    position: string;
    matchid: string;
  }

  interface ThailandMapProps {
    data: LocationData[];
    selected: string;
  }

  interface ChartRef {
    current: HTMLDivElement | null;
  }

  const createChart = async (
    dataArray: LocationData[],
    selectedType: string
  ): Promise<void> => {
    try {
      // Fetch topology data
      const topology = await fetch(
        "https://code.highcharts.com/mapdata/countries/th/th-all.topo.json"
      ).then((response) => response.json());

      // Get location data
      const dataLocation: [string, number][] = countLocation(
        dataArray,
        selectedType
      );

      // Create the chart
      if (chartRef.current) {
        Highcharts.mapChart(chartRef.current as HTMLElement, {
          chart: {
            map: topology,
            borderRadius: 15,
          },
          title: {
            text: "แผนที่แสดงเครื่องจักร",
            style: {
              fontSize: "18px",
              fontWeight: "bold",
            },
          },
          subtitle: {
            text: `ประเภท: ${selectedType || "ไม่ระบุ"}`,
            style: {
              fontSize: "14px",
            },
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              verticalAlign: "bottom",
            },
          },
          colorAxis: {
            min: 0,
            minColor: "#E6E7E8",
            maxColor: "#005645",
          },
          tooltip: {
            headerFormat: "",
            pointFormat:
              "<b>{point.name}</b><br/>จำนวน: <b>{point.value}</b>",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            style: {
              color: "#FFFFFF",
            },
          },
          legend: {
            enabled: true,
            title: {
              text: "จำนวน",
              style: {
                fontSize: "12px",
              },
            },
          },
          series: [
            {
              type: "map",
              mapData: topology,
              data: dataLocation,
              name: "จำนวน",
              states: {
                hover: {
                  color: "#BADA55",
                },
              },
              dataLabels: {
                enabled: true,
                format: "{point.value}",
                style: {
                  fontSize: "10px",
                  fontWeight: "bold",
                  textOutline: "1px contrast",
                },
              },
            },
          ],
          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 768,
                },
                chartOptions: {
                  title: {
                    style: {
                      fontSize: "16px",
                    },
                  },
                  subtitle: {
                    style: {
                      fontSize: "12px",
                    },
                  },
                },
              },
            ],
          },
        });
      }
    } catch (error) {
      console.error("Error creating map:", error);
    }
  };

  useEffect(() => {
    console.log("Data:", data);
    console.log("Selected:", selected);
    if (data && data.length > 0 && selected) {
      createChart(data, selected);
    }
  }, [data, selected]);

  return (
    <div className="w-full">
      <div
        ref={chartRef}
        style={{
          height: "700px",
          width: "100%",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      />
    </div>
  );
};

export default ThailandMap;

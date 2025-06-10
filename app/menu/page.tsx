"use client";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const listmenu = [
  {
    id: 1,
    name: "รถทุ่นแรง",
    icon: "/menu1.png",
    description: "เครื่องจักรสำหรับทุ่นแรงต่างๆ",
    path: "/equipment?type=equip",
  },
  {
    id: 2,
    name: "เครื่องแปลงความถี่",
    icon: "/menu2.jpg",
    description: "เครื่องแปลงความถี่ทางไฟฟ้า",
    path: "/equipment?type=frequency",
  },
  {
    id: 3,
    name: "เครื่องกำเนิดไฟฟ้า",
    icon: "/menu3.jpg",
    description: "เครื่องกำเนิดไฟฟ้าขนาเเล็กและใหญ่",
    path: "/equipment?type=generator",
  },
  {
    id: 4,
    name: "กำลังพลชุดปฏิบัติงาน",
    icon: "/personnel.png",
    description: "กำลังพลชุดปฏิบัติงานต่างๆ",
    path: "/personnel",
  },
  {
    id: 5,
    name: "คู่มือ/เอกสารอ้างอิง",
    icon: "/menu5.png",
    description: "คู่มือ/เอกสารอ้างอิงต่างๆ",
    path: "/documents",
  },
];

function menu() {
  const router = useRouter();
  return (
    <div className="bg-gradient-to-br from-green-100 to-purple-100 min-h-screen px-4 flex items-center justify-center">
      <div className="flex flex-row  justify-center items-center gap-15">
        <div className="">
          <div>
            <img
              src="/icon-full.png"
              alt="Logo"
              className="w-[120px] h-[120px] md:w-[200px] md:h-[200px] rounded-full shadow-card mb-4"
            />
          </div>
          <div>
            <div className="flex flex-col gap-0">
              <h1 className="text-[30px] md:text-[50px] text-slate-600 font-bold">
                NPD Smart Logistics
              </h1>
              <h1 className="text-[30px] md:text-[50px] text-slate-600 font-bold">
                Hub Application
              </h1>
            </div>
            <p className="text-[18px] md:text-[25px] text-slate-500 mt-2">
              แอปพลิเคชันระบบส่งกำลังบำรุงสายช่างโยธา
              เพื่อสนับสนุนภารกิจกองทัพเรือ และรองรับสถานการณ์วิกฤต
            </p>
          </div>
          <div className="w-full h-[300px] items-center justify-center mt-4">
            <Carousel
              className="w-[240px] md:w-[700px] xl:w-[900px] m-auto"
            >
              <CarouselContent className="flex gap-1">
                {listmenu.map((item) => (
                  <CarouselItem className="p-4" key={item.id}>
                    <Card className="w-[220px] md:w-[240px] h-[280px] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out hover:cursor-pointer"
                      onClick={() => router.push(item.path)}
                    >
                      <CardContent>
                        <div className="flex justify-center items-center h-full">
                          <img
                            src={item.icon}
                            alt="Logo"
                            className="w-[180px] h-[180px]"
                            style={{
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex justify-center flex-col items-center w-full gap-2">
                          <h1 className="text-1xl text-lime-600">
                            {item.name}
                          </h1>
                          {/* <p className="text-[12px] text-lime-800">
                            {item.description}
                          </p> */}
                        </div>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
        {/* Image section right */}
        <div className="hidden xl:flex">
          <img
            src="/background.jpg"
            alt="Logo"
            className="w-[550px] h-[550px] flex rounded-full"
            style={{
              display: "inline-block",
              WebkitMaskImage:
                "radial-gradient(ellipse closest-side, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
              maskImage:
                "radial-gradient(ellipse closest-side, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default menu;

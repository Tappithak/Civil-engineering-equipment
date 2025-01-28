import Logoleft from "../image/logo-l.jfif";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "./tableListAll.jsx";
import { HiTableCells } from "react-icons/hi2";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { IoHome } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import axios from "axios";
import Navbar from "./navbar.jsx";

export default function nav() {
  const [search, setsearch] = useState("");
  const navigate = useNavigate();
  const [load, setload] = useState(false);
  const [data, setData] = useState([]);

  function moveByname(type) {
    navigate("/tablelist");
    localStorage.setItem("listSel", type);
  }

  return (
    <>
      {load ? (
        <div className="loader">
          <div className="book-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 126 75"
              className="book"
            >
              <rect
                strokeWidth="5"
                stroke="#e05452"
                rx="7.5"
                height="70"
                width="121"
                y="2.5"
                x="2.5"
              ></rect>
              <line
                strokeWidth="5"
                stroke="#e05452"
                y2="75"
                x2="63.5"
                x1="63.5"
              ></line>
              <path
                strokeLinecap="round"
                strokeWidth="4"
                stroke="#c18949"
                d="M25 20H50"
              ></path>
              <path
                strokeLinecap="round"
                strokeWidth="4"
                stroke="#c18949"
                d="M101 20H76"
              ></path>
              <path
                strokeLinecap="round"
                strokeWidth="4"
                stroke="#c18949"
                d="M16 30L50 30"
              ></path>
              <path
                strokeLinecap="round"
                strokeWidth="4"
                stroke="#c18949"
                d="M110 30L76 30"
              ></path>
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#ffffff74"
              viewBox="0 0 65 75"
              className="book-page"
            >
              <path
                strokeLinecap="round"
                strokeWidth="4"
                stroke="#c18949"
                d="M40 20H15"
              ></path>
              <path
                strokeLinecap="round"
                strokeWidth="4"
                stroke="#c18949"
                d="M49 30L15 30"
              ></path>
              <path
                strokeWidth="5"
                stroke="#e05452"
                d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z"
              ></path>
            </svg>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <Navbar search={search} setsearch={setsearch} setload={setload} setData={setData}/>
      <div className="pt-[95px] pb-[80px]" style={{ zoom: "90%" }}>
        <div className="grid xl:grid-cols-6 xl:gap-4 p-3 md:grid-cols-3 md:gap-3  grid-cols-2  gap-3 justify-items-center">
          {data
            .filter((item) => item.name.includes(search) && item.id != "")
            .sort((a, b) => b.num - a.num)
            .map((item) => {
              return (
                <div
                  className="card card-compact w-60 bg-base-100 shadow-xl p-2"
                  key={item.id}
                  onClick={() => moveByname(item.name)}
                >
                  <figure>
                    <img className="imgMenu" src={item.img} alt={item.name} />
                  </figure>
                  <div className="card-body">
                    <div className="card-title text-center !text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem] xl:text-[1.3rem]">
                      {item.name}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* =============== Footer  =============== */}

      <div className="btm-nav">
        <button className="active bg-pink-200 text-pink-600">
          <IoHome />
          <span className="btm-nav-label">Home</span>
        </button>
        <Link
          className=" bg-blue-200 text-blue-600 border-blue-600"
          to="/tablelist"
        >
          <HiTableCells />
          <span className="btm-nav-label">รายการ</span>
        </Link>
        <Link className="bg-teal-200 text-teal-600" to="/report">
          <HiOutlineDocumentReport />
          <span className="btm-nav-label">Report</span>
        </Link>
      </div>
    </>
  );
}

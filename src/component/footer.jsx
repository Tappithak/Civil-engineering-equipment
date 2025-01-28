import * as React from "react";
import { HiTableCells } from "react-icons/hi2";
import { IoHome } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

export default function footer({ page }) {
  return (
    <div className="btm-nav">
      {page == "home" ? (
        <Link className="active bg-[#a20c0c] text-white" to="/">
          <IoHome className="text-[2rem]"/>
          <span className="btm-nav-label hidden sm:block">Home</span>
        </Link>
      ) : (
        <Link className="bg-[#a20c0c96] text-white" to="/">
          <IoHome className="text-[2rem]"/>
          <span className="btm-nav-label hidden sm:block">Home</span>
        </Link>
      )}


      {
        page == "item" ? (
          <Link
            className="active bg-[#a20c0c] text-white "
            to="/tablelist"
          >
            <HiTableCells className="text-[2rem]"/>
            <span className="btm-nav-label hidden sm:block">รายการ</span>
          </Link>
        ) : (
          <Link
            className="bg-[#a20c0c96] text-white "
            to="/tablelist"
          >
            <HiTableCells className="text-[2rem]"/>
            <span className="btm-nav-label hidden sm:block">รายการ</span>
          </Link>
        )
      }


      {
        page == "report" ? (
          <Link className="active bg-[#a20c0c] text-white" to="/report">
            <HiOutlineDocumentReport className="text-[2rem]"/>
            <span className="btm-nav-label hidden sm:block">Report</span>
          </Link>
        ) : (
          <Link className="bg-[#a20c0c96] text-white" to="/report">
            <HiOutlineDocumentReport className="text-[2rem]"/>
            <span className="btm-nav-label hidden sm:block">Report</span>
          </Link>
        )
      }
    </div>
  );
}

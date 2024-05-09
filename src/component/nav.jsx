import Logoleft from "../image/logo-l.jfif";
import { useEffect, useState } from "react";
import Data from "../assets/data/data.json";
import { Link , useNavigate} from "react-router-dom";
import  Table  from "../component/tableListAll"
import { HiTableCells } from "react-icons/hi2";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { IoHome } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";


export default function nav() {
  const [search, setsearch] = useState("");
  const navigate = useNavigate();

  function moveByname(type){
    navigate('/tablelist');
   localStorage.setItem('listSel', type)
  }

  return (
    <>
      <div className="navbar bg-base-100">
  <div className="flex-1">
    <img className="logo-left" src={Logoleft} alt={Logoleft}></img>
    <a className="ml-3 text-2xl">ยุทโธปกรณ์สายช่างโยธา</a>
  </div>
  <div className="flex-none gap-2">
  
    <div className="form-control d-flex flex-row">
      <input type="text" 
      placeholder="ค้นหา" 
      className="input input-bordered w-24 md:w-auto" 
      value={search}
      onChange={(e)=>setsearch(e.target.value)}
      
      />
      {/* <div className="logo-right"></div> */}
    </div>
  </div>
</div>

<div className="content-menu">
      {
      Data.filter(item => item.name.includes(search) && item.id != "").map((item) => {
        return (
          <div className="card card-compact w-60 bg-base-100 shadow-xl" key={item.id} onClick={()=>moveByname(item.name)}>
            <figure>
              <img className="imgMenu"
                src={item.img}
                alt={item.name}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-center">{item.name}</h2>
            </div>
          </div>
        );
      })
      }

</div>


{/* =============== Footer  =============== */}

<div className="btm-nav">
        <button className="active bg-pink-200 text-pink-600">
        <IoHome/>
          <span className="btm-nav-label">Home</span>
        </button>
        <Link className=" bg-blue-200 text-blue-600 border-blue-600" to="/tablelist">
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

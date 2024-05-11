import Logoleft from "../image/logo-l.jfif";
import { useEffect, useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import  Table  from "../component/tableListAll"
import { HiTableCells } from "react-icons/hi2";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { IoHome } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import axios from 'axios'


export default function nav() {
  const [search, setsearch] = useState("");
  const navigate = useNavigate();
  const [ load , setload] =  useState(false);
  const [data, setData] = useState([]);

  function moveByname(type){
    navigate('/tablelist');
   localStorage.setItem('listSel', type)
  }


  const config = "action=gethubImg&username=adminDB&password=Ad1234n";
  const fetchData = async () => {
    try {
      setload(true);
      const res = await axios.get(
        "https://script.google.com/macros/s/AKfycbyEb5N44PQzmHgurDXn2_-EWSAKyOuwYcy9-SElYBloJeJR9LzOHskbRUbvGHUInqPE/exec?" +
          config
      );
      localStorage.setItem('dataMenu', JSON.stringify(res.data))
      setData(res.data);

    } catch (error) {
      setload(false);
      console.log(error);
    }finally{
      setload(false);
    }
  };

  useEffect(() => {
      fetchData();
  
  }, []);

  return (
    <>

{

load ? 

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

:
<div></div>

    }

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
      data.filter(item => item.name.includes(search) && item.id != "")
      .sort((a, b) => b.num - a.num)
      .map((item) => {
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

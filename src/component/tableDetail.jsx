import axios from "axios";
import { useEffect, useState } from "react";
import Logoleft from "../image/logo-l.jfif";
import { HiTableCells } from "react-icons/hi2";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom"
import { HiOutlineDocumentReport } from "react-icons/hi";




export default function detail() {
    const config = "action=gethubData&username=adminDB&password=Ad1234n";
    const [search, setsearch] = useState("");
    const [data, setData] = useState([]);
    const [ load , setload] =  useState(false);
    const [ background , setbackground] =  useState("");
    const [ dataImg , setDataImg ]  = useState(JSON.parse(localStorage.getItem("dataMenu")));

    

      function countLocation(datalocal){
        var cb = []
        var sm = []
        var sk = []
        var png = []
        var nt = []
        var tt = []
        var bm = []
        var nm = []

        for(var i=0;i<datalocal.length;i++){
          if(datalocal[i].location == "ชลบุรี" && datalocal[i].group == localStorage.getItem("typeSel")){
            cb.push(datalocal[i].location)
          }
          else if(datalocal[i].location == "สมุทรปราการ" && datalocal[i].group == localStorage.getItem("typeSel")){
            sm.push(datalocal[i].location)
          }
          else if(datalocal[i].location == "สงขลา" && datalocal[i].group == localStorage.getItem("typeSel")){
            sk.push(datalocal[i].location)
          }
          else if(datalocal[i].location == "พังงา" && datalocal[i].group == localStorage.getItem("typeSel")){
            png.push(datalocal[i].location)
          }
          else if(datalocal[i].location == "นครปฐม" && datalocal[i].group == localStorage.getItem("typeSel")){
            nt.push(datalocal[i].location)
          }
          else if(datalocal[i].location == "ตราด" && datalocal[i].group == localStorage.getItem("typeSel")){
            tt.push(datalocal[i].location)
          }
          else if(datalocal[i].location == "กรุงเทพ" && datalocal[i].group == localStorage.getItem("typeSel")){
            bm.push(datalocal[i].location)
          }
          else if(datalocal[i].location == "นครพนม" && datalocal[i].group == localStorage.getItem("typeSel")){
            nm.push(datalocal[i].location)
          }
        }
        // console.log(chonburi)
        // setchonburi(chonburi.length)

        (async () => {
         
          const topology = await fetch(
              'https://code.highcharts.com/mapdata/countries/th/th-all.topo.json'
          ).then(response => response.json());
      
          // Prepare demo data. The data is joined to map using value of 'hc-key'
          // property by default. See API docs for 'joinBy' for more info on linking
          // data and map.
          const dataLocation = [
              ['th-ct', 0], ['th-4255', 0], ['th-pg', png.length], ['th-st', 0],
              ['th-kr', 0], ['th-sa', 0], ['th-tg', 0], ['th-tt', tt.length],
              ['th-pl', 0], ['th-ps', 0], ['th-kp', 0], ['th-pc', 0],
              ['th-sh', 0], ['th-at', 0], ['th-lb', 0], ['th-pa', 0],
              ['th-np', nt.length], ['th-sb', 0], ['th-cn', 0], ['th-bm', bm.length],
              ['th-pt', 0], ['th-no', 0], ['th-sp', sm.length], ['th-ss', 0],
              ['th-sm', 0], ['th-pe', 0], ['th-cc', 0], ['th-nn', 0],
              ['th-cb', cb.length], ['th-br', 0], ['th-kk', 0], ['th-ph', 0],
              ['th-kl', 0], ['th-sr', 0], ['th-nr', 0], ['th-si', 0],
              ['th-re', 0], ['th-le', 0], ['th-nk', 0], ['th-ac', 0],
              ['th-md', 0], ['th-sn', 0], ['th-nw', 0], ['th-pi', 0],
              ['th-rn', 0], ['th-nt', 0], ['th-sg', sk.length], ['th-pr', 0],
              ['th-py', 0], ['th-so', 0], ['th-ud', 0], ['th-kn', 0],
              ['th-tk', 0], ['th-ut', 0], ['th-ns', 0], ['th-pk', 0],
              ['th-ur', 0], ['th-sk', 0], ['th-ry', 0], ['th-cy', 0],
              ['th-su', 0], ['th-nf', nm.length], ['th-bk', 0], ['th-mh', 0],
              ['th-pu', 0], ['th-cp', 0], ['th-yl', 0], ['th-cr', 0],
              ['th-cm', 0], ['th-ln', 0], ['th-na', 0], ['th-lg', 0],
              ['th-pb', 0], ['th-rt', 0], ['th-ys', 0], ['th-ms', 0],
              ['th-un', 0], ['th-nb', 0]
          ];
      
          // Create the chart
          Highcharts.mapChart('container', {
              chart: {
                  map: topology
              },
      
              title: {
                  text: 'Highcharts Maps basic demo'
              },
      
              subtitle: {
                  text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/th/th-all.topo.json">Thailand</a>'
              },
      
              mapNavigation: {
                  enabled: true,
                  buttonOptions: {
                      verticalAlign: 'bottom'
                  }
              },
      
              colorAxis: {
                  min: 0,
                  max: 1
              },
              tooltip: {
                valueDecimals: 0,
                valueSuffix: ' คัน'
            },
      
              series: [{
                  data: dataLocation,
                  name: 'จำนวนรถ',
                  states: {
                      hover: {
                          color: '#BADA55'
                      }
                  },
                  dataLabels: {
                      enabled: true,
                      format: '{point.value:.0f}'
                  }
              }]
          });
      
      })();
      }


      function findBg(){
        let resualt = "";
        for(var i=0;i<dataImg.length;i++) {
          if(dataImg[i].name == localStorage.getItem("listSel")){
            resualt = dataImg[i].img;
          }
        }
        setbackground(resualt)
      }

      

      useEffect(() => {
        const fetchData = async () => {
          try {
            setload(true);
            const res = await axios.get(
              "https://script.google.com/macros/s/AKfycbyEb5N44PQzmHgurDXn2_-EWSAKyOuwYcy9-SElYBloJeJR9LzOHskbRUbvGHUInqPE/exec?" +
                config
            );
      
            setData(res.data);
            countLocation(res.data)
          } catch (error) {
            setload(false);
            console.log(error);
          }finally{
            setload(false);
           
            findBg();
          }
        };
        
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


      <nav className="navbar bg-base-100 h-[90px] shadow">
        <div className="flex-1">
          <img className="logo-left" src={Logoleft} alt={Logoleft}></img>
          <a className="ml-3 text-2xl">ยุทโธปกรณ์สายช่างโยธา</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control d-flex flex-row">
            <input
              type="text"
              placeholder="ค้นหา"
              className="input input-bordered w-24 md:w-auto"
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />
            {/* <div className="logo-right"></div> */}
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-3 overflow-auto justify-items-center gap-3 pt-[90px] pb-[80px] xl:h-[100dvh]">
      <div className="overflow-auto xl:h-full h-[600px] flex">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>ทะเบียน</th>
              <th>ตราอักษร</th>
              <th>สถานที่</th>
            </tr>
          </thead>
          <tbody>
            {
            (data.filter(item => item.group.includes(localStorage.getItem("typeSel")))  ).length > 0 ?
            
            data
              .filter(item => item.group.includes(localStorage.getItem("typeSel"))  && (item.number.includes(search) || item.tra.includes(search) ) )
              .map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.number}</td>
                    <td>{item.tra}</td>
                    <td>{item.location}</td>
                  </tr>
                );
              }) :

              <tr>
              <td colSpan={4}>No order items found.</td>
            </tr>

            
            }

            

          </tbody>
        </table>
      </div>
   
   
      <div id="container"></div>
   
      </div>

      <div className="bg-page" style={{
        backgroundImage: "url(" + background + ")"
        }}>

      </div>
   
   
   
   
   
      {/* =============== Footer  =============== */}

      <div className="btm-nav">
        <Link className=" bg-pink-200 text-pink-600" to="/">
          <IoHome />
          <span className="btm-nav-label">Home</span>
        </Link>
       <Link className="active bg-blue-200 text-blue-600 border-blue-600"  to="/tablelist">
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

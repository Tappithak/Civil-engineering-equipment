import * as React from "react";
import Logoleft from "../image/logo-l.jfif";
import axios from "axios";

export default function navbar({search,setsearch,setload,setData}) {
    React.useEffect(() => {
        const config = "action=gethubImg&username=adminDB&password=Ad1234n";
        const fetchData = async () => {
          try {
            setload(true);
            const res = await axios.get(
              "https://script.google.com/macros/s/AKfycbyEb5N44PQzmHgurDXn2_-EWSAKyOuwYcy9-SElYBloJeJR9LzOHskbRUbvGHUInqPE/exec?" +
                config
            );
            setData(res.data);
          } catch (error) {
            setload(false);
            console.log(error);
          } finally {
            setload(false);
          }
        };
    
        fetchData();
      }, []);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
      <img className="btn btn-ghost text-xl" src={Logoleft} alt={Logoleft}></img>
      <a className="ml-3 text-2xl hidden sm:flex">ยุทโธปกรณ์สายช่างโยธา</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="ค้นหาเมนู"
            className="input input-bordered w-24 md:w-auto"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
            <span class="text-3xl">D</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {/* <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li> */}
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

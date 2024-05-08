import Logoleft from "../image/logo-l.jfif";
import { useState } from "react";

export default function nav() {
  const [value, setValue] = useState("");
  return (
    <>
      <div className="content-nav">
        <nav>
          <img className="logo-left" src={Logoleft} alt="logo-left" />

          <h3 className="text-head">ยุทโธปกรณ์สายช่างโยธา</h3>

          <div className="logo-right"></div>
        </nav>
        <div className="content-under">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
      </div>
    </>
  );
}
import { useState } from "react";
import Data from "../assets/data/data.json";


export default function home() {
  // const [menuList , setmenuList] = useState([])

  return (
    <>
    <div className="content-menu">


      {Data.map((item) => {
        return (
          <div className="card card-compact w-96 bg-base-100 shadow-xl" key={item.id}>
            <figure>
              <img
                src={item.img}
                alt={item.name}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{item.name}</h2>
            </div>
          </div>
        );
      })
      }

</div>
    </>
  );
}

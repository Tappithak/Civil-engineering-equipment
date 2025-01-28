import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import List from './component/tableListAll.jsx'
import Detail from './component/tableDetail.jsx'
import Report from './component/report.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />

  },
  {
    path: "/tablelist",
    element: <List />

  },
  {
    path: "/tabledetail",
    element: <Detail />

  }
  ,
  {
    path: "/report",
    element: <Report />

  },


  {
    path: "about",
    element: <div>About</div>,
  },
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

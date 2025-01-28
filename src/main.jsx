import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import List from './component/tableListAll.jsx'
import Detail from './component/tableDetail.jsx'
import Report from './component/report.jsx'
import Login from './component/login.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />

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
    path: "/menu",
    element: <App />,
  },
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

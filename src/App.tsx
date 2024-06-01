// import { useState } from "react";
import { useEffect } from "react";
import styles from "./App.module.less";
import { Navigate, useRoutes } from "react-router-dom";
import { Login, Home, Detail, Write, PersonalInfo } from "@/components";
import { Content } from "@/components/home/components";

const Index = () => {
  const routesList = useRoutes([
    {
      path: "/",
      element: <Navigate to={"/login"}></Navigate>,
    },
    {
      path: "/login",
      element: <Login></Login>,
    },
    {
      path: "/home",
      element: <Home></Home>,
      children: [
        {
          path: "detail",
          element: <Detail></Detail>,
        },
        {
          path: "content",
          element: <Content></Content>,
        },
        {
          path: "write",
          element: <Write></Write>,
        },
        {
          path: "info",
          element: <PersonalInfo></PersonalInfo>,
        },
      ],
    },
  ]);
  useEffect(() => {}, []);

  return <>{routesList}</>;
};

const App = () => {
  return <Index></Index>;
};

export default App;

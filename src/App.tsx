// import { useState } from "react";
import { useEffect } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { Login, Home, Detail, Write, PersonalInfo, SearchList, ClassifyDetail } from "@/components";
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
        {
          path: "search",
          element: <SearchList></SearchList>,
        },
        {
          path: "classify",
          element: <ClassifyDetail></ClassifyDetail>,
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

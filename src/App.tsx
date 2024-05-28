// import { useState } from "react";
import { useEffect } from "react";
import styles from "./App.module.less";
import { Navigate, useRoutes } from "react-router-dom";
import { Login } from "@/components";

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
  ]);
  useEffect(() => {}, []);
  // const [count, setCount] = useState(0);

  return <>{routesList}</>;
};

const App = () => {
  return <Index></Index>;
};

export default App;

import { useEffect, useState } from "react";
import { Kfetch } from "@utils";
const baseUrl = "http://localhost:3000/";

export const useFetch = (url, method, params) => {
  const [data, setData] = useState<Record<string, any>>();

  useEffect(() => {
    Kfetch(`${baseUrl + url}`, {
      method,
      body: JSON.stringify(params),
    }).then((res: any) => setData(res));
  }, [method, params, setData, url]);

  return [data, setData];
};

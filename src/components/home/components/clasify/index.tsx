import { Kfetch } from "@utils";
import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import { MailFilled } from "@ant-design/icons";
export const Classify = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    Kfetch("article/classify").then((res) => {
      if (res.code === 200) {
        setData(res.mapData);
      }
    });
  }, []);
  return (
    <div className={styles.wrap}>
      {data.map((_item: { label: string; value: string }) => {
        return (
          <div className={styles.item} key={Math.random()}>
            <div className={styles.icon}>
              <MailFilled></MailFilled>
            </div>
            <div className={styles.iconText}>{_item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

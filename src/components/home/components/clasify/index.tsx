import { Kfetch } from "@utils";
import { useEffect, useState } from "react";
import styles from "./index.module.less";
import { MailFilled } from "@ant-design/icons";
import { useNavigate } from "react-router";
export const Classify = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    Kfetch("article/classify").then((res) => {
      if (res.code === 200) {
        setData(res.message);
      }
    });
  }, []);
  return (
    <div className={styles.wrap}>
      {data.map((_item: { id: number; classify: string }) => {
        return (
          <div
            className={styles.item}
            key={Math.random()}
            onClick={() => {
              navigate(`/home/classify?tag=${_item.id}`);
            }}
          >
            <div className={styles.icon}>
              <MailFilled></MailFilled>
            </div>
            <div className={styles.iconText}>{_item.classify}</div>
          </div>
        );
      })}
    </div>
  );
};

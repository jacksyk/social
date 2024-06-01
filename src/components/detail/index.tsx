import { Kfetch } from "@utils";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./index.module.less";
import { Card } from "antd";
import ReactHtmlParser from "react-html-parser";
export const Detail = () => {
  const [params] = useSearchParams();
  const [data, setData] = useState<Record<string, any>>({});
  const id = params.get("id");
  console.log(id, "id>>>");

  useEffect(() => {
    Kfetch(`article/find/${id}`).then((res) => {
      if (res.code === 200) {
        setData(res.message);
      }
    });
  }, [id]);

  return (
    <div className={styles.wrap}>
      <div
        className={styles.content}
        style={{
          height: "100%",
        }}
      >
        <Card title={data.articleTitle} bordered={false}>
          {ReactHtmlParser(data.articleContent)}
        </Card>

        <div className={styles.others}>
          <div className={styles.watch}>
            <img src="/watch.png" alt="" />
            <span>{data.watch}</span>
          </div>
          <div className={styles.like}>
            <img src="/likes.png" alt="" />
            <span>{data.like}</span>
          </div>
          <div className={styles.comment}>
            <img src="/comment.png" alt="" />
            <span>{data.comment}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

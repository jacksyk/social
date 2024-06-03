import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.module.less";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Kfetch } from "@utils";
import { Card, Empty } from "antd";
import ReactHtmlParser from "react-html-parser";

export const SearchList = () => {
  const [searchParams] = useSearchParams();
  const articleContent = searchParams.get("search");
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const handleText = useCallback((text: string) => {
    const div = document.createElement("div");
    div.innerHTML = text;
    return div.innerText;
  }, []);

  useEffect(() => {
    Kfetch("article/search", {
      method: "post",
      body: JSON.stringify({
        articleContent,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.code === 200) {
        const { message } = res;
        setList(message);
      }
    });
  }, [articleContent]);
  return (
    <div className={styles.wrapper}>
      {list.length ? (
        <>
          {list.map((_article: any) => {
            return (
              <Card
                title={_article.articleTitle}
                style={{
                  margin: "20px 0",
                  cursor: "pointer",
                }}
                key={Math.random()}
                onClick={() => {
                  navigate(`/home/detail?id=${_article.id}`);
                }}
              >
                <div className={styles.content}>{ReactHtmlParser(handleText(_article.articleContent))}</div>

                <div className={styles.createTime}>创作时间：{_article.createTime}</div>
                {/* <div className={styles.others}>
              <div className={styles.watch}>
                <img
                  src="/watch.png"
                  alt=""
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
                <div className={styles.watchNum}>{_article.watchNum}</div>
              </div>
              <div className={styles.likes}></div>
            </div> */}
              </Card>
            );
          })}
        </>
      ) : (
        <div className={styles.empty}>
          <Empty description="找不到你想要的文章"></Empty>
        </div>
      )}
    </div>
  );
};

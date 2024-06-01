import { Kfetch } from "@utils";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, Spin, message } from "antd";
import styles from "./index.module.less";
import { useNavigate } from "react-router";
import ReactHtmlParser from "react-html-parser";
const pageSize = 5;

export const Article = () => {
  const [article, setArticleData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const loadRef = useRef<HTMLDivElement>(null);

  const [isFinish, setIsFinish] = useState(false);

  const navigate = useNavigate();

  const handleText = useCallback((text: string) => {
    const div = document.createElement("div");
    div.innerHTML = text;
    return div.innerText;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    observer.observe(loadRef.current as Element);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isFinish) return;
    Kfetch(`article/find?page=${page}&pageSize=${pageSize}`).then((res: { message: any[] }) => {
      if (!res.message.length) {
        setIsFinish(true);
        message.error("没有更多数据了");
        return;
      }
      setArticleData((prev: any) => [...prev, ...res.message]);
    });
  }, [isFinish, page]);

  const renderArticle = useMemo(() => {
    return article.map((_article) => {
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
    });
  }, [article, handleText, navigate]);

  return (
    <div>
      {renderArticle}

      {!isFinish && (
        <div className={styles.loadMore} ref={loadRef}>
          <Spin tip="Loading" size="large"></Spin>
        </div>
      )}
    </div>
  );
};

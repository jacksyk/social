import { Kfetch } from "@utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./index.module.less";
import { Button, Card, Drawer, Empty, Input } from "antd";
import ReactHtmlParser from "react-html-parser";

const TextArea = Input.TextArea;
const userId = localStorage.getItem("userId");
export const Detail = () => {
  const [params] = useSearchParams();
  const [data, setData] = useState<Record<string, any>>({});
  const id = params.get("id");
  const [open, setOpen] = useState(false);
  const [commendList, setCommendList] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    Kfetch(`article/find/${id}`).then((res) => {
      if (res.code === 200) {
        setData(res.message);
      }
    });
  }, [id]);

  const handleOpenCommend = useCallback(() => {
    Kfetch(`article/message/${id}`).then((res) => {
      if (res.code === 200) {
        setCommendList(res.message);
        setOpen(true);
      }
    });
  }, [id]);

  const commendLList = useMemo(() => {
    return (
      <>
        {commendList.length > 0 ? (
          <>
            {commendList.reverse().map((_item: any) => {
              return (
                <div className={styles.listItem} key={_item.id}>
                  <div className={styles.itemName}>{_item.userName}</div>
                  <div className={styles.itemContent}>{_item.content}</div>
                  <div className={styles.itemTime}>{_item.createTime}</div>
                </div>
              );
            })}
          </>
        ) : (
          <Empty description="暂无评论"></Empty>
        )}
      </>
    );
  }, [commendList]);

  const handleChange = useCallback((value) => {
    setContent(value.target.value);
  }, []);

  const handleClickBtn = useCallback(() => {
    const body = {
      userId: userId,
      articleId: id,
      message: content,
    };
    Kfetch("article/message", {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.code === 200) {
          window.message.success("评论成功");
          setOpen(false);
        } else {
          window.message.error("评论失败");
        }
      })
      .catch(() => {
        window.message.error("服务器错误");
      });
  }, [content, id]);

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
          {/* <div className={styles.watch}>
            <img src="/watch.png" alt="" />
            <span>{data.watch}</span>
            <div className={styles.after}>{data.wacthNum}</div>
          </div>

          <div className={styles.like}>
            <img src="/likes.png" alt="" />
            <span>{data.like}</span>
            <div className={styles.after}>{data.likes}</div>
          </div> */}
          <div className={styles.comment} onClick={handleOpenCommend}>
            <img src="/comment.png" alt="" />
            <span>{data.comment}</span>
          </div>
        </div>

        <Drawer
          title="评论列表"
          width={500}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <TextArea placeholder={"请输入评论"} value={content} onChange={handleChange}></TextArea>

          <Button
            type="primary"
            style={{
              marginTop: "20px",
            }}
            onClick={handleClickBtn}
          >
            发布评论
          </Button>
          {commendLList}
        </Drawer>
      </div>
    </div>
  );
};

import React from "react";
import { Card, Input } from "antd";
import { Kfetch } from "@utils";
import { storage } from "@utils";
import "./index.module.less";
const Search = Input.Search;

const webSocket = new WebSocket("ws://106.54.20.64:8081/yk/chat");

export const BoilPoint = () => {
  const [data, setData] = React.useState<
    Array<{
      msg: string;
      name: string;
      timme: string;
    }>
  >([]);

  React.useEffect(() => {
    Kfetch(`user/${storage.get("userId")}`).then((res) => {
      if (res.code === 200) {
        webSocket.send(
          JSON.stringify({
            type: "login_request",
            name: res.message.name,
          })
        );
      }
    });
  }, []);

  React.useEffect(() => {
    const message = (event) => {
      console.log(`%c 日志`, "background-color:#e0005a;color:#ffffff;font-weight:bold;padding:4px;", event.data);
      const data = JSON.parse(event.data);
      if (data.type === "msg") {
        setData((prev) => {
          return [...prev, data];
        });
      }
    };

    const open = () => {
      console.log("连接成功");
    };

    webSocket.addEventListener("message", message);
    webSocket.addEventListener("open", open);
    return () => {
      webSocket.removeEventListener("message", message);
      webSocket.removeEventListener("open", open);
    };
  }, []);

  const onSearch = React.useCallback((value: string) => {
    webSocket.send(JSON.stringify({ type: "send_request", msg: value }));
  }, []);
  return (
    <Card
      title="沸点社区，尽情畅聊"
      bordered={false}
      style={{
        margin: "50px 100px",
      }}
    >
      <Search placeholder="畅聊吧" allowClear enterButton="发送" size="large" onSearch={onSearch} />
      {data?.reverse().map((_user: any, _index: number) => {
        return (
          <div
            style={{
              marginTop: "20px",
            }}
            className="wrap"
          >
            <Card
              title={_user.name}
              key={_user.name + _index}
              style={{
                margin: "0 10px",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  color: "red",
                }}
              >
                {_user.msg}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(0,0,0,0.45)",
                }}
              >
                {_user.time}
              </p>
            </Card>
          </div>
        );
      })}
    </Card>
  );
};

import React from "react";
import { Card, Input } from "antd";
import { Kfetch } from "@utils";
import { storage } from "@utils";
import "./index.module.less";
import { useNavigate } from "react-router";
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

  const navigator = useNavigate();

  const [inputValue, setInputValue] = React.useState<string>("");

  React.useEffect(() => {
    Kfetch(`user/${storage.get("userId")}`).then((res) => {
      if (res.code === 200) {
        if (!res.message.name) {
          window.message.error("请先修改名字");
          navigator("/home/info");
          return;
        }
        webSocket.send(
          JSON.stringify({
            type: "login_request",
            name: res.message.name,
          })
        );
      }
    });
  }, [navigator]);

  React.useEffect(() => {
    const message = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "msg") {
        setData((prev) => {
          return [data, ...prev];
        });
      }
      // } else if (data.type === "login_response") {
      //   window.message.error("请先修改名字");
      //   navigator("/home/info");
      // }
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
  }, [navigator]);

  const onSearch = React.useCallback((value: string) => {
    webSocket.send(JSON.stringify({ type: "send_request", msg: value }));
    setInputValue("");
  }, []);

  const renderContent = React.useMemo(() => {
    return (
      <>
        {data?.map((_user: any, _index: number) => {
          return (
            <div
              style={{
                marginTop: "20px",
              }}
              className="wrap"
              key={_user.id}
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
      </>
    );
  }, [data]);
  return (
    <Card
      title="沸点社区，尽情畅聊"
      bordered={false}
      style={{
        margin: "50px 100px",
      }}
    >
      <Search
        placeholder="畅聊吧"
        allowClear
        enterButton="发送"
        size="large"
        onSearch={onSearch}
        value={inputValue}
        onChange={(value) => setInputValue(value.target.value)}
      />
      {renderContent}
    </Card>
  );
};

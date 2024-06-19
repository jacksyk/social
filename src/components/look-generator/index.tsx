import { Card } from "antd";
import { Kfetch } from "@utils";
import React, { useState } from "react";
export const LookGenerator = () => {
  const [message, setMessage] = useState<
    Array<{
      navigatorName: string;
      navigatorUrl: string;
    }>
  >([]);
  React.useEffect(() => {
    Kfetch(`navigator/${localStorage.getItem("userId")}`).then((data) => {
      if (data.code === 200) {
        setMessage(data.message);
      }
    });
  }, []);

  return (
    <div>
      <Card
        title="导航列表"
        style={{
          height: "calc(100vh - 60px)",
        }}
      >
        {message.map((_item) => {
          return (
            <div
              style={{
                cursor: "pointer",
                height: "60px",
              }}
              key={Math.random()}
              onClick={() => {
                const oA = document.createElement("a");
                oA.href = `http://${_item.navigatorUrl}`;
                oA.target = "_blank";
                oA.click();
              }}
            >
              <div>{_item.navigatorName}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

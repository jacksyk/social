import React, { useCallback } from "react";
import styles from "./index.module.less";
import { clsx } from "clsx";

import { Input, Avatar, Button } from "antd";
import { BellFilled } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router";
const Search = Input.Search;
const Tabs = [
  {
    label: "首页",
    value: "home",
    path: "/home/content",
  },
  {
    label: "沸点",
    value: "hotspot",
    path: "/home/content",
  },
];

const Tab = () => {
  const [value, setValue] = React.useState("home");
  const navigate = useNavigate();
  const handleClick = useCallback(
    (path: string, value: string) => {
      setValue(value);
      navigate(path);
    },
    [navigate]
  );
  return (
    <>
      {Tabs.map((_tab) => (
        <div
          className={clsx(styles["tab-item"], _tab.value === value && styles.active)}
          onClick={() => handleClick(_tab.path, _tab.value)}
        >
          {_tab.label}
        </div>
      ))}
    </>
  );
};

export const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.logo}>{/* <img src={} alt="" /> */} 在线交流</div>
          <div className={styles["left-tab"]}>
            <Tab></Tab>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightAvator}>
            <Avatar
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
              onClick={() => {
                navigate("/home/info");
              }}
            ></Avatar>
          </div>
          <div className={styles.notify}>
            <BellFilled
              style={{
                fontSize: "25px",
              }}
            />
          </div>
          <div className={styles.createAuthor}>
            <Button
              type="primary"
              onClick={() => {
                navigate("/home/write");
              }}
            >
              创建文章
            </Button>
          </div>
          <div className={styles.search}>
            <Search
              placeholder="搜索在线交流"
              style={{
                width: "300px",
              }}
            ></Search>
          </div>
        </div>
      </div>
      {<Outlet />}
    </>
  );
};

import React, { useCallback, useContext, useMemo } from "react";
import styles from "./index.module.less";
import { clsx } from "clsx";

import { Input, Avatar, Button, Dropdown, MenuProps, message } from "antd";
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
    path: "/home/boiling",
  },
];

const clickContext = React.createContext<{
  value: string;
  setValue: (value: string) => void;
}>({
  value: "home",
  setValue: () => {},
});

const title = "码届hub";

const Tab = () => {
  const navigate = useNavigate();
  const { value, setValue } = useContext(clickContext);

  const handleClick = useCallback(
    (path: string, value: string) => {
      setValue(value);
      navigate(path);
    },
    [navigate, setValue]
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
  const [value, setValue] = React.useState("home");

  const handleSearch = useCallback(
    (value) => {
      navigate(`/home/search?search=${value}`);
      setValue("others");
    },
    [navigate]
  );

  const items: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: (
          <div
            onClick={() => {
              navigate("/home/info");
              setValue("others");
            }}
          >
            个人中心
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            onClick={() => {
              navigate("/login");
              message.success("退出成功");
              localStorage.clear();
            }}
          >
            退出登录
          </div>
        ),
      },
    ];
  }, [navigate]);
  return (
    <>
      <clickContext.Provider
        value={{
          value,
          setValue: (value: string) => {
            setValue(value);
          },
        }}
      >
        <div className={styles.header}>
          <div className={styles.left}>
            <div
              className={styles.logo}
              onClick={() => {
                navigate("/home/content");
                setValue("home");
              }}
            >
              {/* <img src={} alt="" /> */} {title}
            </div>
            <div className={styles["left-tab"]}>
              <Tab></Tab>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.rightAvator}>
              <Dropdown menu={{ items }}>
                <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"></Avatar>
              </Dropdown>
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
                  setValue("others");
                }}
              >
                创建文章
              </Button>
            </div>
            <div className={styles.search}>
              <Search
                placeholder={`搜索${title}`}
                style={{
                  width: "300px",
                }}
                onSearch={handleSearch}
              ></Search>
            </div>
          </div>
        </div>
      </clickContext.Provider>

      {<Outlet />}
    </>
  );
};

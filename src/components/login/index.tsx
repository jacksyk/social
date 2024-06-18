import { useCallback, useMemo, useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, Tag, message } from "antd";
import styles from "./index.module.less";
import { Kfetch, storage } from "@utils";
import { LoginType } from "@/types";
import { useLocation, useNavigate } from "react-router";
interface FieldType {
  username?: string;
  password?: string;
  email?: string;
  code?: string;
}

/**
 * 发送验证码
 * @param email 邮箱
 */
const sendCode = (email: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    Kfetch(`email/send?address=${email}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then(resolve)
      .catch(reject);
  });
};

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false); // 是否在注册状态
  const [isSendCode, setIsSendCode] = useState(false);
  const location = useLocation();
  console.log(`%c 日志`, "background-color:#e0005a;color:#ffffff;font-weight:bold;padding:4px;", location);
  const navigate = useNavigate();
  const onFinish = useCallback(
    async (values) => {
      const { password, username, email, code } = values;
      // 在注册的时候，发送验证码
      if (!isSendCode && isRegister) {
        const data = await sendCode(email);
        if (data.code === 200) {
          message.success("验证码发送成功");
          setIsSendCode(true);
        } else {
          message.error(data.message);
        }
      } else {
        try {
          const body = {
            username,
            password,
            email,
            verifyCode: code,
          };
          const request = isRegister ? "user/register" : "user/login";
          const data = await Kfetch(`${request}`, {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            method: "post",
          });
          if ((data as LoginType).code === 200) {
            storage.set("token", data.token);
            storage.set("userId", data.userId);
            message.success(isRegister ? "注册成功" : "登录成功");
            if (isRegister) {
              setIsRegister(false);
              setIsSendCode(false);
              return;
            }
            navigate("/home/content");
            return;
          }
          message.error(data.message);
        } catch (e) {
          console.warn(e);
          message.error("网络错误请重试");
        }
      }
    },
    [isRegister, isSendCode, navigate]
  );

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = useCallback(() => {
    message.error("输入账号或者密码");
  }, []);

  const btnText = useMemo(() => {
    if (isRegister && isSendCode) {
      return "注册";
    }
    if (isRegister && !isSendCode) {
      return "发送验证码";
    }
    return "登录";
  }, [isRegister, isSendCode]);

  const tagText = useMemo(() => {
    return isRegister ? "返回登录" : "立即注册";
  }, [isRegister]);

  return (
    <div className={styles.content}>
      <div className={styles.wrap}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType> label="账号" name="username" rules={[{ required: true, message: "请输入你的账号！" }]}>
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="密码" name="password" rules={[{ required: true, message: "请输入你的密码!" }]}>
            <Input.Password />
          </Form.Item>

          {isRegister && (
            <Form.Item<FieldType> label="邮箱地址" name="email" rules={[{ required: true, message: "请输入你的邮箱地址!" }]}>
              <Input />
            </Form.Item>
          )}

          {isSendCode && isRegister && (
            <Form.Item<FieldType> label="验证码" name="code" rules={[{ required: true, message: "请输入你的验证码!" }]}>
              <Input />
            </Form.Item>
          )}

          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{
              position: "relative",
            }}
          >
            <Button type="primary" htmlType="submit">
              {btnText}
            </Button>
            <div
              onClick={() => setIsRegister((prev) => !prev)}
              style={{
                cursor: "pointer",
              }}
            >
              <Tag
                bordered={false}
                color="processing"
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "-32px",
                  transform: "translateX(-50%)",
                }}
              >
                {tagText}
              </Tag>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

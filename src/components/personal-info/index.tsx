import { useCallback, useEffect, useRef } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, FormInstance, message } from "antd";
import styles from "./index.module.less";
import { Kfetch } from "@utils";
type FieldType = {
  username?: string;
  password?: string;
  name?: string;
  age?: number;
  email?: string;
};

const userId = localStorage.getItem("userId");

export const PersonalInfo = () => {
  const ref = useRef<FormInstance>(null);

  const onFinish: FormProps<FieldType>["onFinish"] = useCallback((values) => {
    const { age, email, name, username, password } = values;
    const obj = {
      userId: Number(userId),
      name,
      age: Number(age),
      email,
      username,
      password,
    };
    Kfetch("user/modify", {
      method: "post",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.code === 200) {
          message.success("修改成功");
        } else {
          message.error("修改失败");
        }
      })
      .catch(() => message.error("服务器错误"));
  }, []);

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = useCallback((errorInfo) => {
    console.log("Failed:", errorInfo);
  }, []);

  useEffect(() => {
    if (userId) {
      Kfetch(`user/${userId}`).then((res) => {
        console.log(res);
        const message = res.message;
        if (res.code === 200) {
          const obj = {
            name: message.name,
            age: message.age,
            email: message.email,
            username: message.username,
            password: message.password,
          };
          ref.current?.setFieldsValue(obj);
        }
      });
    }
  }, []);

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className={styles.wrap}
      ref={ref}
    >
      <Form.Item<FieldType> label="账号" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
        <Input disabled />
      </Form.Item>

      <Form.Item<FieldType> label="密码" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType> label="姓名" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
        <Input />
      </Form.Item>

      <Form.Item<FieldType> label="年龄" name="age" rules={[{ required: true, message: "Please input your age!" }]}>
        <Input />
      </Form.Item>

      <Form.Item<FieldType> label="邮箱" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          修改信息
        </Button>
      </Form.Item>
    </Form>
  );
};

import { Kfetch } from "@utils";
import { Button, Form, FormProps, Input, message } from "antd";
type FieldType = {
  navigatorName?: string;
  navigatorUrl?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  // console.log("Success:", values);
  const { navigatorName, navigatorUrl } = values;
  const body = JSON.stringify({
    navigatorName,
    navigatorUrl,
    userId: localStorage.getItem("userId"),
  });
  Kfetch("navigator", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body,
  }).then((res) => {
    if (res.code === 200) {
      message.success("添加成功");
    }
  });
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export const CreateGenerator = () => {
  return (
    <div
      style={{
        margin: "200px auto 0",
        width: "fit-content",
      }}
    >
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
        <Form.Item<FieldType> label="导航名" name="navigatorName" rules={[{ required: true, message: "请输入你的导航名" }]}>
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="导航链接" name="navigatorUrl" rules={[{ required: true, message: "请输入你的链接地址" }]}>
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            创建导航
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

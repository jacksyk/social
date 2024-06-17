import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import styles from "./index.module.less";
import { Button, Modal, Input, message, Select } from "antd";
import { Kfetch } from "@utils";
import { storage } from "@utils";
import { useNavigate } from "react-router";
// import { Kfetch } from "@utils";
function MyEditor() {
  const navigator = useNavigate();
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法
  // 编辑器内容
  const [html, setHtml] = useState("");
  // 文章标题
  const [title, setTitle] = useState("");
  // 模态框展示与否
  const [isShowModal, setIsShowModal] = useState(false);
  // 文章分类
  const [classify, setClassify] = useState("");

  const [data, setData] = useState([]);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const showRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Kfetch("article/classify").then((res) => {
      if (res.code === 200) {
        setData(res.message);
      }
    });
  }, []);

  // todo：回显数据，数据请求之后
  useEffect(() => {
    // setTimeout(() => {
    //   setHtml("<p>hello world</p>");
    // }, 1500);
  }, []);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
  };
  // 发布文章
  const publishArticle = useCallback(() => {
    setIsShowModal(true);
  }, []);

  const handleOk = useCallback(async () => {
    const body = {
      articleContent: html,
      userId: storage.get("userId"),
      articleTitle: title,
      articleImage: "",
      classify: Number(classify),
    };
    console.log(body);
    try {
      const response = await Kfetch("article", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.code === 200) {
        message.success("发布成功");
        setIsShowModal(false);
        navigator("/home/content");

        return;
      }
      message.error("发布失败");
    } catch (err) {
      message.error("服务器错误");
    }
  }, [classify, html, navigator, title]);

  const handleCancel = useCallback(() => {
    setIsShowModal(false);
  }, []);

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  React.useLayoutEffect(() => {
    if (editorRef.current) {
      const { height } = editorRef.current.getBoundingClientRect();
      if (showRef.current) {
        showRef.current.style.height = `${height}px`;
      }
    }
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
        }}
      >
        <div style={{ border: "1px solid #ccc", zIndex: 100, flex: 1 }} ref={editorRef}>
          <Toolbar editor={editor!} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: "1px solid #ccc" }} />
          <Editor
            defaultConfig={editorConfig}
            value={html}
            onCreated={setEditor}
            onChange={(editor) => setHtml(editor.getHtml())}
            mode="default"
            style={{ height: "500px", overflowY: "hidden" }}
          />
        </div>

        {/* 展示区域 */}
        <div
          style={{
            flex: 1,
            flexShrink: 0,
            padding: "20px",
          }}
          ref={showRef}
          className={styles["show-wrapper"]}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            预览区域
          </div>
          <div
            className={styles.show}
            dangerouslySetInnerHTML={{
              __html: html,
            }}
            style={{
              marginTop: "20px",
              fontSize: "16px",
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          type="primary"
          style={{
            width: "40%",
            margin: "30px auto",
          }}
          onClick={publishArticle}
        >
          发布文章
        </Button>
      </div>
      <Modal
        title="请输入标题"
        open={isShowModal}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="取消发布"
        okText="发布文章"
        okType="primary"
        styles={{
          footer: {
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          },
        }}
      >
        <Input
          placeholder="请输入标题"
          value={title}
          allowClear
          onChange={(value) => {
            setTitle(value.target.value);
          }}
        />

        <Select
          onChange={(value) => {
            console.log(value);
            setClassify(value);
          }}
          placeholder="请输入文章的类别"
          style={{
            marginTop: "20px",
          }}
        >
          {data.map((_item: any) => {
            return <Select.Option value={_item.id}>{_item.classify}</Select.Option>;
          })}
        </Select>
      </Modal>
    </>
  );
}

export default MyEditor;

import MyEditor from "@/components/editor";
import styles from "./index.module.less";
export const Write = () => {
  return (
    <div className={styles.editorWrapper}>
      <MyEditor />
    </div>
  );
};

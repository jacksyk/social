import React from "react";
import { Row, Col } from "antd";
import { Classify } from "../clasify";
import { Article } from "../article";
import styles from "./index.module.less";
export const Content = () => {
  return (
    <div className={styles.wrap}>
      <Row gutter={20}>
        <Col className="gutter-row" span={6}>
          <div className={styles.classify}>
            <Classify></Classify>
          </div>
        </Col>
        <Col className="gutter-row" span={18}>
          <div>
            <Article></Article>
          </div>
        </Col>
      </Row>
    </div>
  );
};

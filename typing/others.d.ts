import { type message } from "antd";
declare module "vite-plugin-eslint" {
  export default "viteEslint";
}
declare global {
  interface Window {
    message: message;
  }
}

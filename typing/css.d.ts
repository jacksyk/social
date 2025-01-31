type CSSModuleClasses = { readonly [key: string]: string };

declare module "*.module.less" {
  const styles: CSSModuleClasses;
  export default styles;
}

declare module "*.css";

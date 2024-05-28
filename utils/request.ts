import { isEmpty } from "lodash";
/**
 * 自定义网络请求库
 */
type FunctionType<T> = (config: T) => Response;
type BaseUrlType = {
  baseUrl?: string;
};

const beforeRequestFunctionList: FunctionType<ConfigType>[] = []; // 请求前存放的callback
const beforeResponseFunctionList: FunctionType<ResponseInit>[] = []; // 请求后存放的callback
let baseConfig: BaseUrlType = {};

export type ConfigType = RequestInit;

/**
 *
 * @param input 输入参数
 * @param init 初始化config
 */
export const Kfetch = (input, config: ConfigType = {}): Promise<any> => {
  if (isEmpty(config)) {
    config.method = "Get";
  }

  // notice 拦截请求的拦截处理函数集合;
  beforeRequestFunctionList.forEach((cb) => (config = cb?.(config)));

  // console.log(config, "config", input);

  return new Promise((resolve, reject) => {
    fetch(`${baseConfig.baseUrl}${input}`, config)
      .then(async (res) => {
        for (const cb of beforeResponseFunctionList) {
          res = await cb?.(res);
        }
        return res;
      })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * 拦截器
 */
export const interceptors = {
  request: {
    use: (cb: FunctionType<ConfigType>) => {
      beforeRequestFunctionList.push(cb);
    },
  },
  response: {
    use: (cb: FunctionType<ResponseInit>) => {
      beforeResponseFunctionList.push(cb);
    },
  },
};

/**
 * 对外暴露一个create方法，用来初始化baseUrl
 */
export const create = (config: BaseUrlType) => {
  baseConfig = Object.assign(baseConfig, config);
};

import axios from "axios";

// 实例
const request = axios.create({
    // 接口
    baseURL: '/api',
    // 设置超时
    timeout: 50000
});

// 请求拦截
request.interceptors.request.use(
    (config)=>{
        const token = sessionStorage.getItem('token');
        if(token){
            config.headers['token'] = token;
        }
        return config;
    },
    (err)=>{
        console.error(err);
        return Promise.reject(err);
    }
);

// 相应拦截
request.interceptors.response.use(
    (res)=>{
        return res;
    },
    (err)=>{
        if(err?.response){
            const status = err.response.status;
            console.error(status);
        }else{
            const errorStr = JSON.stringify(err);
            if(errorStr.includes("timeout")){
                console.error("服务器响应超时，请刷新页面");
            }else{
                console.error("服务器响应失败");
            }
        }
        return Promise.reject(err);
    }
);

export default request;
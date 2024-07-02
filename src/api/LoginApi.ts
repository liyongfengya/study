import request from "../utils/request";
// import { testDatas } from "../datas/TestData";

export namespace LoginApi{
    // 列表查询
    export function query(userName: string, password: string){
        return request({
            url: '/systerm/login',
            method: 'post',
            data: { userName, password }
        });
    }
}
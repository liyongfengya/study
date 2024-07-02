import request from "../utils/request";

export namespace TestApi{
    // 列表查询
    export function list(){
        return request({
            url: '/test/list',
            method: 'get'
        });
    }
    // 单项查询
    export function info(id: string){
        return request({
            url: '/test/info',
            method: 'get',
            params: { id }
        });
    }
    // 保存
    export  function save(data: any){
        return request({
            url: '/test/save',
            method: 'post',
            data: data
        });
    }
    // 更新
    export function update(id: string, data: any){
        return request({
            url: '/test/update',
            method: 'post',
            data: {
                ...data,
                id: id
            }
        });
    }
    // 删除
    export function del(id: string){
        return request({
            url: '/test/delete',
            method: 'post',
            data: { id }
        });
    }
}
import request from "../utils/request";

export namespace UserApi{
    // 列表查询
    export function list(){
        return request({
            url: '/user/list',
            method: 'get'
        });
    }
    // 单项查询
    export function info(id: string){
        return request({
            url: '/user/info',
            method: 'get',
            params: { id }
        });
    }
    // 单项查询
    export function infoByName(name: string){
        return request({
            url: '/user/infoByName',
            method: 'get',
            params: { name }
        });
    }
    // 保存
    export  function save(data: any){
        return request({
            url: '/user/save',
            method: 'post',
            data: data
        });
    }
    // 更新
    export function update(id: string, data: any){
        return request({
            url: '/user/update',
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
            url: '/user/delete',
            method: 'post',
            data: { id }
        });
    }
}
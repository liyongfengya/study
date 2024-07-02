import * as _ from "lodash";

// 用户列表
export class UserListItem{
    public id: string = "";
    public name: string = "";
    public age: number = 18;
    public address: string = "";
    public authority: Identify = Identify.tourist;
}

// 用户身份
export enum Identify{
    unknow = 0,
    admin = 1, // 所有权限
    developers = 2,
    tourist = 3,
    customer = 4,
}
export const Identify_Enum2Str: { [key in Identify]: string } = {
    [Identify.unknow]:      "未知",
    [Identify.admin]:       "管理员",
    [Identify.developers]:  "开发人员",
    [Identify.tourist]:     "游客",
    [Identify.customer]:    "客户"
}
export const Identify_Str2Enum: {[key: string]: Identify} = _.mapValues(_.invert(Identify_Enum2Str), (v: any) => parseInt(v));

// 读写权限
export enum ReadAndWrite{
    all = 0,
    read = 1,
    readAndWrite = 2
}

export const ReadAndWrite_Enum2Str: { [key in ReadAndWrite]: string } = {
    [ReadAndWrite.all]:             "全权限",
    [ReadAndWrite.read]:            "只读",
    [ReadAndWrite.readAndWrite]:    "读和写"
}
export const ReadAndWrite_Str2Enum: {[key: string]: ReadAndWrite} = _.mapValues(_.invert(ReadAndWrite_Enum2Str), (v: any) => parseInt(v));

// 用户权限
export class UserAuthority{
    public identity: Identify = Identify.unknow;
    public readAuthority: ReadAndWrite = ReadAndWrite.all;
    public mennus: number[] = [1, 2, 3, 4];
}

// 用户详情
export class UserInfo{
    /**
     * id
     */
    public id: string = "";
    /**
     * 姓名
     */
    public name: string = "";
    /**
     * 年龄
     */
    public age: number = 18;
    /**
     * 地址
     */
    public address: string = "";
    /**
     * 电话
     */
    public phone: string = "";
    /**
     * 权限
     */
    public authority: UserAuthority | undefined = undefined;
    /**
     * 账号
     */
    public account: string = "";
    /**
     * 密码
     */
    public password: string = "";
}
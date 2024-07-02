import Mock from 'mockjs';

Mock.setup({
    timeout: '200-600'
});

// 登录
Mock.mock('/api/systerm/login', 'post', (options: any)=>{
    const body: { userName: string, password: string } = JSON.parse(options.body);
    if(!body.password || !body.userName){
        return null;
    }else{
        return {
            code: 200,
            message: 'success' 
        }
    }
});


// 用户
Mock.mock('/api/user/list', 'get', {
    'data|10-20': [
        {
            'id|+1': 1,
            'name': '@cname',
            'age': '@integer(16, 60)',
            'address': '@county()',
            'authority': '@integer(0, 4)',
        }
    ],
    code: 200,
    message: 'success'
});
Mock.mock(/\/api\/user\/info/, 'get', {
    'data': {
        id: '@id()',
        name: '@cname',
        age:  '@integer(16, 60)',
        address: '@county()',
        phone: "1853171311",
        'authority': {
            identity: '@integer(0, 4)',
            readAuthority: '@integer(0, 2)',
            'mennus|2-4': ['@integer(1, 8)'],
        },
        account: '@word(6, 8)',
        password : '@word(6, 8)'
    },
    code: 200,
    message: 'success'
});
Mock.mock(/\/api\/user\/infoByName\?name=*/, 'get', {
        'data': [{
            id: '@id()',
            name: '@cname',
            age: '@integer(16, 60)',
            address: '@county()',
            phone: "1853171311",
            authority: '@integer(0, 4)',
            account: '@word(6, 8)',
            password: '@word(6, 8)'
        }],
        code: 200,
        message: 'success'
});
Mock.mock('/api/user/save', 'post', {
    data: null,
    code: 200,
    message: 'success'
});
Mock.mock('/api/user/update', 'post', {
    data: null,
    code: 200,
    message: 'success'
});
Mock.mock('/api/user/delete', 'post', {
    data: null,
    code: 200,
    message: 'success'
});

export default Mock;
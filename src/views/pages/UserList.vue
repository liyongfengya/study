<template>
    <div>
        <el-card>
            <el-input v-model="searchForm.name" class="user_search" style="width: 440px;" placeholder="请输入用户姓名" @clear="searchUser">
                <template #append>
                    <el-button :icon="Search" @click="searchUser" />
                </template>
            </el-input>
            <el-table v-loading="loading" :data="userList" border style="width: 100%;margin-top: 20px;">
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column prop="age" label="年龄" width="180" />
                <el-table-column prop="address" label="地址" width="180" />
                <el-table-column label="权限" width="180">
                    <template #default="scope">
                        <span>{{ Identify_Enum2Str[scope.row.authority] }}</span>
                    </template>
                </el-table-column> />
                <el-table-column label="操作" width="330">
                    <template #default="scope">
                        <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
                        <el-button size="small" @click="detailUser(scope.row.id)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination style="margin-top: 20px;"
             :current-page="searchForm.current"
             :page-size="searchForm.pageSize"
             :page-sizes="[10,20,30,40,50,100]"
             layout="->,total,sizes,prev,pager,next,jumper"
             :total="searchForm.total"
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
            />
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserListItem, Identify_Enum2Str } from "../../datas/UserData";
import { UserApi } from "../../api/UserApi";
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

const searchForm = reactive({
    name: '',
    current: 1,
    pageSize: 20,
    total: 0,
});
const loading = ref(true);
const userList = ref<Array<UserListItem>>([]);

const router = useRouter();

const searchUser = async ()=>{
    // search api
    loading.value = true;
    const { data } = await UserApi.infoByName(searchForm.name);
    userList.value = data.data;
    userList.value
    loading.value = false;
};
const deleteUser = async (id: string)=>{
    // delete api
    console.log(id)
    const data = await UserApi.del(id);
    if(data){
        ElMessage.success("删除成功");
        fetch();
    }else{
        ElMessage.success("删除失败");
    }
};
const detailUser = async (id: string)=>{
    router.push({path: '/user/detail', query: { id }});
};

const handleSizeChange = (size: number)=> {
    searchForm.pageSize = size;
    fetch();
}
const handleCurrentChange = (current: number)=> {
    searchForm.current = current;
    fetch();
}

const fetch = async ()=>{
    // page api
    loading.value = true;
    const { data } = await UserApi.list();
    Object.assign(userList.value, data.data);
    loading.value = false;
};

onMounted(async ()=> await fetch());

</script>
<style scoped>
</style>
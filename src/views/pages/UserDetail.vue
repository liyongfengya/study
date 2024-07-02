<template>
    <div>
        <el-card>
            <el-tabs
              v-model="tabsData.activeName"
              editable
              class="details-tabs"
              type="card"
              @tab-add="tabAddFunc"
              @tab-remove="tabRemoveFunc"
              @tab-click="handleClick"
            >
                <template #addIcon>
                    <el-tooltip class="box-item" effect="dark" content="更新" placement="bottom">
                        <el-icon><Check /></el-icon>
                    </el-tooltip>
                </template>
                <el-tab-pane label="详情" name="details">
                    <el-form v-model="user">
                        <el-form-item label="姓名">
                            <el-input class="detail_input" v-model="user.name" type="text" placeholder="" disabled />
                        </el-form-item>
                        <el-form-item label="年龄">
                            <el-input class="detail_input" v-model="user.age" type="text" placeholder="" disabled />
                        </el-form-item>
                        <el-form-item label="地址">
                            <el-input class="detail_input" v-model="user.address" type="text" placeholder="" disabled />
                        </el-form-item>
                        <el-form-item label="电话">
                            <el-input class="detail_input" v-model="user.phone" type="text" placeholder="" disabled />
                        </el-form-item>
                        <el-form-item label="权限">
                            <el-input class="detail_input" :value="computeAuthority(user)" type="text"
                                style="width: 25%;" placeholder="" disabled />
                            <el-button type="primary" size="small" style="margin: 20px;" plain
                                @click="setShowAuthority">权限管理</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane v-if="tabsData.showAuthority" label="权限" name="authority">
                    <Authority ref="auth" :authority="user.authority!" />
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Check } from '@element-plus/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import { UserInfo } from "../../datas/UserData";
import { UserApi } from "../../api/UserApi";
import Authority from "./Authority.vue";
import { Identify_Enum2Str } from "../../datas/UserData";
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

const user = ref<UserInfo>(new UserInfo());
const tabsData = reactive({
    activeName: 'details',
    showAuthority: false,
});
const auth = ref<InstanceType<typeof Authority>>();

const handleClick = ()=>{};
const setShowAuthority = ()=>{
    tabsData.showAuthority = true;
    tabsData.activeName = 'authority';
};
const tabAddFunc = async ()=>{
    user.value.authority = auth.value?.editData;
    try{
        await UserApi.update(user.value.id, user);
        ElMessage.success("更新成功");
    }catch(err){
        console.error("更新用户信息错误:", err);
    }
}
const tabRemoveFunc = (name: string)=>{
    if(name === 'authority'){
        tabsData.showAuthority = false;
        tabsData.activeName = 'details';
    }else{
        router.go(-1)
    }
}


const fetch = async ()=>{
    // info api
    const id = route.query.id;
    const { data } = await UserApi.info(id as any);
    Object.assign(user.value, data.data);
}

const computeAuthority = (item: UserInfo)=>{
    return item.authority && item.authority.identity !== null && item.authority.identity !== undefined ? Identify_Enum2Str[item.authority.identity] : '';
}

onMounted(async () => {
    await fetch();
})

</script>
<style scoped>
.detail_input{
    width: 50%;
}
</style>
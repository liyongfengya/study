<template>
    <div class="authority_container">
        <el-form ref="formRef" v-model="state.user" label-width="auto"> 
            <el-form-item label="用户身份">
                <el-select v-model="state.user.identity" placeholder="请选择">
                    <el-option v-for="key in Object.keys(Identify_Enum2Str)" :label="Identify_Enum2Str[key]" :value="key" />
                </el-select>
            </el-form-item>
            <el-form-item label="用户权限">
                <el-radio-group v-model="state.user.readAuthority">
                    <el-radio v-for="key in Object.keys(ReadAndWrite_Enum2Str)" :label="parseInt(key)">{{ ReadAndWrite_Enum2Str[key] }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="可用模块">
                <el-input v-model="state.user.mennus" placeholder="" />
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import { UserAuthority, Identify_Enum2Str, Identify_Str2Enum, ReadAndWrite_Enum2Str, ReadAndWrite } from "../../datas/UserData"

interface AuthorityTmpData{
    identity: string;
    readAuthority: number;
    mennus: number[];
}

 const props = defineProps<{
    authority: UserAuthority
 }>();

 const state = reactive({
    user: <AuthorityTmpData>{}
 });

 watch(()=>{
    return props.authority;
 }, ()=>{
    state.user.identity = Identify_Enum2Str[props.authority.identity];
    state.user.readAuthority = props.authority.readAuthority;
    state.user.mennus = props.authority.mennus;
 },{
    immediate: true,
    deep: true,
 });
 const editData = computed(()=>{
    const data: UserAuthority = new UserAuthority();
    data.identity = Identify_Str2Enum[state.user.identity];
    data.readAuthority = state.user.readAuthority;
    data.mennus = state.user.mennus;
    return data;
 });

 defineExpose({ editData });
 
</script>
<style scoped>
.authority_container{
    width: 100%;
    height: 100%;
}
</style>

import { Module } from "vuex/types/index.js";
import { RoutesListState, RootStateTypes } from "../interface";

const routerListStore: Module<RoutesListState, RootStateTypes> = {
    namespaced: true,
    state: {
        routesList: []
    },
    mutations: {
        SET_ROUTER_LIST: (state: any, data: Array<any>)=>{
            state.routerList = data;
        }
    },
    actions: {
        // @ts-ignore
        setRouterList: ({ commit }, data: Array<any>)=>{
            commit('SET_ROUTER_LIST', data);
        }
    }
}

export default routerListStore;
import { getStaffMenu } from "@/api/menu"
const state = {
    //员工菜单列表
    menuList: [
        {
            id: 0,
            code: 'home',
            name: '首页',
            icon: 's-home',
            path: '/home',
            children: []
        }
    ]
}
const actions = {
    async getMenuList({ commit }) {
        const staff = JSON.parse(localStorage.getItem("staff"));
        if (staff) {
            let res = await getStaffMenu(staff.id);
            if (res.code == 200) {
                commit("GET_MENULIST", res.data);
            }
        }
    }
}
const mutations = {
    GET_MENULIST(state, menuList) {
        state.menuList = menuList;
    }
}
export default {
    state, actions, mutations
}
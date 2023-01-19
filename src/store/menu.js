import { getStaffMenu } from "@/api/menu"
import router from "@/router"
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
    ],
    asyncRoutes: {}
}
const actions = {
    async getMenuList({ commit, state }) {
        const staff = JSON.parse(localStorage.getItem("staff"));
        if (staff) {
            let res = await getStaffMenu(staff.id);
            if (res.code == 200) {
                commit("GET_MENULIST", res.data);
                //设置动态路由
                commit("SET_ROUTES", getAsyncRoutes(state.menuList));
            }
        }
    }
}
//计算动态路由
const getAsyncRoutes = (menuList) => {
    let asyncRoutes = {
        path: "/",
        name: "main",
        redirect: '/home',
        component: () => import('../views/Main.vue'),
        children: []
    };
    menuList.forEach(menu => {
        let route = {
            path: menu.code,
            name: menu.code,
            component: () => import(`../views/${menu.code}`),
            children: []
        };
        //有子菜单
        if (menu.children) {
            menu.children.forEach(subMenu => {
                let subRoute = {
                    path: subMenu.code,
                    name: subMenu.code,
                    component: () => import(`../views/${menu.code}/${subMenu.code}`)
                };
                route.children.push(subRoute);
            })
        }
        asyncRoutes.children.push(route);
    })
    console.log("asyncRoutes：", asyncRoutes);
    return asyncRoutes;
}

const mutations = {
    GET_MENULIST(state, menuList) {
        menuList.forEach(menu => {
            state.menuList.push(menu);
        });
    },
    SET_ROUTES(state, asyncRoutes) {
        state.asyncRoutes = asyncRoutes;
        router.addRoute(asyncRoutes);
        console.log(router.getRoutes());
    },
    //清除菜单列表
    CLEAR_MENU(state) {
        state.menuList = [
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
}
export default {
    state, actions, mutations
}
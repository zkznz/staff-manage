import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//设置动态路由
const setDynamicRoute = (menuList) => {
  let currentRoute = routes.filter(item => item.name == 'main');
  if (currentRoute.length == 0) {
    let dynamicRoute = {
      path: '/',
      name: 'main',
      redirect: '/home',
      component: () => import('../views/Main.vue'),
      children: []
    };
    menuList.forEach(menu => {
      let route = {
        path: menu.code,
        name: menu.code,
        component: () => import('../views/' + menu.code),
        children: []
      };
      //有子菜单
      if (menu.children) {
        menu.children.forEach(subMenu => {
          let subRoute = {
            path: subMenu.code,
            name: subMenu.code,
            component: () => import('../views/' + subMenu.code)
          }
          route.children.push(subRoute);
        })
      }
      dynamicRoute.children.push(route);
    })
    console.log("dynamicRoute", dynamicRoute);
    //添加到路由
    setTimeout(() => {
      router.addRoute(dynamicRoute);
    }, 300)
  }
}

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  //没有token返回登录页
  // if (to.matched.length == 0) {
  //   console.log("1");
  //   if (token && to.path != '/login') {
  //     if (store.state.menu.menuList.length <= 1) {
  //       store.dispatch("getMenuList");
  //       setDynamicRoute(store.state.menu.menuList);
  //       next();
  //     }
  //     next();
  //   }
  //   else {
  //     console.log(to.name);
  //     if (to.name === 'login')
  //       next();
  //     else next('/login')
  //   }
  // }
  if (token && to.path != '/login') {
    if (store.state.menu.menuList.length <= 1) {
      await store.dispatch("getMenuList");
      setTimeout(() => {
        setDynamicRoute(store.state.menu.menuList);
      }, 300)
      setTimeout(() => {
        next();
      }, 800);
    }
    next();
  }
  else {
    if (to.path == '/login')
      next();
    else
      next('/login');
  }
})
export default router

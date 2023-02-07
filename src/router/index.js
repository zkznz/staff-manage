import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

// 解决当重复跳转一个路由的报错问题
// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    redirect: '/home',
    component: () => import('../views/Main.vue'),
    children: []
  },
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

// 重置路由
export const resetRouter = () => {
  router.matcher = new VueRouter({
    mode: 'history', routes
  })
}

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  //没有token返回登录页
  if (token) {
    if (store.state.menu.menuList.length <= 1) {
      await store.dispatch("getMenuList");
      next({ ...to, replace: true });
    }
    else if (to.path == "/login") {
      next("/");
    }
    else
      next();
  }
  else {
    if (to.path == '/login') {
      next();
    }
    else
      next('/login');
  }
})
export default router

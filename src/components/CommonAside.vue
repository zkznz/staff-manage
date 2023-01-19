<template>
    <div>
        <el-menu background-color="#333744" :collapse="isCollapse" text-color="#fff" active-text-color="#409EFF" router
            :unique-opened="true" :default-active="$route.path" :collapse-transition="false">
            <el-menu-item v-for="menu in noChildren" :index="menu.path" :key="menu.path" @click="clickMenu(menu)">
                <i :class="`el-icon-${menu.icon}`"></i>
                <span slot="title">{{ menu.name }}</span>
            </el-menu-item>
            <el-submenu v-for="menu in hasChildren" :index="menu.path" :key="menu.path">
                <template slot="title">
                    <i :class="`el-icon-${menu.icon}`"></i>
                    <span>{{ menu.name }}</span>
                </template>
                <el-menu-item v-for="subMenu in menu.children" :index="menu.path + subMenu.path" :key="subMenu.path"
                    @click="clickMenu(subMenu)">
                    <i :class="`el-icon-${subMenu.icon}`"></i>
                    <span slot="title">{{ subMenu.name }}</span>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>

</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'CommonAside',
    data() {
        return {
            isCollapse: false
        };
    },
    computed: {
        ...mapState({ menuList: state => state.menu.menuList }),
        hasChildren() {
            return this.menuList.filter(item => item.children.length > 0);
        },
        noChildren() {
            return this.menuList.filter(item => item.children.length == 0);
        }
    },
    methods: {
        clickMenu(menu) {
            this.$store.commit("ADD_TAG", menu);
        }
    },
    mounted() {
        this.$bus.$on("collapsed", () => {
            this.isCollapse = !this.isCollapse;
        })
    }
};
</script>
<style  scoped>
.el-menu {
    border-right: none;
    height: 100vh;
}



.el-menu-item {
    min-width: 200px;
}
</style>
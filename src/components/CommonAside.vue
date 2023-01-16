<template>
    <div>
        <el-menu>
            <el-menu-item>
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-sunmenu>
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>导航一</span>
                </template>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                </el-menu-item>
            </el-menu-sunmenu>
        </el-menu>
    </div>

</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'CommonAside',
    data() {
        return {
        };
    },
    computed: {
        ...mapState({ menuList: state => state.menu.menuList }),
        hasChildren() {
            return this.menuList.filter(item => item.children);
        },
        noChildren() {
            return this.menuList.filter(item => !item.children);
        }
    },
    methods: {},
};
</script>
<style  scoped>

</style>
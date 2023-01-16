<template>
    <div>
        <el-container>
            <el-aside width="auto">
                <CommonAside />
            </el-aside>
            <el-container>
                <el-header>Header</el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script>
import CommonAside from "../components/CommonAside.vue"
export default {
    name: 'Main',
    components: { CommonAside },
    data() {
        return {
        };
    },
    methods: {},
};
</script>
<style  scoped>
.el-aside {
    min-width: 200px;
}
</style>
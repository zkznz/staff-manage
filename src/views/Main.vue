<template>
    <div>
        <el-container>
            <el-aside width="auto">
                <CommonAside />
            </el-aside>
            <el-container>
                <el-header>
                    <CommonHeader />
                </el-header>
                <CommonTag />
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script>
import CommonAside from "../components/CommonAside.vue"
import CommonHeader from "@/components/CommonHeader.vue";
import CommonTag from "@/components/CommonTag.vue";
export default {
    name: 'Main',
    components: { CommonAside, CommonHeader, CommonTag },
    data() {
        return {
        };
    },
    methods: {},
};
</script>
<style  scoped>
.el-header {
    background-color: #333333;
    padding: 0;
}

CommonTag {
    margin-left: 20px;
}

/*清除滚动条*/
.el-aside::-webkit-scrollbar {
    display: none;
}
</style>
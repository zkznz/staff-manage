<template>
    <div>
        <el-tag v-for=" (tag, index) in tagList" :key="tag.code" size="small" :closable="tag.code !== 'home'"
            :effect="$route.name == tag.code ? 'dark' : 'plain'" :disable-transitions="false"
            @close="handleClose(tag, index)" @click="clickTag(tag)">
            {{ tag.name }}
        </el-tag>
    </div>

</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'CommonTag',
    data() {
        return {
        };
    },
    computed: {
        ...mapState({ tagList: state => state.tag.tagList }),
    },
    methods: {
        handleClose(tag, index) {
            let maxIndex = this.tagList.length - 1;
            //最右侧标签高亮并且关闭最右侧标签，跳转到上一个标签
            if (this.$route.name == tag.code) {
                if (index == maxIndex)
                    this.clickTag(this.tagList[index - 1]);
                else
                    this.clickTag(this.tagList[index + 1]);
            }
            this.$store.commit("CLOSE_TAG", tag);
        },
        clickTag(tag) {
            this.$router.push({ name: tag.code });
        }
    },
};
</script>
<style  scoped>
.el-tag+.el-tag {
    margin-left: 10px;
}

.el-tag {
    margin-left: 20px;
    margin-top: 20px;
}
</style>
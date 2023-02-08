<template>
    <div>
        <el-table :data="tableData" @selection-change="selectionChange" :height="height ? height : '85%'" border stripe
            row-key="id" :header-cell-style="{
                background: '#eef1f6', color: '#606266',
                textAlign: 'center', fontWeight: 'bold'
            }">
            <el-table-column type="selection" width="50" v-if="hasSelect"> </el-table-column>
            <el-table-column type="index" v-if="hasIndex" label="序号" width="80"></el-table-column>

            <template v-for="(item, index) in columnOptions">
                <!-- 需要使用插槽 -->
                <el-table-column v-if="item.columnType" :key="item.label" :label="item.label"
                    :min-width="item.width ? item.width : 125" :fixed="item.fixed">
                    <template v-slot="{ row }">
                        <slot :name="item.slotName" :data="row"></slot>
                    </template>
                </el-table-column>
                <!-- 不需要插槽 -->
                <el-table-column v-else :key="index" :prop="item.name" :label="item.label"
                    :min-width="item.width ? item.width : 125"></el-table-column>
            </template>
            <el-table-column v-if="hasOperate" label="操作" :width="operateWidth ? operateWidth : 240" fixed="right">
                <template v-slot="{ row }">
                    <el-button size="mini" type="primary" title="编辑" icon="el-icon-edit"
                        @click="edit(row)">编辑</el-button>

                    <el-popconfirm confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
                        icon-color="red" title="确定删除吗？" @confirm="del(row)">
                        <el-button size="mini" type="danger" title="删除" icon="el-icon-remove-outline"
                            slot="reference">删除</el-button>
                    </el-popconfirm>
                    <slot name="slot1" :data="row"></slot>
                </template>




            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="margin-top:10px ;" layout="->,total,sizes,prev,pager,next,jumper"
            :page-size="pageConfig.size ? pageConfig.size : 10" :page-sizes="[5, 10, 15, 20]" :total="pageConfig.total"
            :current-page.sync="pageConfig.current" @size-change="handleSizeChange"
            @current-change="handleCurrentChange"></el-pagination>
    </div>

</template>

<script>
export default {
    name: 'CommonTable',
    data() {
        return {
        };
    },
    props: {
        height: Number,
        hasSelect: {
            type: Boolean,

        },
        hasIndex: {
            type: Boolean,

        },
        hasOperate: {
            type: Boolean,

        },
        tableData: Array,
        columnOptions: Array,
        pageConfig: Object,
        operateWidth: Number,
    },
    methods: {
        edit(row) {
            console.log(row);
            this.$bus.$emit("edit", row);
        },
        del(row) {
            this.$bus.$emit("del", row);
        },
        //分页器每页显示多少
        handleSizeChange(size) {
            this.$bus.$emit("sizeChange", size);
        },
        handleCurrentChange(page) {
            this.$bus.$emit("currentChange", page);
        },
        selectionChange(val) {
            this.$bus.$emit("select", val);
        }
    },
};
</script>
<style lang="scss"  scoped>
::v-deep .el-table__row {
    td:not(.is-hidden):last-child {
        border-left: 1px solid #dfe6ec;
    }
}

::v-deep .el-table__header {
    th:not(.is-hidden):last-child {
        border-left: 1px solid #dfe6ec;
    }
}

.el-button {
    margin-left: 10px;
}
</style>
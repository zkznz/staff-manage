<template>
    <div>
        <el-form ref="form" label-width="auto" :rules="rules" :model="formData" :inline="inline" size="small">
            <el-form-item v-for="(item, index) in formItemList" :key="index" :label="item.label" :prop="item.name">
                <el-input v-if="item.type == 'input'" v-model.trim="formData[item.name]"
                    :placeholder="item.placeholder || `请输入${item.label}`" :prefix-icon="item.icon">

                </el-input>
                <!-- 计数器 -->
                <!-- style="width:100%" -->
                <el-input-number v-if="item.type == 'number'" v-model="formData[item.name]" :precision="item.precision"
                    :disabled="item.disabled || false" :step="item.step"
                    :placeholder="item.placeholder || `请输入${item.label}`" :min="item.min">
                </el-input-number>
                <!-- 日期选择器 -->
                <el-date-picker v-if="item.type == 'date'" v-model="formData[item.name]"
                    :type="item.inputType || 'date'" :value-format="item.valueFormat || 'yyyy-MM-dd'"
                    :placeholder="item.placeholder || `请输入${item.label}`" :picker-options="item.pickerOptions">
                </el-date-picker>
                <!-- 开关 -->
                <el-switch v-if="item.type == 'switch'" v-model="formData[item.name]" active-color="#13ce66"
                    inactive-color="#ff4949"></el-switch>
                <!-- 密码输入框 -->
                <el-input v-if="item.type === 'password'" :placeholder="item.placeholder || `请输入${item.label}`"
                    v-model.trim="formData[item.name]" prefix-icon="el-icon-lock" show-password />
                <!-- 文本框 -->
                <el-input v-if="item.type === 'textarea'" type="textarea"
                    :placeholder="item.placeholder || `请输入${item.label}`" v-model.trim="formData[item.name]"
                    :autosize="{ minRows: 2, maxRows: 4 }" maxlength="100" show-word-limit
                    :style="{ width: item.width + '%' || '' }" />
                <!-- 下拉框 -->
                <el-select v-if="item.type == 'select'" v-model="formData[item.name]"
                    :placeholder="item.placeholder || `请选择${item.label}`">
                    <el-option v-for="option in item.optionList" :key="option.id" :label="option.name"
                        :value="option.typeId || option.id" :disabled="option.disabled || option.status == 0"></el-option>

                </el-select>
                <!-- 头像上传 -->
                <el-upload v-if="item.type == 'upload'" :action="item.action" :headers="item.headers" :multiple="false"
                    :limit="1" list-type="picture-card" :on-success="handleSuccess">
                    <i class="el-icon-plus"></i>

                </el-upload>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
export default {
    name: 'CommonForm',
    data() {
        return {
        };
    },
    props: {
        formData: Object,
        formItemList: Array,
        inline: Boolean,
        rules: Object
    },
    methods: {
        handleSuccess(res) {
            if (res.code === 200) {
                this.$message.success("文件上传成功！")
                this.$bus.$emit('uploadSuccess', res.data)
            } else {
                this.$message.error("文件上传失败！")
            }
        }
    },
};
</script>
<style  scoped>

</style>
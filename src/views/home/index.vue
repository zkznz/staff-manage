<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover">
                    <div class="user">
                        <img :src="downloadApi + staff.avatar" alt="">
                        <div class="userinfo">
                            <p class="date">{{ currentDateInfo }}</p>
                            <p>{{ staff.name }}</p>
                        </div>
                    </div>
                    <div class="login-info">
                        <p>生日：<span>{{ staff.birthday }}</span></p>
                        <p>地址：<span>{{ staff.address }}</span></p>
                        <p>部门：<span>{{ staff.deptName }}</span></p>
                    </div>
                </el-card>
                <el-card style="margin-top: 20px;height:487px">
                    <el-calendar v-model="attendanceData.date">
                        <template #dateCell="{ date, data }">
                            <span>
                                {{ date.getDate() }}
                            </span>
                            <el-tag v-show="data.type == 'current-month'" size="small" :type="
                            attendanceData.tagType[attendanceData.list[date.getDate() - 1]]">
                                {{ attendanceData.status[attendanceData.list[date.getDate() - 1]] }}
                            </el-tag>
                        </template>
                    </el-calendar>
                </el-card>
            </el-col>
            <el-col :span="16">
                <div class="num">
                    <el-card v-for="(item, index) in countData" :key="index" style="width: 32%;margin-bottom:20px"
                        :body-style="{ display: 'flex', padding: 0 }">
                        <i class="icon" :class="'el-icon-' + item.icon" :style="{ background: item.color }" />
                        <div class="detail">
                            <p class="txt">{{ item.name }}</p>
                            <p class="num">{{ item.value }}</p>
                        </div>
                    </el-card>
                </div>
                <el-card style="height: 300px">
                    <div style="height: 300px" ref="city"></div>
                </el-card>
                <div class="graph">
                    <el-card style="height: 300px;width:48%">
                        <div style="height: 300px" ref="staff"></div>
                    </el-card>
                    <el-card style="height: 300px;width:48%">
                        <div style="height: 300px" ref="department"></div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script>
import { getStaffData, getCountData, getCityData, getAttendanceData, getDepartmentData } from "../../api/home";
import { getDownloadApi } from "../../api/docs";
export default {
    name: 'Home',
    data() {
        return {
            staff: localStorage.getItem("staff") ? JSON.parse(localStorage.getItem("staff")) : {},
            dayOfWeek: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            attendanceData: {
                date: '',
                list: [],
                status: ['正', '迟', '退', '旷', '休'],
                tagType: [
                    "success",
                    "",
                    "warning",
                    "danger",
                    "info"
                ]
            },
            countData: [
                {
                    name: '员工总数',
                    value: 0,
                    icon: 'user',
                    color: '#409EFF'
                },
                {
                    name: '状态正常',
                    value: 0,
                    icon: 'star-on',
                    color: '#67C23A'
                },
                {
                    name: '状态异常',
                    value: 0,
                    icon: 's-goods',
                    color: '#F56C6C'
                },
                {
                    name: '今日迟到',
                    value: 0,
                    icon: 'timer',
                    color: '#409EFF'
                },
                {
                    name: '今日早退',
                    value: 0,
                    icon: 'watch',
                    color: '#67C23A'
                }
                , {
                    name: '今日旷工',
                    value: 0,
                    icon: 'lock',
                    color: '#F56C6C'
                }
            ],
            cityOption: {
                title: {
                    text: '部分城市社保缴费比例'
                },
                legend: {},
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return "<a>" + params.name + "</a>" + "<br /><a>" + params.seriesName + ": " + params.data[params.seriesIndex + 1] * 100 + "%</a>"
                    },
                    textStyle: {
                        fontWeight: 'bold',
                    },
                },
                dataset: {
                    source: []
                },
                xAxis: { type: 'category' },
                yAxis: {
                    type: 'value',
                    name: '百分比',
                    axisLabel: {
                        formatter: function (val) {
                            return val * 100 + "%"
                        }
                    }
                },
                series: [{ type: 'line' }, { type: 'line' }, { type: 'line' }, { type: 'line' }]
            },
            staffOption: {
                title: {
                    text: new Date().getFullYear() + '年员工入职情况',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}人',
                    textStyle: {
                        fontWeight: 'bold',
                    },
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    name: '人数',
                },
                series: [
                    {
                        data: [],
                        type: 'line'
                    },
                    {
                        data: [],
                        type: 'bar'
                    }
                ]
            },
            departmentOption: {
                title: {
                    text: '员工分布情况',
                    left: 'center'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}人',
                    textStyle: {
                        fontWeight: 'bold',
                    },
                },
                series: [
                    {
                        type: 'pie',
                        radius: [10, 120],
                        roseType: 'area',
                        label: {            //饼图图形上的文本标签
                            normal: {
                                show: true,
                                position: 'inner', //标签的位置
                                textStyle: {
                                    fontWeight: 'bold',
                                },
                                formatter: '{d}%'
                            }
                        },
                        data: []
                    }
                ]
            }
        };
    },
    computed: {
        downloadApi() {
            return getDownloadApi();
        },
        //当前日期
        currentDateInfo() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let currentDate = date.getDate();
            let day = date.getDay();
            return year + "年" + month + "月" + currentDate + "日" + " " + this.dayOfWeek[day]
        }
    },
    methods: {
        //加载获取数据
        async loading() {
            let res = await getAttendanceData({ id: this.staff.id });
            if (res.code == 200) {
                this.attendanceData.list = res.data
            }
            res = await getStaffData()
            if (res.code = 200) {
                const quarters = ['一季度', '二季度', '三季度', '四季度']
                this.staffOption.xAxis.data = quarters
                this.staffOption.series.forEach(item => {
                    item.data = res.data
                })
                const staffChart = this.$echarts.init(this.$refs.staff);
                staffChart.setOption(this.staffOption);
            }
            res = await getDepartmentData()
            if (res.code === 200) {
                this.departmentOption.series[0].data = res.data
                const departmentChart = this.$echarts.init(this.$refs.department)
                departmentChart.setOption(this.departmentOption)
            }
            // 获取统计数据
            getCountData().then(response => {
                if (response.code === 200) {
                    this.countData[0].value = response.data.totalNum
                    this.countData[1].value = response.data.normalNum
                    this.countData[2].value = response.data.totalNum - response.data.normalNum
                    this.countData[3].value = response.data.lateNum
                    this.countData[4].value = response.data.leaveEarlyNum
                    this.countData[5].value = response.data.absenteeismNum
                } else {
                    this.$message.error("获取数据失败！")
                }
            });
            // 获取城市设社保数据
            res = await getCityData()
            if (res.code === 200) {
                let cityData = res.data.map(item => [item.name, item.comPensionRate, item.comMedicalRate, item.comUnemploymentRate, item.comMaternityRate])
                cityData.unshift(['product', '养老保险', '医疗保险', '失业保险', '生育保险'])
                this.cityOption.dataset.source = cityData
                const cityChart = this.$echarts.init(this.$refs.city)
                cityChart.setOption(this.cityOption)
            }
        },
        // 获取员工考勤数据
        async getStaffAttendance() {
            let d = this.attendanceData.date
            let month = ''
            if (d.getMonth() < 9) {
                month = d.getFullYear() + "0" + (d.getMonth() + 1)
            } else {
                month = d.getFullYear() + "" + (d.getMonth() + 1)
            }
            let response = await getAttendanceData({ id: this.staff.id, month: month });
            if (response.code === 200) {
                this.attendanceData.list = response.data
            } else {
                this.$message.error("获取数据失败！")
            }

        }
    },
    created() {
        this.loading()
    },
    watch: {
        'attendanceData.date'() {
            this.getStaffAttendance();
        }
    }
};
</script>
<style lang="scss">
.user {
    display: flex;

    img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
    }

    .userinfo {
        margin-left: 35px;
        margin-top: 15px;

        .date {
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
        }

        p {

            font-size: 32px
        }
    }

}

.login-info {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    font-size: 14px;
    line-height: 28px;
    color: #999;



    span {
        margin-left: 50px;
        color: #666;
    }
}

.graph {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
}

.num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .icon {
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        font-size: 30px;
        color: #fff;
    }

    .detail {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 15px;
        padding-bottom: 10px;

        .txt {
            font-size: 14px;
            margin-bottom: 10px;
            color: #999;
        }

        .num {
            font-size: 30px;
        }
    }
}


.el-calendar-table .el-calendar-day {
    height: 54px;
}
</style>
<template>
   <div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="告警类型" prop="deviceName">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择">
            <el-option
              v-for="item in selectOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="queryParams.type" placeholder="请输入设备名称" clearable @keyup.enter.native="handleQuery" /> -->
        </el-form-item>
        <el-form-item label="告警时间">
        <!-- <el-date-picker
          v-model="dateRange"
          :picker-options="pickerOptions"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker> -->
      </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button type="primary" icon="el-icon-download" plain size="mini" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="告警设备" align="center" prop="pduDeviceName" />
        <el-table-column label="告警位置" align="center" prop="deviceType">
          <template slot-scope="{ row }">
            <!-- :1:pdu, 2:outlet, 3:sensor -->
            <span>{{row.deviceType === 1 ? 'pdu' : row.deviceType === 2 ? 'outlet' : 'sensor'}}</span>
          </template>
        </el-table-column>
        <!-- 1:电压,2:电流,3:温度,4:湿度,5:烟雾,6:水浸,7:功率 -->
        <el-table-column label="告警类型" align="center" prop="typeStr" />
        <el-table-column label="告警内容" align="center" prop="message" />
        <el-table-column label="告警时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{row.createTime.toLocaleString() || '--'}}
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="total"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
  import {
    getAlarmLog
  } from '@/api/alarm';

  export default {
    name: 'alarm',
    data() {
      return {
        loading: false,
        // 总条数
        total: 0,
        selectOpts: [
          { label: '电压', value: 1 },
          { label: '电流', value: 2 },
          { label: '温度', value: 3 },
          { label: '湿度', value: 4 },
          { label: '烟雾', value: 5 },
          { label: '水浸', value: 6 },
          { label: '功率', value: 7 }
        ],
        // 表格数据
        list: [],
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          // 设备名称
          name: '',
          type: ''
        }
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      handleQuery() {
        this.queryParams.pageIndex = 1;

        this.getList();
      },
      resetQuery() {
        this.queryParams.name = '';
        this.queryParams.type = '';

        this.handleQuery();
      },
      getList() {
        this.loading = true;

        getAlarmLog(this.queryParams).then(res => {
          this.list = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        }).finally(() => {
          this.loading = false;
        })
      },
      handleExport() {
        console.log(111)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>

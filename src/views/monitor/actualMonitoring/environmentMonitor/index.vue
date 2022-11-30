<template>
  <div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="pduDeviceName">
          <el-input v-model="queryParams.pduDeviceName" placeholder="请输入设备名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="sensorAlarmStatus">
          <el-select
            v-model="queryParams.sensorAlarmStatus"
            placeholder="请选择">
            <el-option
              v-for="item in selectOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="设备支路" align="center" prop="pduDeviceName" />
        <el-table-column label="环境温度(℃)" align="left" prop="temperatureOneValue">
          <template slot-scope="{ row }">
            <div>
              <div>温度传感器一：{{row.temperatureOneValue}}</div>
              <div>温度传感器二：{{row.temperatureTwoValue}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="环境湿度(%)" align="left" prop="humidityOneValue">
          <template slot-scope="{ row }">
            <div>
              <div>湿度传感器一：{{row.humidityOneValue}}</div>
              <div>湿度传感器一：{{row.humidityTwoValue}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="烟感" align="center" prop="smokeStatus">
          <template slot-scope="{ row }">
            <el-tag effect="plain" :type="Number(row.smokeStatus) === 0 ? 'success' : Number(row.smokeStatus) === 1 ? 'warning' : 'info'">{{ Number(row.smokeStatus) === 0 ? '正常' : Number(row.smokeStatus) === 1 ? '告警' : '未连接' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="水浸" align="center" prop="waterLoggingStatus">
          <template slot-scope="{ row }">
            <el-tag effect="plain" :type="Number(row.waterLoggingStatus) === 0 ? 'success' : Number(row.waterLoggingStatus) === 1 ? 'warning' : 'info'">{{ Number(row.waterLoggingStatus) === 0 ? '正常' : Number(row.waterLoggingStatus) === 1 ? '告警' : '未连接' }}</el-tag>
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
    getTMPMonitorList
  } from '@/api/monitor/TMPMonitor.js';

  export default {
    name: 'actualMonitoring',
    data() {
      return {
        loading: false,
        // 总条数
        total: 0,
        // 选择框（正常/异常）（Normal/Exception）
        selectOpts: [
          {value: 1, label: '正常'},
          {value: 0, label: '异常'}
        ],
        // 表格数据
        list: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          // todo
          // 设备名称
          deviceName: '',
          sensorAlarmStatus: null
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
        this.queryParams.pduDeviceName = '';
        this.queryParams.sensorAlarmStatus = null;

        this.handleQuery();
      },
      getList() {
        this.loading = true;

        getTMPMonitorList(this.queryParams).then(res => {
          this.list = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        }).finally(() => {
          this.loading = false;
        })
      },
    }
  }
</script>

<style lang="less" scoped>

</style>

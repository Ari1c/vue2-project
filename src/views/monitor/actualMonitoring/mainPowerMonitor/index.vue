<template>
  <div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="设备" align="center" prop="name" />
        <el-table-column label="输入电压(V)" align="center" prop="totalVoltage" />
        <el-table-column label="输入电流(A)" align="center" prop="totalCurrent" />
        <el-table-column label="总电能(kWh)" align="center" prop="totalEnergy" />
        <el-table-column label="视在功率(kWa)" align="center" prop="totalReactivePower" />
        <el-table-column label="有功功率(kW)" align="center" prop="totalActivePower" />
        <el-table-column label="功率因数" align="center" prop="totalPowerFactor" />
        <el-table-column label="设置人" align="center" prop="updateName" />
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
  getDeviceList
} from '@/api/setting/device/deviceList';

  export default {
    name: 'actualMonitoring',
    data() {
      return {
        loading: false,
        // 总条数
        total: 0,
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
          // 设备名称
          name: ''
        }
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      handleQuery() {
        this.queryParams.pageIndex = 1;
        this.getList()
      },
      resetQuery() {
        this.queryParams.name = '';

        this.handleQuery();
      },
      getList() {
        this.loading = true;

        getDeviceList(this.queryParams).then(res => {
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

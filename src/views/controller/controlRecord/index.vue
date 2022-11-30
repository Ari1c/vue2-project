<template>
  <div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="pduDeviceName">
          <el-input v-model="queryParams.pduDeviceName" placeholder="请输入设备名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="支路">
          <el-select v-model="queryParams.name" placeholder="请选择">
            <el-option v-for="item in selectOpts" :label="item" :value="item" :key="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="控制类型">
          <el-select v-model="queryParams.switchStatus" placeholder="">
            <el-option v-for="item in controlType" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-badge is-dot class="item">数据查询</el-badge> -->
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="设备名称" align="center" prop="pduDeviceName" />
        <el-table-column label="支路" align="center" prop="outletName" />
        <el-table-column label="执行时间" align="center" prop="createTime" />
        <el-table-column label="状态" align="center" prop="optType">
          <template slot-scope="{ row }">
            <el-tag effect="plain" :type="Number(row.optType) === 1 ? 'primary': 'info'">{{ Number(row.optType) === 1 ? '开启' : '关闭' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center" prop="createName" />
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
import { deepClone } from '@/utils';
import {
  getControlRecords
} from '@/api/control/controlRecords';

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
        // 是否隐藏（应用全部设备选项）
        display: true,
        // 支路
        selectOpts: [1,2,3,4],
        // controller type
        controlType: [
          {value: 1, label: '开启'},
          {value: 0, label: '关闭'}
        ],
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          // 设备名称
          name: '',
          pduDeviceName: '',
          switchStatus: null
        },
        // 表单参数
        form: {},
        // 支路 1-8
        selectOpts: [1,2,3,4,5,6,7,8]
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
        this.queryParams.name = '';
        this.queryParams.switchStatus = null;

        this.handleQuery();
      },
      reset() {
        this.form = {
          name: '',
          code: '',
          status: false,
          checked: false,
          description: ''
        };
        this.resetForm("form");
      },
      cancel() {
        this.open = false;
        this.reset();
      },
      getList() {
        this.loading = true;

        getControlRecords(this.queryParams).then(res => {
          this.list = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        }).finally(() => {
          this.loading = false;
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }
  .dialog-row-header {
    padding-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
  }
  .dialog-row-content {
    padding: 14px 0;
  }
</style>

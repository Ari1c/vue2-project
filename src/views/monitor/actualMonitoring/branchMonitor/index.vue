<template>
  <div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="switchStatus">
          <el-select
            v-model="queryParams.switchStatus"
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
        <el-table-column label="设备支路" align="center" prop="name" />
        <el-table-column label="电压(V)" align="center" prop="voltage" />
        <el-table-column label="电流(A)" align="center" prop="current" />
        <el-table-column label="有功电能(kWh)" align="center" prop="energy" />
        <el-table-column label="有功功率(kWa)" align="center" prop="activePower" />
        <el-table-column label="无功功率(kW)" align="center" prop="reactivePower" />
        <el-table-column label="功率因数" align="center" prop="powerFactor" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <!-- todo v-model 绑定一个值 -->
            <el-switch
              @change="changeStatus(row)"
              class="switch"
              v-model="row.switchStatus"
              :active-value="'1'"
              :inactive-value="'0'"
              active-text="开"
              inactive-text="关">
            </el-switch>
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
  getBranchMonitorList,
  openBranch,
  closeBranch
} from '@/api/monitor/branchMonitor.js';

  export default {
    name: 'actualMonitoring',
    data() {
      return {
        loading: false,
        // 总条数
        total: 0,
        // 选择框（开/关）
        selectOpts: [
          {value: 1, label: '开'},
          {value: 0, label: '关'}
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
          // 设备名称
          name: '',
          switchStatus: null,
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
        this.queryParams.switchStatus = '';

        this.handleQuery();
      },
      getList() {
        this.loading = true;

        getBranchMonitorList(this.queryParams).then(res => {
          this.list = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        }).finally(() => {
          this.loading = false;
        })
      },
      changeStatus(row) {
        if (Number(row.switchStatus) === 1) {
          this.$confirm(`是否确认开启${row.name}支路开关？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            openBranch(row.id).then(() => {
              this.$message.success('开启成功');
              this.getList();
            })
          }).catch(() => {
            this.getList();
          })
        } else {
          this.$confirm(`是否确认关闭${row.name}支路开关？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            closeBranch(row.id).then(() => {
              this.$message.success('关闭成功');
              this.getList();
            })
          }).catch(() => {
            this.getList();
          })
        }
      }
    }
  }
</script>

<style>
  .switch .el-switch__label {
    position: absolute;
    display: none;
    color: #fff !important;
  }

  /*打开时文字位置设置*/
  .switch .el-switch__label--right {
    z-index: 1;
  }

  /* 调整打开时文字的显示位子 */
  .switch .el-switch__label--right span {
    margin-left: -10px;
  }

  /*关闭时文字位置设置*/
  .switch .el-switch__label--left {
    z-index: 1;
  }

  /* 调整关闭时文字的显示位子 */
  .switch .el-switch__label--left span {
    margin-left: 10px;
  }

  /*显示文字*/
  .switch .el-switch__label.is-active {
    display: block;
  }

  /* 调整按钮的宽度 */
  .switch.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 50px !important; /* 根据内容调整 */
    margin: 0;
  }
</style>

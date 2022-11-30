<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="操作人员" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="records">
      <el-table-column label="操作账号" align="center" key="account" prop="account" />
      <el-table-column label="异常请求" align="center" prop="request" show-overflow-tooltip />
      <el-table-column label="操作时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" icon="el-icon-info" @click="handleDet(row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="handleQuery"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="异常日志详情" :visible.sync="open" width="90%" append-to-body>
      <div style="font-size:12px; height: 60vh; overflow: auto;" v-html="LogDetail" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectErrorLog, selectErrorLogDetail } from "@/api/system/log";
export default {
  data() {
    return {
      records: null,
      loading: true,
      total: 0,
      dateRange: [],
      queryParams: {
        account: undefined,
        pageIndex: 1,
        pageSize: 10,
      },
      // 是否显示弹出层
      open: false,
      LogDetail: ""
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleQuery() {
      if (this.dateRange && this.dateRange.length) {
        this.queryParams.startTime = this.dateRange[0]
        this.queryParams.endTime = this.dateRange[1]
      } else {
        this.queryParams.startTime = undefined
        this.queryParams.endTime = undefined
      }
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.pageIndex = 1
      this.handleQuery();
    },
    getList() {
      this.loading = true
      selectErrorLog(this.queryParams).then((res) => {
        this.records = res.data.records;
        this.total = res.data.total;
      }).finally(() => {
        this.loading = false
      })
    },
    handleDet(id) {
      selectErrorLogDetail({ id: String(id) }).then((res) => {
        this.LogDetail = res.data.replace(/at /g, "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;at&nbsp;")
        this.open = true;
      });
    }
  }
};
</script>

<style>
</style>
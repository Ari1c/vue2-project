<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="操作模块" prop="module">
        <el-input
          v-model="queryParams.module"
          placeholder="请输入操作模块"
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作类型" prop="operateType">
        <el-select
          v-model="queryParams.operateType"
          placeholder="操作类型"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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

    <el-table ref="tables" v-loading="loading" :data="list">
      <el-table-column label="系统模块" align="center" prop="module" />
      <el-table-column label="操作类型" align="center" prop="operateType" />
      <el-table-column label="操作人员" align="center" prop="account" />
      <el-table-column label="操作状态" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.isSuccess" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作日期" align="center" prop="createTime" width="180" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(row)">详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-form-item label="操作模块：">{{ form.module }} / {{ form.operateType }}</el-form-item>
        <el-form-item label="请求参数：">{{ form.request }}</el-form-item>
        <el-form-item label="返回参数：">{{ form.response }}</el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.isSuccess">正常</div>
              <div v-else>失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ form.createTime }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectPage } from "@/api/system/log"

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      typeList: [],
      open: false,
      form: {},
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        module: undefined,
        account: undefined,
        operateType: ''
      },
      typeList: [
        { label: '查询', value: '查询' },
        { label: '新增', value: '新增' },
        { label: '修改', value: '修改' },
        { label: '删除', value: '删除' }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      selectPage(this.queryParams).then(res => {
        this.list = res.data.records
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.dateRange && this.dateRange.length) {
        this.queryParams.startTime = this.dateRange[0]
        this.queryParams.endTime = this.dateRange[1]
      } else {
        this.queryParams.startTime = ''
        this.queryParams.endTime = ''
      }
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleView(row) {
      this.form = row
      this.open = true
    }
  }
};
</script>


<template>
  <div class="app-container">
    
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
      <el-form-item label="客户端名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入客户端名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户端标识" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入客户端标识" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button style="margin-bottom: 10px;" type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="客户端名称" align="center" prop="name" />
      <el-table-column label="客户端标识" align="center" prop="code" />
      <el-table-column label="所属平台" align="center" prop="platform" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="$router.push('/system/SysUpgrade/version/' + row.id)">版本</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="客户端名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="客户端标识" prop="code">
          <el-input v-model="form.code" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="所属平台" prop="platform">
          <el-select
            v-model="form.platform"
            placeholder="操作类型"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="item in platList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { select, insert, update, remove } from "@/api/system/upgrade";
import { getDataMapFromCode } from "@/api/system/dict";
import { deepClone } from '../../../utils';

export default {
  name: "Config",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 参数表格数据
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: '',
        code: ''
      },
      platList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "客户端名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "客户端标识不能为空", trigger: "blur" }],
        platform: [{ required: true, message: "所属平台不能为空" }]
      }
    };
  },
  created() {
    getDataMapFromCode('platform').then(res => {
      this.platList = res.data
    })
    this.getList();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      select(this.queryParams).then(res => {
        this.list = res.data.records
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        code: undefined,
        platform: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客户端";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = deepClone(row)
      this.open = true;
      this.title = "修改客户端";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            update(this.form.id, this.form).then(() => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            insert(this.form).then(response => {
              this.$message.success("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除参数编号为"' + row.name + '"的数据项？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => remove(row.id))
      .then(() => {
        this.getList();
        this.$message.success("删除成功");
      })
    }
  }
};
</script>

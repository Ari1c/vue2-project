<template>
  <div class="app-container">
    <el-button style="margin-bottom: 10px;" type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="参数名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="参数键名" align="center" prop="code" :show-overflow-tooltip="true" />
      <el-table-column label="参数键值" align="center" prop="value" />
      <el-table-column label="备注" align="center" prop="description" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="code">
          <el-input v-model="form.code" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="value">
          <el-input v-model="form.value" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
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
import { selectPage, insert, update, deleteGlobalConfig } from "@/api/system/globalConfig";
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
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "参数名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "参数键名不能为空", trigger: "blur" }],
        value: [{ required: true, message: "参数键值不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      selectPage(this.queryParams).then(res => {
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
        value: undefined,
        code: undefined,
        description: undefined
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加参数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = deepClone(row)
      this.open = true;
      this.title = "修改参数";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            update(this.form.id, this.form).then(() => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            insert(this.form).then(() => {
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
      this.$confirm('是否确认删除参数名称为"' + row.name + '"的数据项？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => deleteGlobalConfig(row.id))
      .then(() => {
        this.getList();
        this.$message.success("删除成功");
      })
    }
  }
};
</script>

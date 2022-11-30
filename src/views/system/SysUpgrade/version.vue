<template>
  <div class="app-container">
    <el-button style="margin-bottom: 10px;" type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="版本号" align="center" prop="version" />
      <el-table-column label="版本描述" align="center" prop="description" show-overflow-tooltip />
      <el-table-column label="安装包地址" align="center" prop="url" show-overflow-tooltip />
      <el-table-column label="是否强制更新" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.isForce" type="danger">是</el-tag>
          <el-tag v-else type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.delFlag" type="danger">已下线</el-tag>
          <el-tag v-else type="success">已上线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" :icon="`el-icon-${row.delFlag ? 'top' : 'bottom'}`" @click="handleChangeStatus(row)">{{ row.delFlag ? '上' : '下' }}线</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(row)">修改</el-button>
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
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="安装包" prop="url">
          <el-input v-model="form.url" placeholder="请输入IOS更新路径" />
        </el-form-item>
        <el-form-item label="是否强制更新" prop="isForce">
          <el-radio-group v-model="form.isForce">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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
import { versionSelect, versionInsert, versionUpdate, versionChangeStatus } from "@/api/system/upgrade";
import { deepClone } from '@/utils';

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
        appId: '',
        pageIndex: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        version: [{ required: true, message: "版本号不能为空", trigger: "blur" }],
        url: [{ required: true, message: "安装包地址不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.queryParams.appId = this.$route.params.id
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      versionSelect(this.queryParams).then(res => {
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
        appId: undefined,
        version: undefined,
        url: undefined,
        isForce: false,
        description: undefined
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.appId = this.$route.params.id
      this.open = true;
      this.title = "添加客户端版本";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = deepClone(row)
      this.open = true;
      this.title = "修改客户端版本";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            versionUpdate(this.form.id, this.form).then(() => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            versionInsert(this.form).then(() => {
              this.$message.success("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleChangeStatus(row) {
      const str = row.delFlag ? '上线' : '下线'
      this.$confirm(`是否确认${str}线此版本？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => versionChangeStatus(row.id, !row.delFlag))
      .then(() => {
        this.getList();
        this.$message.success(str + '成功')
      })
    }
  }
};
</script>

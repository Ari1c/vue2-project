<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="字典名称" prop="dictType">
        <el-select v-model="queryParams.dictId" @change="handleQuery">
          <el-option
            v-for="item in dataTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入字典标签"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="数据状态" clearable>
          <el-option
            v-for="dict in statusList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button style="margin-bottom: 10px;" type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="字典标签" align="center" prop="name" />
      <el-table-column label="字典键值" align="center" prop="code" />
      <el-table-column label="字典排序" align="center" prop="sortOrder" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="{ row }">
          <el-tag v-if="row.status" type="danger">停用</el-tag>
          <el-tag v-else type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="description" show-overflow-tooltip />
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
        <el-form-item label="字典类型">
          <el-input v-model="form.dictCode" disabled />
        </el-form-item>
        <el-form-item label="数据标签" prop="name">
          <el-input v-model="form.name" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="code">
          <el-input v-model="form.code" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusList" :key="item.label" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容"></el-input>
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
import { selectAll, dataSelect, dataUpdate, dataInsert, dataRemove } from '@/api/system/dict'
import { deepClone } from '../../../utils';

export default {
  name: "Data",
  data() {
    return {
      dataTypeList: [],
      loading: false,
      total: 0,
      list: [],
      title: "",
      open: false,
      statusList: [
        { label: '正常', value: false },
        { label: '停用', value: true }
      ],
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        dictId: undefined,
        name: undefined,
        status: undefined
      },
      form: {},
      rules: {
        name: [{ required: true, message: "数据标签不能为空", trigger: "blur" }],
        code: [{ required: true, message: "数据键值不能为空", trigger: "blur" }],
        sortOrder: [{ required: true, message: "数据顺序不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.queryParams.dictId = Number(this.$route.params.id)
    selectAll().then(res => {
      this.dataTypeList = res.data
    })
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      dataSelect(this.queryParams).then(res => {
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
        dictId: undefined,
        dictCode: undefined, 
        name: undefined,
        code: undefined,
        sortOrder: 0,
        status: false,
        description: undefined
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
      this.resetForm("queryForm");
      this.queryParams.dictId = Number(this.$route.params.id)
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      const item = this.dataTypeList.find(v => v.id === this.queryParams.dictId)
      this.form.dictCode = item && item.code
      this.form.dictId = item && item.id
      this.open = true;
      this.title = "添加字典数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = deepClone(row)
      const item = this.dataTypeList.find(v => v.id === this.form.dictId)
      this.form.dictCode = item && item.code
      this.open = true;
      this.title = "修改字典数据";
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            dataUpdate(this.form.id, this.form).then(() => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            dataInsert(this.form).then(() => {
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
      this.$confirm('是否确认删除字典标签为"' + row.name + '"的数据项？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => dataRemove(row.id))
      .then(() => {
        this.getList();
        this.$message.success("删除成功");
      })
    }
  }
};
</script>
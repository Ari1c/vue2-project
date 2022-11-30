<template>
  <div class="app-container">
    <div style="margin-bottom: 10px;">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
    </div>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="tableList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="treeProps"
    >
      <el-table-column label="组织名称" prop="name" />
      <el-table-column label="排序" prop="sort" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(row)">新增</el-button>
          <el-button :disabled="row.pid === 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改组织对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级组织" prop="pid">
          <treeselect v-model="form.pid" :options="orgOptions" :normalizer="normalizer" placeholder="选择上级组织" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入组织名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectPage, insert, update, deleteOrganization } from "@/api/system/organization"
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import { recursionToTree } from '@/utils'
import { deepClone } from '../../../utils'

export default {
  components: { Treeselect },
  data() {
    return {
      originalOrgList: [],
      loading: true,
      orgOptions: [],
      treeProps: { children: 'children' },
      title: "",
      open: false,
      isExpandAll: true,
      refreshTable: true,
      queryParams: {
        name: undefined
      },
      form: {},
      rules: {
        pid: [{ required: true, message: "上级组织不能为空" }],
        name: [{ required: true, message: "组织名称不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "显示排序不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    tableList() {
      return recursionToTree(this.originalOrgList, 'id', 'pid', this.treeProps.children, 0)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      selectPage().then(res => {
        this.originalOrgList = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        name: '',
        pid: undefined,
        sort: 0
      };
      this.resetForm("form");
    },
    handleAdd(row) {
      this.reset();
      if (row) {
        this.form.pid = row.id;
      }
      const orgOptions = [{ name: '顶级组织', id: 0 }]
      this.orgOptions = orgOptions.concat(this.tableList)
      this.open = true;
      this.title = "添加组织";
    },
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = deepClone(row)
      this.open = true
      this.title = "修改组织"
      
      const list = [{ id: 0, name: '顶级组织' }]
      const filterTree = recursionToTree(this.originalOrgList.filter(v => v.id !== row.id), 'id', 'pid', this.treeProps.children, 0)
      this.orgOptions = list.concat(filterTree)
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title === "修改组织") {
            update(this.form.id, this.form).then(() => {
              this.$message.success("修改成功")
              this.open = false;
              this.getList();
            });
          } else {
            insert(this.form).then(() => {
              this.$message.success("新增成功")
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为' + row.name + '的数据项？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => deleteOrganization(row.id))
      .then(() => {
        this.getList()
        this.$message.success("删除成功")
      })
    }
  }
};
</script>

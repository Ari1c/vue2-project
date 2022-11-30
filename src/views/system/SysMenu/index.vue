<template>
  <div>
    <div style="margin: 20px">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleInsert">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table v-if="refreshTable" :data="records" row-key="code" :row-class-name="tableRowClassName"
              :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="菜单名称" width="150" align="center" key="name" prop="name"/>
      <el-table-column label="编码" align="center" key="code" prop="code"/>
      <el-table-column label="排序" align="center" key="sortOrder" prop="sortOrder"/>
      <el-table-column label="是否显示" align="center" prop="isShow">
        <template slot-scope="scope">
          <el-switch disabled v-model="scope.row.isShow" :active-value="true" :inactive-value="false"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="权限" align="center" prop="rights">
        <template slot-scope="scope">
          <span>{{ scope.row.rights }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入编码" maxlength="30"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="父菜单" prop="pid">
              <treeselect v-model="form.pid" :options="changeFaMenu(orgRecords)" :normalizer="normalizer"
                          :show-count="true" placeholder="选择上级菜单"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限" prop="rights">
              <el-input v-model="form.rights" placeholder="请输入权限" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否显示" prop="isShow">
              <el-switch v-model="form.isShow" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" :min="1" :max="100" label="排序"></el-input-number>
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
  import {deleteMenu, insert, selectPage, update} from "@/api/system/menus";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {deepClone, recursionToTree} from '@/utils/index'

  export default {
    components: {Treeselect},
    data() {
      return {
        //记录列表（原始）
        orgRecords: [],
        //记录列表（树）
        records: [],
        //添加、修改表单内容
        form: {},
        //添加、修改表单校验
        rules: {
          name: [{required: true, message: "名称不能为空", trigger: "blur"}],
          code: [{required: true, message: "编码不能为空", trigger: "blur"}]
        },
        //添加、修改表单头
        title: "",
        //添加、修改表单是否显示弹出层
        open: false,
        //添加还是修改操作
        ifInsert: false,
        //是否展开
        isExpandAll: false,
        //重新渲染表格状态
        refreshTable: true,
      };
    },
    methods: {
      //查询
      handleQuery() {
        selectPage({}).then((res) => {
          this.orgRecords = res.data;
          this.records = this.filtersMenus(res.data);
        });
      },
      //新增
      handleInsert() {
        this.reset();
        this.form.pid = 0;
        this.form.isShow = true;
        this.title = "添加菜单";
        this.ifInsert = true;
        this.open = true;
      },
      //展开、折叠操作
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      //修改
      handleUpdate(row) {
        this.reset();
        this.title = "修改菜单";
        this.ifInsert = false;
        this.form = JSON.parse(JSON.stringify(row));
        this.open = true;
      },
      //删除
      handleDelete(row) {
        let that = this;
        this.$confirm("此操作将删除该菜单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deleteMenu({id: row.id}).then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              that.handleQuery();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      },
      //重置添加、删除表单
      reset() {
        this.form = {
          name: undefined,
          code: undefined,
          pid: undefined,
          rights: undefined,
          isShow: undefined,
        };
        this.resetForm("form");
      },
      //提交按钮
      submitForm: function () {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.ifInsert) {
              insert(this.form).then((response) => {
                this.$message.success("新增成功");
                this.open = false;
                this.handleQuery();
              });
            } else {
              update(this.form).then((response) => {
                this.$message.success("修改成功");
                this.open = false;
                this.handleQuery();
              });
            }
          }
        });
      },
      //取消按钮
      cancel() {
        this.open = false;
      },
      //树形显示菜单
      filtersMenus(menus) {
        menus = deepClone(menus);
        //从小到大排序
        menus.sort(function (a, b) {
          return a.sortOrder - b.sortOrder
        })
        //递归整理成树形结构
        let newArr = recursionToTree(menus, "id", "pid", "children", 0)
        return newArr;
      },
      //添加、删除时选择的菜单
      changeFaMenu(menus) {
        menus = deepClone(menus);
        //从小到大排序
        menus.sort(function (a, b) {
          return a.sortOrder - b.sortOrder
        })

        let newMenus = []
        //数据字段清洗
        for (let i = 0; i < menus.length; i++) {
          let menu = menus[i]
          newMenus.push({
            menuId: menu.id,
            menuName: menu.name,
            pid: menu.pid
          })
        }
        //递归整理成树形结构
        let newArr = recursionToTree(newMenus, "menuId", "pid", "children", 0);
        let lastArr = [{menuId: 0, menuName: "主菜单", children: [...newArr]}];
        return lastArr;
      },
      //转换菜单数据结构
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children,
        };
      },
      //表格各级颜色
      tableRowClassName({row, rowIndex}) {
        if (row.pid == 0) {
          return 'warning-row';
        } else if (row.children && row.children.length > 0) {
          return 'success-row';
        }
        return '';
      }
    },
    mounted() {
      this.handleQuery();
    },
  };
</script>

<style lang="less" scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>>

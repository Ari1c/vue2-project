<template>
  <div class="container">
    <div style="">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        plain
        @click="handleInsert"
      >新增
      </el-button
      >
    </div>
    <el-table :data="records" center style="margin-top:20px">
      <el-table-column label="名称" align="center" key="name" prop="name"/>
      <el-table-column
        label="描述"
        align="center"
        key="description"
        prop="description"
      />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope" v-if="scope.row.userId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button
          >
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
    <el-dialog :title="title" :visible.sync="open" append-to-body center>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入名称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限分配" prop="menuList">
              <el-tree
                class="tree-border"
                default-expand-all
                :data="treeList"
                show-checkbox
                ref="menu"
                node-key="id"
                :default-checked-keys="roleSelect"
                empty-text="加载中，请稍候"
                :props="defaultProps"
              >
              </el-tree>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="form.description"
                placeholder="请输入描述"
                maxlength="30"
              />
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
  import {deleteRole, insert, selectMenuTree, selectPage, update,} from "@/api/system/role";
  import {deepClone, recursionToTree} from '@/utils/index'

  export default {
    data() {
      return {
        records: null,
        form: {},
        // 表单校验
        rules: {
          name: [{required: true, message: "名称不能为空", trigger: "blur"}],
          description: [{required: true, message: "描述不能为空", trigger: "blur"}],
          menuIds: [{required: true, message: "权限不能为空", trigger: "blur"}],
        },
        title: "",
        // 总条数
        total: 0,
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
        },
        // 是否显示弹出层
        open: false,
        ifInsert: false,
        // 组织编号选项
        organizations: null,
        // 所有权限
        treeList: [],
        // 角色默认展开的权限
        roleSelect: [],
        defaultProps: {
          children: "children",
          label: "name",
        },
      };
    },
    methods: {
      handleQuery() {
        selectPage(this.queryParams).then((res) => {
          this.records = res.data.records;
          this.total = res.data.total;
        });
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.records = [];
        this.resetForm("queryForm");
        this.queryParams.pageIndex = 1;
        this.handleQuery();
      },
      handleInsert() {
        this.reset();
        this.selectMenuTree();
        this.title = "添加角色";
        this.ifInsert = true;
        this.open = true;
      },
      // 修改
      handleUpdate(row) {
        this.reset();
        this.title = "修改角色";
        this.ifInsert = false;
        this.form = JSON.parse(JSON.stringify(row));
        this.selectMenuTree(this.form.id);
        this.open = true;
      },
      // 删除
      handleDelete(row) {
        let that = this;
        this.$confirm("此操作将删除该账号, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deleteRole({id: row.id}).then((res) => {
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

      // 表单重置
      reset() {
        this.form = {
          name: undefined,
          menuIds: undefined,
          description: undefined,
        };
        this.resetForm("form");
      },
      /** 提交按钮 */
      submitForm: function () {
        // 获取已选的权限
        let menuIds = this.getMenuAllCheckedKeys();
        this.form.menus = menuIds.join(",")
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
      cancel() {
        this.open = false;
      },
      // 获取角色权限树形图
      selectMenuTree(id) {
        let obj = {roleId: id};
        selectMenuTree(obj).then((res) => {
          this.roleSelect = [];
          this.roleSelect.push(...this.showSelected(res.data));
          this.treeList = this.changeFaMenu(res.data);
        });
      },
      // 所有菜单节点数据
      getMenuAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.menu.getCheckedKeys();
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
        return checkedKeys;
      },
      // 树形数据转换
      changeFaMenu(menus) {
        menus = deepClone(menus);
        //从小到大排序
        menus.sort(function (a, b) {
          return a.sortOrder - b.sortOrder
        })
        //递归整理成树形结构
        let newArr = recursionToTree(menus, "id", "pid", "children", 0)
        return newArr;
        let lastArr = [{id: 0, name: "全选", children: [...newArr]}];
        return lastArr;
      },
      // 角色权限回显
      showSelected(data) {
        let pidArr = [];
        let lastArr = [];
        data.forEach((element) => {
          if (element.isSelect) {
            pidArr.push(element.pid);
            lastArr.push(element.id);
          }
        });
        pidArr = [...new Set(pidArr)];
        pidArr.forEach((e) => {
          lastArr.forEach((el, index) => {
            if (e === el) {
              lastArr.splice(index, 1);
            }
          });
        });
        return lastArr;
      },
    },
    mounted() {
      this.handleQuery();
    },
  };
</script>

<style>
  .container {
    padding: 20px
  }
</style>

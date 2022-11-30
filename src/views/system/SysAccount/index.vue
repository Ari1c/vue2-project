<template>

  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <el-input
          v-model="organizationName"
          placeholder="请输入部门名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="margin-bottom: 20px"
        />
        <el-tree
          :data="orgOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="tree"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form size="small" :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入用户名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="queryParams.phone"
              placeholder="请输入手机号码"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="queryParams.state"
              placeholder="用户状态"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="item in stateList"
                :key="item.key"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
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
        <el-button style="margin-bottom: 10px;" type="primary" plain icon="el-icon-plus" size="mini"
                   @click="handleInsert">新增
        </el-button>
        <el-table :data="records" @selection-change="handleSelectionChange">
          <el-table-column label="用户编号" align="center" key="id" prop="id"/>
          <el-table-column label="用户名称" align="center" key="account" prop="account"/>
          <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"/>
          <el-table-column label="组织" align="center" :formatter="orgNameFormatter"/>
          <el-table-column label="手机号码" align="center" key="phone" prop="phone" width="120"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" key="state">
            <template slot-scope="{ row }">
              <el-tag type="success" v-if="!row.delFlag">正常</el-tag>
              <el-tag type="danger" v-else>停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
            <template slot-scope="{ row }">
              <el-button :disabled="row.delFlag" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(row)">
                修改
              </el-button>
              <el-button :disabled="row.delFlag" size="mini" type="text" icon="el-icon-delete"
                         @click="handleDelete(row)">删除
              </el-button>
              <el-button :disabled="row.delFlag" size="mini" type="text" icon="el-icon-delete"
                         @click="handleUpdatePwd(row)">重置密码
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize"
                    @pagination="handleQuery"/>
      </el-col>
    </el-row>


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入真实姓名" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account" :disabled="!ifInsert" placeholder="请输入账号" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="form.roleId" placeholder="角色">
                <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织" prop="organizationId">
              <treeselect v-model="form.organizationId" :options="orgOptions" :show-count="true" placeholder="请选择组织"/>
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
  import {
    checkAccount,
    deleteAccount,
    insert,
    queryStateList,
    resetPwd,
    selectPage,
    selectSysOrganization,
    selectSysRole,
    update
  } from "@/api/system/account"
  import {recursionToTree} from '@/utils'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    components: {
      Treeselect
    },
    data() {
      const accountValidator = (rule, value, callback) => {
        if (!this.ifInsert) {
          return callback()
        }
        checkAccount({value}).then(res => {
          if (res.data) {
            callback(new Error('该账号已被注册'))
          } else {
            callback()
          }
        }).catch(callback)
      };
      return {
        organizationName: '',
        orgOptions: [],
        originOrgList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        roleList: [],
        stateList: [],
        dateRange: '',
        records: [],
        form: {},
        // 表单校验
        rules: {
          name: [
            {required: true, message: "用户名称不能为空", trigger: "blur"},
            {
              min: 2,
              max: 20,
              message: "用户名称长度必须介于 2 和 20 之间",
              trigger: "blur",
            }
          ],
          nickName: [{required: true, message: "用户昵称不能为空", trigger: "blur"}],
          roleId: [{required: true, message: "角色不能为空"}],
          phone: [{required: true, message: "手机号不能为空", trigger: "blur"}],
          account: [
            {required: true, message: "账号不能为空", trigger: "blur"},
            {validator: accountValidator, trigger: "blur"}
          ],
          organizationId: [{required: true, message: "组织不能为空"}]
        },
        title: "",
        // 总条数
        total: 0,
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          name: undefined,
          phone: undefined,
          state: undefined,
          organizationIds: undefined
        },
        // 是否显示弹出层
        open: false,
        ifInsert: false
      };
    },
    watch: {
      organizationName(val) {
        this.$refs.tree.filter(val)
      }
    },
    mounted() {
      selectSysOrganization().then(res => {
        res.data.forEach(v => v.label = v.name)
        this.originOrgList = res.data
        this.orgOptions = recursionToTree(res.data, 'id', 'pid', this.defaultProps.children, 0)
        this.handleQuery()
      })
      selectSysRole().then(res => {
        this.roleList = res.data
      })
      queryStateList().then(res => {
        this.stateList = res.data
      })
    },
    methods: {
      orgNameFormatter(data) {
        const {name} = this.originOrgList.find(v => v.id === data.organizationId)
        return name
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 节点单击事件
      handleNodeClick({id}) {
        const organizationIds = [id]
        let childrenIds = [id]
        do {
          childrenIds = this.originOrgList.filter(v => childrenIds.includes(v.pid)).map(v => v.id)
          organizationIds.push(...childrenIds)
        } while (childrenIds.length)
        this.queryParams.organizationIds = organizationIds
        this.handleQuery()
      },
      handleQuery() {
        if (this.dateRange && this.dateRange.length) {
          this.queryParams.startDate = this.dateRange[0]
          this.queryParams.endDate = this.dateRange[1]
        } else {
          this.queryParams.startDate = ''
          this.queryParams.endDate = ''
        }
        selectPage(this.queryParams).then((res) => {
          this.records = res.data.records
          this.total = res.data.total
        });
      },
      handleSelectionChange() {
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.records = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      handleInsert() {
        this.reset();
        this.title = "添加用户";
        this.ifInsert = true;
        this.open = true;
      },
      // 修改
      handleUpdate(row) {
        this.reset();
        this.title = "修改用户";
        this.ifInsert = false;
        this.form = JSON.parse(JSON.stringify(row));
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
            deleteAccount({id: row.id}).then((res) => {
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
      // 重置密码
      handleUpdatePwd(row) {
        let that = this;
        this.$confirm("此操作将重置该账号密码, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            resetPwd({id: row.id}).then((res) => {
              this.$message({
                type: "success",
                message: "重置成功!",
              });
              that.handleQuery();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      },
      // 表单重置
      reset() {
        this.form = {
          name: undefined,
          nickName: undefined,
          roleId: undefined,
          phone: undefined,
          account: undefined,
          organizationId: undefined,
        };
        this.resetForm("form");
      },
      /** 提交按钮 */
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
      cancel() {
        this.open = false;
      }
    }
  };
</script>


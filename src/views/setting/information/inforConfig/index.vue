<template>
  <div>
    <div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="接收人" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button style="margin-bottom: 10px" type="primary" icon="el-icon-setting" size="mini" @click="handleSetting">新增</el-button>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="接收人" align="center" prop="name" />
        <el-table-column label="联系方式" align="center" prop="phone" />
        <el-table-column label="邮件地址" align="center" prop="email" />
        <el-table-column label="设置人" align="center" prop="updateName" />
        <el-table-column label="设置时间" align="center" prop="updateTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <!-- todo v-model 绑定一个值 -->
            <el-link type="primary" :underline="false" @click="handleModify(row)">修改</el-link>
            <el-link type="primary" :underline="false" @click="handleViewRecord(row)">记录</el-link>
            <el-link type="danger" :underline="false" @click="handleDelete(row)">删除</el-link>
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
      <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item  label="接收人" prop="name">
            <el-input v-model="form.name" placeholder="请输入接收人，20字以内"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入有效的手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="form.email" placeholder="请输入有效的邮箱"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 查看记录弹框 -->
      <el-dialog title="记录" :visible.sync="recordOpen" width="1000px" append-to-body>
        <el-table v-loading="recordsLoading" :data="recordsList">
          <el-table-column label="接收人" align="center" prop="targetName" />
          <el-table-column label="联系方式" align="center" prop="targetPhone" />
          <el-table-column label="邮箱地址" align="center" prop="targetEmail" />
          <el-table-column label="操作人" align="center" prop="createName" />
          <el-table-column label="操作时间" align="center" prop="createTime" />
        </el-table>

        <!-- TODO -->
        <pagination
          :total="recordsTotal"
          :page.sync="recordsPageIndex"
          :limit.sync="recordsPageSize"
          @pagination="getRecordsList"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils';
import {
  getMsgList,
  addContactPreson,
  modifyContact,
  viewContactRecords,
  deleteContact
} from '@/api/setting/message';

  export default {
    name: 'inforConfig',
    data() {
      const validateName = (rule, value, callback) => {
        if (value.length > 20) {
          callback(new Error('必须小于20 字符'));
        }

        callback();
      }

      return {
        loading: false,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 是否显示记录弹出层
        recordOpen: false,
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          // todo
          // 设备名称
          name: ''
        },
        // 表单参数
        form: {},
        // 校验规则
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ],
          phone: [
            { pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur'}
          ],
          email: [
            { pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, message: '请输入正确的邮箱', trigger: 'blur' }
          ]
        },
        // 记录 ID
        recordsLoading: false,
        recordsPageIndex: 1,
        recordsPageSize: 10,
        // 记录总条数
        recordsTotal: 0,
        // 记录列表
        recordsList: []
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      handleQuery() {
        this.queryParams.pageIndex = 1;
        this.getList();
      },
      resetQuery() {
        this.queryParams.name = '';

        this.handleQuery();
      },
      reset() {
        this.form = {
          name: '',
          phone: '',
          email: ''
        };
        this.resetForm("form");
      },
      cancel() {
        this.open = false;
        this.reset();
      },
      getList() {
        this.loading = true;

        getMsgList(this.queryParams).then(res => {
          this.list = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        }).finally(() => {
          this.loading = false;
        })
      },
      handleSetting() {
        this.reset();
        this.open = true;
        this.title = '设置';
      },
      handleModify(row) {
        this.reset();
        this.open = true;
        this.title = '编辑';
        this.form = deepClone(row);
      },
      handleViewRecord(row) {
        this.recordOpen = true;
        this.recordsId = row.id;

        this.getRecordsList();
      },
      getRecordsList() {
        this.recordsLoading = true;

        viewContactRecords(this.recordsId, {
          pageIndex: this.recordsPageIndex,
          pageSize: this.recordsPageSize
        }).then(res => {
          this.recordsLoading = false;
          this.recordsList = res.data.records;
          this.recordsTotal = res.data.total || 0;
        })
      },
      handleDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的联系人？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => deleteContact(row.id)).then(() => {
        this.getList();
        this.$message.success('删除成功')
      })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            console.log(this.form, this.form.id, '======');
            if (this.form.id !== undefined) {
              modifyContact(this.form.id, this.form).then(() => {
                this.$message.success("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addContactPreson(this.form).then(() => {
                this.$message.success("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .el-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }
  .dialog-row-header {
    padding-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
  }
  .dialog-row-content {
    padding: 14px 0;
  }
</style>

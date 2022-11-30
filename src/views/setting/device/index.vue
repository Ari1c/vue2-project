<template>
  <div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button style="margin-bottom: 10px" type="primary" icon="el-icon-setting" size="mini" @click="handleSetting">新增</el-button>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="设备名称" align="center" prop="name" />
        <el-table-column label="IP地址" align="center" prop="ip" />
        <el-table-column label="设置人" align="center" prop="createBy" />
        <el-table-column label="设置时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" prop="createTime">
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
          <el-form-item  label="设备名称" prop="name">
            <!-- :disabled="form.name && form.id"  -->
            <el-input :disabled="form.id" v-model="form.name" placeholder="请输入设备名称，20字以内"></el-input>
          </el-form-item>
          <el-form-item label="IP 地址" prop="ip">
            <el-input v-model="form.ip" placeholder="请输入IP"></el-input>
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
          <el-table-column label="原设备名称" align="center" prop="originName" />
          <el-table-column label="现设备名称" align="center" prop="targetName" />
          <el-table-column label="原IP地址" align="center" prop="originIp" />
          <el-table-column label="现IP地址" align="center" prop="targetIp" />
          <el-table-column label="操作人" align="center" prop="createBy" />
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
  getDeviceList,
  addDevice,
  updateDevice,
  deleteDevice,
  viewRecord
} from '@/api/setting/device/deviceList';

  export default {
    name: 'actualMonitoring',
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
          name: ''
        },
        // 表单参数
        form: {},
        // 校验规则
        rules: {
          name: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ],
          ip: [
            { required: true, message: '请输入IP', trigger: 'blur' },
            { pattern: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g, message: '请输入正确的IP', trigger: 'blur'}
          ]
        },
        // 记录 ID
        recordsId: '',
        // 记录 loading
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
          ip: '',
        };
        this.resetForm("form");
      },
      cancel() {
        this.open = false;
        this.reset();
      },
      getList() {
        this.loading = true;
        getDeviceList(this.queryParams).then(res => {
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

        console.log(this.form, 'form')
      },
      handleViewRecord(row) {
        this.recordOpen = true;
        this.recordsId = row.id;

        this.getRecordsList();
      },
      getRecordsList() {
        this.recordsLoading = true;

        viewRecord({
          pageIndex: this.recordsPageIndex,
          pageSize: this.recordsPageSize,
          pduDeviceId: this.recordsId
        }).then(res => {
          this.recordsLoading = false;
          this.recordsList = res.data.records;
          this.recordsTotal = res.data.total || 0;
        })
      },
      handleDelete(row) {
        this.$confirm(`是否确认删除 ${row.name}，数据项`, '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => deleteDevice(row.id))
        .then(() => {
          this.getList();
          this.$message.success('删除成功');
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          console.log('_======', this.form, this.form.id)
          if (valid) {
            if (this.form.id) {
              updateDevice(this.form.id, this.form).then(() => {
                // this.$message.success("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addDevice(this.form).then(() => {
                // this.$message.success("新增成功");
                this.open = false;
                this.getList();
              })
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

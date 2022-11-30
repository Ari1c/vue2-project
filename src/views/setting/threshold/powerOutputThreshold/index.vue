<template>
  <div>
    <div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button style="margin-bottom: 10px" type="primary" icon="el-icon-setting" size="mini" @click="handleSetting">设置</el-button>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="设备名称" align="center" prop="pduDeviceName" />
        <el-table-column label="支路总数" align="center" prop="outletQuantity" />
        <el-table-column label="最高输出功率(W)" align="center" prop="maxPower" />
        <el-table-column label="最低输出功率(W)" align="center" prop="minPower" />
        <el-table-column label="设置人" align="center" prop="createBy" />
        <el-table-column label="操作" align="center" prop="createTime" width="180">
          <template slot-scope="{ row }">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleModify(row)">设置</el-button>
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
      <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
        <el-form ref="form" :model="form" v-loading="isLoading" label-width="80px">
          <div class="po-header">
            <el-row class="dialog-row-header" flex="1">
              <el-col :span="2">支路</el-col>
              <el-col :span="10">输出功率上限(W)</el-col>
              <el-col :span="10">输出功率下限(W)</el-col>
            </el-row>
            <el-row class="dialog-row-header" flex="1">
              <el-col :span="2">支路</el-col>
              <el-col :span="10">输出功率上限(W)</el-col>
              <el-col :span="10">输出功率下限(W)</el-col>
            </el-row>
          </div>
          <div class="po-content">
            <el-row class="dialog-row-content" v-for="item in this.form.settings" :key="item.outletIndex">
              <el-col :span="2">{{item.outletIndex}}</el-col>
              <el-col :span="10">
                <el-input placeholder="" v-model="item.powerUpperLimit">
                  <template slot="append">W</template>
                </el-input>
              </el-col>
              <el-col :span="10">
                <el-input placeholder="" v-model="item.powerLowerLimit">
                  <template slot="append">W</template>
                </el-input>
              </el-col>
            </el-row>
          </div>
          <el-form-item v-if="display" label="应用于">
            <el-select v-model="form.pduDeviceId" placeholder="">
              <el-option
                v-for="item in selectOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
            <el-checkbox v-model="form.applyAll">所有设备</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getPOList,
  detailPOThreshold,
  updatePOThreshold
} from '@/api/setting/threshold/powerOutputThreshold';

  export default {
    name: 'actualMonitoring',
    data() {
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
        // 是否隐藏（应用全部设备选项）
        display: false,
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          // 设备名称
          name: ''
        },
        // 表单参数
        form: {},
        isLoading: false,
        selectOpts: []
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
          applyAll: false,
          pduDeviceId: this.selectOpts[0].value,
          settings: [
            {outletIndex: 1, powerUpperLimit: '', powerLowerLimit: ''},
            {outletIndex: 2, powerUpperLimit: '', powerLowerLimit: ''},
            {outletIndex: 3, powerUpperLimit: '', powerLowerLimit: ''},
            {outletIndex: 4, powerUpperLimit: '', powerLowerLimit: ''},
            {outletIndex: 5, powerUpperLimit: '', powerLowerLimit: ''},
            {outletIndex: 6, powerUpperLimit: '', powerLowerLimit: ''},
            {outletIndex: 7, powerUpperLimit: '', powerLowerLimit: ''},
            {outletIndex: 8, powerUpperLimit: '', powerLowerLimit: ''}
          ]
        };
        this.resetForm("form");
      },
      cancel() {
        this.open = false;
        this.reset();
      },
      getList() {
        this.loading = true;

        getPOList(this.queryParams).then(res => {
          this.list = res.data.records;
          this.total = res.data.total;
          this.selectOpts = res.data.records.map(item => {
            return {
              label: item.pduDeviceName,
              value: item.id
            }
          })
          this.loading = false;
        }).finally(() => {
          this.loading = false;
        })
      },
      handleSetting() {
        this.reset();
        this.open = true;
        this.display = true;
        this.title = '设置';
      },
      handleModify(row) {
        this.reset();
        this.title = '编辑';
        this.open = true;
        this.display = false;
        this.isLoading = true;

        detailPOThreshold(row.pduDeviceId).then(res => {
          this.isLoading = false;
          this.form.settings = res.data;
          this.form.pduDeviceId = row.pduDeviceId;
        }).finally(() => {
          this.isLoading = false;
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updatePOThreshold(this.form).then(() => {
              this.$message.success('修改成功');
              this.open = false;
              this.getList();
            })
          }
        });
      },
    },
    computed: {

    }
  }
</script>

<style lang="less" scoped>
  .po-header {
    display: flex;
  }
  .po-content {
    display: flex;
    flex-wrap: wrap;
  }
  .dialog-row-header {
    flex: 1;
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
  }
  .dialog-row-content {
    width: 50%;
    padding: 14px 0;
  }
</style>

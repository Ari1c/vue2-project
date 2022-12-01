<template>
  <div>
    <div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <!-- <el-badge is-dot class="item">数据查询</el-badge> -->
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button style="margin-bottom: 10px" type="primary" icon="el-icon-setting" size="mini" @click="handleSetting">设置</el-button>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="设备名称" align="center" prop="pduDeviceName" />
        <el-table-column label="支路总数" align="center" prop="outletQuantity" />
        <el-table-column label="最高输出电流" align="center" prop="maxCurrent" />
        <el-table-column label="最低输出电流" align="center" prop="minCurrent" />
        <el-table-column label="操作" align="center" prop="createTime" width="180">
          <template slot-scope="{ row }">
            <!-- todo v-model 绑定一个值 -->
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
            <el-row class="dialog-row-header">
              <el-col :span="2">支路</el-col>
              <el-col :span="10">输出电流上限</el-col>
              <el-col :span="10">输出电流下限</el-col>
            </el-row>
            <el-row class="dialog-row-header">
              <el-col :span="2">支路</el-col>
              <el-col :span="10">输出电流上限</el-col>
              <el-col :span="10">输出电流下限</el-col>
            </el-row>
          </div>
          <div class="po-content">
            <el-row class="dialog-row-content" v-for="item in form.settings" :key="item.outletIndex">
              <el-col :span="2">{{item.outletIndex}}</el-col>
              <el-col :span="10">
                <!-- :rules="rules.currentUpperLimit" -->
                <!-- :prop="'settings.'+ item.outletIndex + '.currentUpperLimit'" -->
                <el-form-item :prop="'settings.'+ item.outletIndex + '.currentUpperLimit'" :rules="rules.currentUpperLimit" label-width="0">
                  <el-input type="number" v-model="item.currentUpperLimit" :min="1" :max="2147483647">
                    <template slot="append">A</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <!-- :rules="rules.currentLowerLimit" -->
                <!-- :prop="'settings.'+ item.outletIndex + '.currentLowerLimit'" -->
                <el-form-item label-width="0" prop="currentLowerLimit">
                  <el-input type="number" v-model="item.currentLowerLimit" :min="1" :max="2147483647">
                    <template slot="append">A</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-form-item v-if="this.display" label="应用于">
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
  getBranchThresholdList,
  detailBranchThreshold,
  updateBranchThreshold
} from '@/api/setting/threshold/branchThreshold';

  export default {
    name: 'branchThreshold',
    data() {
      const validateUpper = (rules, value, cb) => {
        console.log('rules: ---', rules, value)
        const fieldIndex = rules.field.split('.')[1]
        const { currentLowerLimit } = this.form.settings.find(item => `${item.outletIndex}` === fieldIndex);
        if (value < currentLowerLimit) {
          cb('aaaa')
        }

        cb();
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
        // set open
        setOpen: false,
        // 是否隐藏（应用全部设备选项）
        display: true,
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          // 设备名称
          name: ''
        },
        // 表单参数
        form: {},
        // 校验规则
        rules: {
          currentUpperLimit: [
            { validator: validateUpper, trigger: 'blur' },
            { pattern: /^[1-9]d*$/, message: '请输入正整数', trigger: 'blur' }
          ],
          currentLowerLimit: [
            { pattern: /^[1-9]d*$/, message: '请输入正整数', trigger: 'blur' }
          ]
        },
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
            {outletIndex: 1,currentUpperLimit: '',currentLowerLimit: ''},
            {outletIndex: 2,currentUpperLimit: '',currentLowerLimit: ''},
            {outletIndex: 3,currentUpperLimit: '',currentLowerLimit: ''},
            {outletIndex: 4,currentUpperLimit: '',currentLowerLimit: ''},
            {outletIndex: 5,currentUpperLimit: '',currentLowerLimit: ''},
            {outletIndex: 6,currentUpperLimit: '',currentLowerLimit: ''},
            {outletIndex: 7,currentUpperLimit: '',currentLowerLimit: ''},
            {outletIndex: 8,currentUpperLimit: '',currentLowerLimit: ''},
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

        getBranchThresholdList(this.queryParams).then(res => {
          this.list = res.data.records;
          this.total = res.data.total;
          this.selectOpts = res.data.records.map(item => {
            return {
              label: item.pduDeviceName,
              value: item.pduDeviceId
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
        this.open = true;
        this.checked = true;
        this.display = false;
        this.title = '编辑';
        this.isLoading = true;

        detailBranchThreshold(row.pduDeviceId).then(res => {
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
          console.log(valid, this.form, '=====valid')
          return;
          if (valid) {
            updateBranchThreshold(this.form).then(() => {
              this.$message.success("设置成功");
              this.open = false;
              this.getList();
            })
          }
        });
      }
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
    display: flex;
    padding-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
  }
  .dialog-row-content {
    width: 50%;
    padding: 14px 0;
  }

  // .el-form-item {
  //   margin-bottom: 0 !important;
  // }

  // .el-input {
  //   .el-input__inner {
  //     padding-right: 0 !important;
  //   }
  // }
</style>

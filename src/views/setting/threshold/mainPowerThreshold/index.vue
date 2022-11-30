<template>
  <div>
    <div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button style="margin-bottom: 10px" type="primary" icon="el-icon-setting" size="mini" @click="handleSetting">设置</el-button>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="设备名称" align="center" prop="pduDeviceName" />
        <el-table-column label="电压上限(V)" align="center" prop="voltageUpperLimit" />
        <el-table-column label="电压下限(V)" align="center" prop="voltageLowerLimit" />
        <el-table-column label="电流上限(A)" align="center" prop="currentUpperLimit" />
        <el-table-column label="电流下限(A)" align="center" prop="currentLowerLimit" />
        <el-table-column label="设置人" align="center" prop="updateName" />
        <el-table-column label="设置时间" align="center" prop="updateTime" />
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
      <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="电压上限" prop="voltageUpperLimit">
                <el-input type="number" v-model="form.voltageUpperLimit" placeholder="">
                  <template slot="append">V</template>
                </el-input>
              </el-form-item>
              <el-form-item label="电压下限" prop="voltageLowerLimit">
                <el-input type="number" v-model="form.voltageLowerLimit" placeholder="">
                  <template slot="append">V</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电流上限" prop="currentUpperLimit">
                <el-input type="number" v-model="form.currentUpperLimit" placeholder="">
                  <template slot="append">A</template>
                </el-input>
              </el-form-item>
              <el-form-item label="电流下限" prop="currentLowerLimit">
                <el-input type="number" v-model="form.currentLowerLimit" placeholder="">
                  <template slot="append">A</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
import { deepClone } from '@/utils';
import {
  getMPSThresholdList,
  updateMPSThreshold,
  getAllUsable
} from '@/api/setting/threshold/mpsThreshold/MPSThreshold';

  export default {
    name: 'actualMonitoring',
    data() {
      const validateVupper = (rule, value, cb) => {
        console.log(1)
        // validateVupper()
        if (this.form.voltageLowerLimit > value) {
          cb(new Error('上限必须大于下限'))
        }

        cb();
      }
      const validateVlower = (rule, value, cb) => {
        console.log(2)
        if (this.form.voltageUpperLimit < value) {
          cb(new Error('上限必须大于下限'))
        }

        cb();
      }

      const validateAupper = (rule, value, cb) => {
        console.log(3)
        if (this.form.currentLowerLimit > value) {
          cb(new Error('上限必须大于下限'))
        }

        cb();
      }

      const validateAlower = (rule, value, cb) => {
        console.log(4)
        if (this.form.currentUpperLimit < value) {
          cb(new Error('上限必须大于下限'))
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
        // 是否隐藏（应用全部设备选项）
        display: true,
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
          voltageUpperLimit: [
            { validator: validateVupper, trigger: 'change' }
          ],
          voltageLowerLimit: [
            { validator: validateVlower, trigger: 'change' }
          ],
          currentUpperLimit: [
           { validator: validateAupper, trigger: 'change' }
          ],
          currentLowerLimit: [
            { validator: validateAlower, trigger: 'change' }
          ]
        },
        // todo
        selectOpts: []
      }
    },
    mounted() {
      this.getList();
      getAllUsable().then(res => {
        const __ = res && res.data.map((i) => {
          return {
            value: i.id,
            label: i.name
          }
        })
        this.selectOpts = __;

      })
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
          voltageUpperLimit: '',
          voltageLowerLimit: '',
          currentUpperLimit: '',
          currentLowerLimit: '',
          pduDeviceId: this.selectOpts[0].value,
          applyAll: false
        };
        this.resetForm("form");
      },
      cancel() {
        this.open = false;
        this.reset();
      },
      getList() {
        this.loading = true;

        getMPSThresholdList(this.queryParams).then(res => {
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
        this.display = true;
        this.title = '设置';
      },
      handleModify(row) {
        this.reset();
        this.title = '编辑';
        this.open = true;
        this.display = false;
        this.form =  Object.assign(deepClone(row), { applyAll:false });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateMPSThreshold(this.form).then(() => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
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
</style>

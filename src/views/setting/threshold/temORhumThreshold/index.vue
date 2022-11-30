<template>
  <div>
    <div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="88px">
        <el-form-item label="设备名称" prop="name">
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
        <el-table-column label="传感器" align="center" prop="sensorId" />
        <el-table-column label="温度告警上限(℃)" align="center" prop="temperatureOneUpperLimit">
          <template slot-scope="{ row }">
            <div>传感器一：{{ row.temperatureOneUpperLimit }}</div>
            <div>传感器二：{{ row.temperatureTwoUpperLimit }}</div>
          </template>
        </el-table-column>
        <el-table-column label="温度告警下限(℃)" align="center" prop="createBy">
          <template slot-scope="{ row }">
            <div>传感器一：{{ row.temperatureOneLowerLimit }}</div>
            <span>传感器二：{{ row.temperatureTwoLowerLimit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="湿度告警上限(%)" align="center" prop="createBy">
          <template slot-scope="{ row }">
            <div>传感器一：{{ row.humidityOneUpperLimit }}</div>
            <div>传感器二：{{ row.humidityTwoUpperLimit }}</div>
          </template>
        </el-table-column>
        <el-table-column label="湿度告警下限(%)" align="center" prop="createBy">
          <template slot-scope="{ row }">
            <div>传感器一：{{ row.humidityOneLowerLimit }}</div>
            <div>传感器二：{{ row.humidityTwoLowerLimit }}</div>
          </template>
        </el-table-column>
        <el-table-column label="设置人" align="center" prop="updateBy" />
        <el-table-column label="操作" align="center">
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
      <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
        <el-form ref="form" :model="form" label-width="80px">
          <el-row class="dialog-row-header">
            <el-col :span="2">传感器</el-col>
            <el-col :span="5">温度告警上限(℃)</el-col>
            <el-col :span="5">温度告警下限(℃)</el-col>
            <el-col :span="5">湿度度告警上限(%)</el-col>
            <el-col :span="5">湿度告警下限(%)</el-col>
          </el-row>
          <el-row class="dialog-row-content">
            <el-col :span="2">1</el-col>
            <el-col :span="5" >
              <el-input type="number" placeholder="" v-model="form.temperatureOneUpperLimit"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input type="number" placeholder="" v-model="form.temperatureOneLowerLimit"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input type="number" placeholder="" v-model="form.humidityOneUpperLimit"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input type="number" placeholder="" v-model="form.humidityOneLowerLimit"></el-input>
            </el-col>
          </el-row>
          <el-row class="dialog-row-content">
            <el-col :span="2">2</el-col>
            <el-col :span="5">
              <el-input type="number" placeholder="" v-model="form.temperatureTwoUpperLimit"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input type="number" placeholder="" v-model="form.temperatureTwoLowerLimit"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input type="number" placeholder="" v-model="form.humidityTwoUpperLimit"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input type="number" placeholder="" v-model="form.humidityTwoLowerLimit"></el-input>
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
  getTemHumThresholdList,
  // temHumThresholdList,
  updateTemHumThreshold
} from '@/api/setting/threshold/temhumThreshold';

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
        // 表单规则
        rules: {

        },
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
          pduDeviceId: this.selectOpts[0].value
        };
        this.resetForm("form");
      },
      cancel() {
        this.open = false;
        this.reset();
      },
      getList() {
        // todo
        this.loading = true;

        getTemHumThresholdList(this.queryParams).then(res => {
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
        this.title = '编辑';
        this.display = false;
        this.form = deepClone(row);
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateTemHumThreshold(this.form).then(() => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            })
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

<template>
  <div>
    <div>
      <el-table v-loading="loading" :data="list">
        <el-table-column label="数据获取时间（min）" align="center" prop="value" />
        <el-table-column label="设置人" align="center" prop="updateName" />
        <el-table-column label="操作时间" align="center" prop="updateTime" />
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
        <el-form ref="form" :model="form">
          <el-form-item label="数据获取时间配置">
            <el-input-number controls-position="right" :min="5" :max="59" v-model="form.value" placeholder="" />
            <span>分钟</span>
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
  getStepList,
  updateStep
} from '@/api/setting/threshold/getDataTime';

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
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10
        },
        // 表单参数
        form: {},
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
        this.handleQuery();
      },
      reset() {
        this.form = {
          value: '',
        };
        this.resetForm("form");
      },
      cancel() {
        this.open = false;
        this.reset();
      },
      getList() {
        this.loading = true;

        getStepList(this.queryParams).then(res => {
          this.list = res.data.records;
          this.loading = false;
        }).finally(() => {
          this.loading = false;
        })
      },
      handleModify(row) {
        this.reset();
        this.title = '编辑';
        this.open = true;
        this.form = deepClone(row);
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateStep(this.form.id, {
              fetchInterval: this.form.value
            }).then(() => {
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

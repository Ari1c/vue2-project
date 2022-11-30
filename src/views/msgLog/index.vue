<template>
  <div>
   <div class="app-container">
     <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="queryParams.phone" placeholder="请输入" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="邮件地址" prop="email">
          <el-input v-model="queryParams.email" placeholder="请输入" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="类型" prop="deviceName">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择">
            <el-option
              v-for="item in selectOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
     </el-form>

     <el-row :gutter="24" v-loading="loading">
        <el-col :span="24" v-for="item in list" :key="item.id" style="margin: 5px 0;">
          <el-card shadow="always">
            <template #header>
              <div class="msg-header">
                <b>接收人：{{item.name}}</b>
                <b>联系方式： {{item.phone}}</b>
                <b>邮件地址： {{item.email}}</b>
                <b>类型：{{ hackType(item) }}</b>
              </div>
            </template>
            <p class="msg-content">
              {{ item.message || '暂无内容' }}
            </p>
            </el-card>
        </el-col>
      </el-row>
      <el-row v-if="!list.length">
        <el-col :span="24" style="text-align: center;">
          <!-- <el-card> -->
            <span style="color: #909399">暂无数据</span>
          <!-- </el-card> -->
        </el-col>
      </el-row>

     <pagination
       :total="total"
       :page.sync="queryParams.pageIndex"
       :limit.sync="queryParams.pageSize"
       @pagination="getList"
     />
   </div>
 </div>
</template>

<script>
 import {
  getMsgLog
 } from '@/api/msgLog';

 export default {
   name: 'alarm',
   data() {
     return {
       loading: false,
       // 总条数
       total: 0,
       selectOpts: [
         { label: '电压', value: 1 },
         { label: '电流', value: 2 },
         { label: '温度', value: 3 },
         { label: '湿度', value: 4 },
         { label: '烟雾', value: 5 },
         { label: '水浸', value: 6 },
         { label: '功率', value: 7 }
       ],
       // 表格数据
       list: [],
       // 查询参数
       queryParams: {
         pageIndex: 1,
         pageSize: 10,
         // 设备名称
         name: '',
         phone: '',
         email: '',
         type: ''
       }
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
       this.queryParams.phone = '';
       this.queryParams.email = '';
       this.queryParams.type = '';

       this.handleQuery();
     },
     getList() {
       this.loading = true;

       getMsgLog(this.queryParams).then(res => {
         this.list = res.data.records;
         this.total = res.data.total;
         this.loading = false;
       }).finally(() => {
         this.loading = false;
       })
     },
     hackType(row) {
      const filterData = this.selectOpts.filter(item => item.value === row.type);

      return filterData[0] && filterData[0].label;
    }
   }
 }
</script>

<style lang="less" scoped>
  .msg-header b {
    padding-right: 20px;
  }
</style>

## 管理系统前端模板

### 构建步骤

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

### 版本说明

#### v1.0.0

- 基于若依框架进行裁剪，适配服务端

#### v1.1.0

- 去除sass，使用less
- 去除cookie，使用localStorage
- 修改每次进入新路由后，user信息重复请求问题
- 优化控制台日志
- 添加svg-icon
- 添加tags-view
- 优化管理系统基础页面（用户、角色、部门、字典、参数设置、操作日志、异常日志）
# React-webpack-nodejs学习练手项目

---

[TOC]

## 前期准备

### 前后端通信

1. create-react-app创建一个react项目，端口在3000
2. nodejs用express起一个后端服务器，端口号为9093
3. 开启Mongodb数据库，用以存储用户数据
4. 利用webpack-dev-server的*proxy*属性实现跨域请求数据
5. 在前端使用**axios**而不是ajax进行项目中的所有前后端数据传递

### 项目文件结构

1. 组件放在Component文件夹下
2. 页面放在Container文件夹下
3. redux代码放在Redux文件夹下
4. 通过页面入口获取用户信息，决定跳转到哪个页面

### 一些细节

* 基于Cookie进行用户验证，express中安装cookie-parser(cookie在前端会由浏览器自动处理)
* webpack中有个babel-plugin-import插件用来实现antd-mobile的按需加载
* webpack的babel配置中需指定`transform-decorators-legacy`来支持装饰器语法糖



## 登录注册页面

### 基本功能实现

1. 简单实现最基本的页面结构，放上logo(如果有的话)
2. 使用antd-mobile的组件来实现一些页面元素，包括但不仅限于
   * List 列表
   * InputItem 输入框
   * WingBlank 两边留白的空div
   * WhiteSpace 空白 可以放置在两个元素之间，留下空白，实现比较良好的视觉效果
   * Button 按钮
   * Radio 单选框
3. 直接在按钮上绑定一个执行`this.props.history.push(url)`的函数即可实现点击按钮跳转页面，当然url这个页面得实现
4. 使用List组件包裹两个InputItem来实现用户名和密码输入框
5. 使用WhiteSpace使页面稍稍好看一些
6. 使用Radio组件中的RadioItem子组件实现身份选择



### 入口路由合法性判断

1. 当用户身份无法验证或者不合法的时候需跳转到首页，即用户登录注册页面
2. 在Component文件夹下的AuthRoute组件中实现
3. AuthRoute组件在生命周期的componetDidUpdate阶段就需要做业务逻辑
4. 使用axios.get方法向后端传递身份认证信息来确认用户身份合法性
5. 后端验证接口由server文件夹下user.js文件实现
6. user.js实现一个身份验证的中间件暴露给server.js调用







### 注意点

* 组件内部在`constructor`内使用`bind`绑定对象比在react元素使用箭头函数绑定对象的性能会好一些
* # React-webpack-nodejs学习练手项目

  ---

  ​

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
  7. AuthRoute不是路由组件(大概是react-router里指定了url的页面组件)，需要用react-router-dom里`withRouter`包裹起来才能获得路由对象，从而实现页面重定向`this.props.history.push('/login')`


  ### 用户注册页面

  1. 登录注册状态由redux实现，代码在user.redux.js中
  2. 用户注册函数register因为需要支持异步，所以返回一个函数，入参为dispatch，这个函数实现与后端交互并验证的功能
  3. register页面引入react-redux的connect函数和刚才实现的register函数，在组件内部使用`this.props.register(param)`来进行调用

  ### 后端功能实现

  1. Mongodb的nodejs库mongoose来实现数据库操作
  2. model.js定义对应的模型：用户信息模型和聊天信息模型，然后暴露一个接口给server.js
  3. server.js引入cookie-parser中间件提供cookie解析功能
  4. 引入body-parser中间件解析前端发来的post请求，其中有账号密码

  ### 根据用户信息页面跳转功能

  1. util.js中实现，用户是boss或者普通用户跳转不同页面
  2. redux的初始状态中新增字段`redirectTo`表示跳即将转的页面，默认为空
  3. 路由组件register中判断redux中数据状态，若`redirectTo`有值，则利用react-router-dom库中的`<Redirect>`组件进行路由跳转
  4. 后端加盐对用户密码进行加密

  ### 用户登录页面

  1. 仿制用户注册页面的redux设置，代码同样在user.redux.js中，但做一些适应性修改
  2. 在moogoose设置中添加`{'pwd':0}`使密码不显示在console口

  ### Cookie保存登录状态

  1. 直接在查询回调函数中调用`res.cookie('userid',doc._id)`即可将moogodb给每条数据分配的唯一id作为字段名为`userid`的cookie返回给前端
  2. 路由为`/info`的的页面需要获取页面cookie，`const {userid} = req.cookie`，并做验证。
  3. 定义静态变量_filter，用以过滤moogodb查询时不想返回给前端的数据，例如pwd
  4. **在AuthRoute中添加了获取用户信息的redux方法，使用户信息页面可以获得后端存储的用户信息 **


  ### 注意点

  * 组件内部在`constructor`内使用`bind`绑定对象比在react元素使用箭头函数绑定对象的性能会好一些，但是还要看场景
  * ES6特性，对象键名即变量名的情况下可以简写，但是这个简写对象约定放在不简写的键值对之前
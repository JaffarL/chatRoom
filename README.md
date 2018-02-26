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
4. **在AuthRoute中添加了获取用户信息的redux方法，是为了将用户信息传到boss或者普通user页面**


### 注意点

* 组件内部在`constructor`内使用`bind`绑定对象比在react元素使用箭头函数绑定对象的性能会好一些，但是还要看场景
* ES6特性，对象键名即变量名的情况下可以简写，但是这个简写对象约定放在不简写的键值对之前

## 用户信息页面

### BOSS信息页面

1. Container文件夹下新建bossinfo.js文件，在Index中增加路由
2. 使用antd-mobile中的`NavBar`导航栏组件放在页面最上方
3. 利用箭头函数给不同的InputItem绑定同一个函数传递不同的参数实现函数复用(???)
4. 职位描述这栏使用TextAreaItem使得其提供换行输入功能
5. 后端数据成功返回后跳转到BOSS列表页面
6. 利用prop-types实现输入类型检查

### 牛人信息页面

1. 和BOSS信息页面差不多，部分字符串，和输入信息修改

### 头像选择功能

1. Component下avatar-selector文件夹下

2. 使用antd-mobile的`gird`来网格化显示头像，有其固定格式，先把所有名字存在一个字符串中，再做链式处理

```js
   const avatarList = 'boy,bull'
   				.split(',')
   				.map(v=>({
       			icon:require(`../img/${v}.png`),
                   text:v
   }))
```

3. 选择头像功能函数实现由boss信息页面传递进来

### 信息页面的Redux

1. 用户信息更新函数(updata)由user.redux.js文件实现
2. redux页面中的login,register,update函数的成功dispatch函数统一成`authSuccess`
3. authSuccess中做简单的过滤，不将密码返回给前端

### 后端实现

1. 相应的`/update`路由要对cookie进行校验，若没有cookie则返回错误
2. 数据库根据cookie查询数据并更新`findByIdAndUpdate`



## 列表页面

### DashBoard

1. 共四个页面：boss，牛人，我，消息
2. index.js中的`Switch`组件，增加若已设置路由都未命中时显示的组件`DashBorad`，`Swtich`组件中的路由只要命中一个其他就会忽略，这个`DashBorad`组件也可以替代404页面
3. 与redux相连获取用户信息，不同身份或者页面显示不同的标签或者标题头
4. 引入`Switch`页面来渲染不同的的页面内容

### NavLinkBar底部标签

1. antd-mobile里的`TabBar`组件来实现页面下部的选项标签
2. `TabBar-item`中属性配置参考官网

### 牛人列表页面

1. 文件名为boss.js，因为boss才应该看到牛人
2. `componentDidUpdate()`函数中直接发起get请求后端`/list`路由获取牛人信息
3. 后端优化`/list`路由，首先鉴定用户身份再返回对应应该获得的数据
4. antd-mobile`Card`组件显示牛人列表，配置信息参考官网

### BOSS列表页面

1. 类似牛人列表页面，字符串和身份认证等小地方做简单修改

### redux/优化

1. chatuser.redux.js文件中实现，管理列表页面所有redux
2. 将获取用户信息的`axios.get()`放在redux里`getUserList()`函数
3. reducers.js中将reducer合并
4. usercard.js实现通用组件供显示牛人/boss页面实现

## 用户中心

### 基础页面实现

1. component/user/user.js
2. antd-mobile`Result`组件展示个人中心用户信息，配置参考官网
3. 注入redux获取个人信息
4. 利用`split('\n').map(v=>{...})`来实现换行，要记得加**key**
5. `multipleLine`过长时换行

### 注销功能

1. 核心思想就是清除cookie
2. 安装browser-cookie
3. 利用`browser-cookie.erase('cookiename')`接口删除浏览器端的cookie缓存
4. 清除redux数据，`user.redux.js`中实现`logoutSubmit`函数
5. 退出登录之后重定向至login界面
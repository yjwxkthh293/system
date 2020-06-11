import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5000';

//登陆  account 账号  password  密码
export const Login = (account, password) => axios.post("/users/checkLogin", { account, password })

// 首页报表接口
export const TotalData = () => axios.get("/order/totaldata")
// 订单报表接口
export const OrderTotal = (date) => axios.get("/order/ordertotal", { params: { date } })

// 验证token是否过期
export const CheckToken = (token) => axios.get("/users/checktoken", { params: { token } })


// 获取账号（个人中心）信息
export const AcountInfo = (id) => axios.get("/users/accountinfo", { params: { id } })
// -----------------------------------------------------账号管理的接口----------------------------------------------------------------------------------------

//添加账号  userGroup  用户组
export const addAccount = (account, password, userGroup) => axios.post("/users/add", { account, password, userGroup })

//分页接口  currentPage 当前页码  pageSize 每页条数
export const AcountList = (currentPage, pageSize) => axios.get("/users/list", { params: { currentPage, pageSize } })


//删除账号
export const delAccount = id => axios.get("/users/del", { params: { id } })
//批量删除账号接口
export const BatchDel = ids => axios.get("/users/batchdel", { params: { ids } })

//修改密码 oldPwd 旧密码
export const CheckOldPwd = (oldPwd, id) => axios.get("/users/checkoldpwd", { params: { oldPwd, id } })
//修改密码 newPwd 新密码
export const EditPwd = (newPwd, id) => axios.post("/users/editpwd", { newPwd, id })

//修改账号接口
export const EditAccount = (id, account, userGroup) => axios.post("/users/edit", { id, account, userGroup })


//-----------------------------------------------商品管理的街道口-------------------------------------------------------------------

//获取商品分类接口  currentPage 当前页  pageSize  每页条数
export const CateList = (currentPage, pageSize) => axios.get('/goods/catelist', { params: { currentPage, pageSize } })


export const CateGories = () => axios.get('/goods/categories')

//删除分类接口 
export const DelCate = (id) => axios.get('/goods/delcate', { params: { id } })

//添加商品分类
export const AddCate = (cateName, state) => axios.post('/goods/addcate', { cateName, state })
// 修改商品分类
export const EditCate = (id, cateName, state) => axios.post('/goods/editcate', { id, cateName, state })

//添加商品 
// name 商品名称  
// category 商品分类  
// price 商品价格
//imgUrl 商品图片地址
//goodsDesc 商品描述
export const Add = (name, category, price, imgUrl, goodsDesc) => axios.post('/goods/add', { name, category, price, imgUrl, goodsDesc })

//修改商品
export const EditGoods = (name, category, price, imgUrl, goodsDesc, id) => axios.post('/goods/edit', { name, category, price, imgUrl, goodsDesc, id })


//商品列表
export const GoodsList = (currentPage, pageSize) => axios.get('/goods/list', { params: { currentPage, pageSize } })

//删除商品
export const DelGodds = (id) => axios.get('/goods/del', { params: { id } })


//-----------------------------订单管理接口--------------------------------------------------------------------------------

//获取订单列表
// currentPage  当前页码
// pageSize每页条数
// orderNo订单号
// consignee收货人
// phone手机号
// orderState订单状态
// date时间范围，字符串格类型如: ["2019-10-05 00:00:00","2019-10-10 00:00:00"]

export const OrderList = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get('/order/list', { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date } })

// 获取订单详情
export const Detail = (id) => axios.get('/order/detail', { params: { id } })

// 25. 修改订单
export const EditOrder = (id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState) => axios.post('/order/edit', { id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState })

// 查询
export const Search = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get('/order/search', { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date } })


//-----------------------------------------------商铺管理接口------------------------------------------------------------------------
// 26. 获取店铺详情
export const Info = () => axios.get('/shop/info', { params: {} })

// 28. 店铺内容修改
export const EditShops = (id, name, bulletin, avatar, deliveryPrice, deliveryTime, description, score, sellCount, supports, date, pics) => axios.post('/shop/edit', { id, name, bulletin, avatar, deliveryPrice, deliveryTime, description, score, sellCount, supports, date, pics })
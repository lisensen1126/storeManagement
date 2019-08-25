import {$fetch, root} from '@/plugins/Fetch'
import {$axios} from '@/plugins/axios'

export default {
  methods: {
    // 门店小程序名称和icon store/account_info
    getStoreInfoApi (query) {
      return $fetch('store/account_info', {
        method: 'GET',
        body: query,
      })
    },
    // 推送记录列表
    pushRecordListApi (query) {
      return $fetch('template_message/task_log/list', {
        method: 'GET',
        body: query,
      })
    },
    // 新建推送
    addPushApi (query) {
      return $fetch('template_message/task/add', {
        method: 'POST',
        body: query,
      })
    },
    // 获取优惠券列表
    fetchCoupons (query) {
      return $fetch('marketing/coupon', {query})
    },
    // 获取优惠券记录列表
    fetchRecordList (query) {
      return $fetch('marketing/coupon/record/list', {query})
    },
    // 优惠券使用详情
    getCouponDetail (query) {
      return $fetch('marketing/coupon/record/detail', {query})
    },
    // 选择养护卡列表(v3.8.5 新接口)
    getUpkeepCardList (data) {
      return $fetch('marketing/coupon/upkeep/list', {
        method: 'GET',
        body: data,
      })
    },
    // 获取营销配置列表
    marketingAllocation (query) {
      return $fetch('marketing/setting', {query})
    },
    // 配置营销配置
    setMarketing (query) {
      return $fetch('marketing/setting', {
        method: 'POST',
        body: query,
      })
    },
    // 获取商品分类&服务分类列表
    categoryList (query) {
      return $fetch('marketing/coupon/category/list', {query})
    },
    // 创建优惠券
    createCouponApi (query) {
      return $fetch('marketing/coupon', {
        method: 'POST',
        body: query,
      })
    },
    // 删除优惠券
    deleteCoupon (query) {
      return $fetch(`marketing/coupon/${query.couponId}`, {
        method: 'POST',
        body: query,
      })
    },
    editCouponApi (query) {
      return $fetch('marketing/coupon/edit', {
        method: 'POST',
        body: query,
      })
    },
    getCouponApi (query) {
      return $fetch(`marketing/coupon/${query.couponId}`, {
        method: 'GET',
      })
    },
    // 优惠券是否展开
    displayCoupon (query) {
      return $fetch(`marketing/coupon/update/${query.couponId}/${query.isShow}`, {
        method: 'POST',
        body: query,
      })
    },
    // 搜索用户列表
    fetchCList (query) {
      return $fetch('marketing/coupon/customer/list', {
        method: 'GET',
        body: query,
      })
    },
    // 发放优惠券
    addSendCoupon (query) {
      return $fetch('marketing/coupon/grant/send', {
        method: 'POST',
        body: query,
      })
    },
    // 发布活动
    activeAdd (data, id) {
      return $fetch(`lottery/${id}`, {
        method: 'POST',
        body: data,
      })
    },
    // 查看活动详情
    activeDetail (id, query) {
      return $fetch(`lottery/${id}`, { query })
    },
    // 活动列表
    activeList (query) {
      return $fetch('lottery', {query})
    },
    // 活动下架
    activeOff (data) {
      const id = data.activity_id
      return $fetch(`lottery/${id}/offShelves`, {
        method: 'POST',
      })
    },
    // 中奖客户列表
    winCustomerList (id, query) {
      return $fetch(`lottery/${id}/record`, {query})
    },
    // 优惠券列表
    getPrive () {
      return $fetch('lottery/prize')
    },
    // 团单列表
    getTuanDanListApi (query) {
      return $fetch('tuan_gou/coupon/tuan_list', {query})
    },
    // 短信购买记录 /purchase-list
    getPurchaseListApi (query) {
      return $fetch('sms/purchase-list', {
        method: 'GET',
        body: query,
      })
    },
    // 短信发送记录详情 send-detail/{id}
    getSendDetailApi (query) {
      return $fetch(`sms/send-detail/${query.id}`, {
        method: 'GET',
        body: query,
      })
    },
    // 获取统计数据
    getStatisticalApi () {
      return $fetch('sms/statistics')
    },
    // 短信发送记录
    getSmsSendList (query) {
      return $fetch('sms/send-list', {query})
    },
    // 短信套餐列表
    getSmsListApi () {
      return $fetch('system_product/list')
    },
    // 短信套餐详情
    getSmsDetailApi (query) {
      return $fetch('system_product/detail', {query})
    },
    // 推荐客户分类数据 sms/recommend_category_list
    getSmsCategoryApi (query) {
      return $fetch('sms/recommend_category_list', {
        method: 'GET',
        body: query,
      })
    },
    // 推荐客户手机号列表 sms/recommend_list
    getSmsRecListApi (query) {
      return $fetch('sms/recommend_list', {
        method: 'GET',
        body: query,
      })
    },
    // 导入用户手机号码
    exportPhoneApi (body) {
      let formdata = new FormData()
      formdata.append('excel', body.excel)
      let promise = new Promise((reslove, reject) => {
        return $axios({
          url: `${root}/sms/import`,
          method: 'post',
          data: formdata,
        }).then((res) => {
          return reslove(res)
        })
      })
      return promise
    },
    // 获取模板分类 sms/template_category
    getSmsTemplateApi (query) {
      return $fetch('sms/template_category', {
        method: 'GET',
        body: query,
      })
    },
    // 获取模板列表 sms/template_list
    getTemplateListApi (query) {
      return $fetch('sms/template_list', {
        method: 'GET',
        body: query,
      })
    },
    // 支付
    paymentApi (query) {
      return $fetch('system_product/pre_pay', {
        method: 'POST',
        body: query,
      })
    },
    // 公共二维码
    getCodeApi (query) {
      return $fetch('common/qr_code', {
        method: 'GET',
        body: query,
      })
    },
    // 公共二维码
    getPayOrderDetail (query) {
      return $fetch('system_product/order_detail', {
        method: 'GET',
        body: query,
      })
    },
    //  发送消息
    sendMsmApi (query) {
      return $fetch('sms/send', {
        method: 'POST',
        body: query,
      })
    },
    // 可用优惠券列表
    fetchCouponAPi (query) {
      return $fetch('marketing/coupon/list_condition', {
        method: 'GET',
        body: query,
      })
    },
    // 发放优惠券搜索客户列表接口
    fetchCustomerApi (query) {
      return $fetch('common/search_customer', {
        method: 'GET',
        body: query,
      })
    },
    // 获取短信统计
    fetchMessageCountApi (query) {
      return $fetch('common/sms_statistics', {
        method: 'GET',
        body: query,
      })
    },
    // 推送用户查询
    searchCustomer (data) {
      return $fetch('customer/search_template_user', {
        method: 'POST',
        body: data,
      })
    },
    // 推送列表
    sendPushListApi (data) {
      return $fetch('template_message/task/list', {
        method: 'GET',
        body: data,
      })
    },
    // 小程序创建相关 - 小程序授权信息
    fetchAuthorizations (query) {
      return $fetch('wx_auth/open_platform_info', {
        method: 'GET',
        query,
      })
    },
    // 推送列表详情
    sendPushDetailApi (data) {
      return $fetch('template_message/task/detail', {
        method: 'GET',
        body: data,
      })
    },
  },
}

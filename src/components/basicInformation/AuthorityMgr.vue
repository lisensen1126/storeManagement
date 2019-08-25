<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 企业微信权限
      h3.cur-staff 当前成员：{{staffInfo.memUsername}}
 
      table.table
        thead
          tr
            td(width='100') 生意管理
            td(width='100')
            td(width='100')
        tbody
          tr
            td(width='100') 业绩看板
            td(width='100')
              .content-item.switch
                input(type="checkbox", id="checkbox3", :checked="switches.performancePanel.check", @change="changeShowStatus('performancePanel','check')")
                label(for="checkbox3")
              span.op-name 查看    
            td
          tr
            td  客户评价
            td(width='100')
              .content-item.switch
                input(type="checkbox", id="checkbox4", :checked="switches.customerComment.check", @change="changeShowStatus('customerComment','check')")
                label(for="checkbox4")
              span.op-name 查看    
            td(width='100')
              .content-item.switch
                input(type="checkbox", id="checkbox5", :checked="switches.customerComment.operation", @change="changeShowStatus('customerComment','operation')")
                label(for="checkbox5")
              span.op-name 操作   
      .split-line &nbsp;
      table.table
        thead
          tr
            td(width='100') 生意工具
            td(width='100')
            td(width='100')
        tbody
          tr
            td  预约核销
            td(width='100')
              .content-item.switch
                input(type="checkbox", id="checkbox8", :checked="switches.appointment.check", @change="changeShowStatus('appointment','check')")
                label(for="checkbox8")
              span.op-name 查看    
            td(width='100')
              .content-item.switch
                input(type="checkbox", id="checkbox9", :checked="switches.appointment.operation", @change="changeShowStatus('appointment','operation')")
                label(for="checkbox9")
              span.op-name 操作   
          tr
            td(width='100')
              span 开单收款
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'管理员工企微端开单收款权限'")
                .el-icon-question(slot="reference")
            td
            td(width='100')
              .content-item.switch
                input(type="checkbox", id="checkbox10", :checked="switches.offlineBuy.operation", @change="changeShowStatus('offlineBuy','operation')")
                label(for="checkbox10")
              span.op-name 操作    
      .split-line &nbsp;
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData()") 保存
          a.button.large(@click="goBack()") 取消

</template>


<script>
import Api from '@/mixins/modules/employee'
import ServiceTab from '@/components/generics/ServiceTab'
export default {
  mixins: [Api, ServiceTab],
  data () {
    return {
      memUid: '', // 员工memUid
      staffInfo: {}, // 员工信息
      switches: { // 开关状态
        performancePanel: {     // 业绩看板
          check: true,
        },
        customerComment: {      // 客户评价
          check: true,
          operation: true,
        },
        appointment: {          // 预约核销
          check: true,
          operation: true,
        },
        offlineBuy: {           // 开单收款
          operation: false,
        },
      },
      auth_ids: {},
    }
  },
  async mounted () {
    this.memUid = this.$route.query.id
    await this.getStaffInfo()
    await this.getAuthInfo()
  },
  methods: {
    async getStaffInfo () {
      try {
        const {result, response} = await this.getEmployee(this.memUid)
        if (result && response) {
          this.staffInfo = result
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取员工信息失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取员工信息失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
      }
    },
    async getAuthInfo () {
      try {
        const {result, response} = await this.getStaffAuthApi({mem_uid: this.memUid})
        if (result.code === 0 && response.status === 200) {
          let permission = result.data.permission
          this.switches = {
            performancePanel: {     // 业绩看板
              check: permission.YJKBR.hasPermission === 1,
            },
            customerComment: {      // 客户评价
              check: permission.KHPJR.hasPermission === 1,
              operation: permission.KHPJO.hasPermission === 1,
            },
            appointment: {          // 预约核销
              check: permission.YYHXR.hasPermission === 1,
              operation: permission.YYHXO.hasPermission === 1,
            },
            offlineBuy: {           // 开单收款
              operation: permission.KDSKO.hasPermission === 1,
            },
          }
          Object.keys(permission).forEach(item => {
            this.auth_ids[permission[item]['directory_key']] = permission[item]['id']
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取员工权限失败',
            content: '出错啦！错误码：' + ((result && result.code !== undefined) ? ` ${result.code}` : ` ${response.status}`) + ((result && result.message !== undefined) ? ` ${result.message}` : ` ${response.statusText}`),
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取员工权限失败',
          content: `服务异常，请稍后再试 ${err}`,
        })
      }
    },
    goBack () {
      this.$router.replace({
        name: 'employeeList',
        query: {
          save: 1,
        },
      })
    },
    /**
     * 改变按钮的状态
     * @param name 对象名称
     * @param type 操作类型，check查看，operation操作
     */
    changeShowStatus (name, type) {
      this.switches[name][type] = !this.switches[name][type]
      // 如果当前操作对象是check，并且有operation，并且check是关闭的，那么关闭operation
      if (type === 'check' && !this.switches[name]['check'] && this.switches[name].hasOwnProperty('operation')) {
        this.switches[name]['operation'] = false
      }
      // 如果当前操作对象是operation，并且有check，并且operation是打开的，那么打开check
      if (type === 'operation' && this.switches[name]['operation'] && this.switches[name].hasOwnProperty('check')) {
        this.switches[name]['check'] = true
      }
    },
    async saveData () {
      let closeIds = []
      let openIds = []
      if (!this.switches.performancePanel.check) {
        closeIds.push(this.auth_ids.YJKBR)
      }
      if (!this.switches.customerComment.check) {
        closeIds.push(this.auth_ids.KHPJR)
      }
      if (!this.switches.customerComment.operation) {
        closeIds.push(this.auth_ids.KHPJO)
      }
      if (!this.switches.appointment.check) {
        closeIds.push(this.auth_ids.YYHXR)
      }
      if (!this.switches.appointment.operation) {
        closeIds.push(this.auth_ids.YYHXO)
      }
      if (this.switches.offlineBuy.operation) {
        openIds.push(this.auth_ids.KDSKO)
      }
      try {
        const {result, response} = await this.setStaffAuthApi({
          mem_uid: this.memUid,
          close_directory_ids: closeIds,
          open_directory_ids: openIds,
        })
        if (result.code === 0 && response.status === 200) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '设置员工权限成功！',
            resolve: () => {
              this.$router.push({
                name: 'employeeList',
              })
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '设置员工权限失败！',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '设置员工权限成失败！',
          content: `服务异常，请稍后再试 ${err}`,
        })
      } finally {
        await this.getAuthInfo()
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.nav-back-btn
  position absolute
  top 36px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
.cur-staff
  text-indent 15px
  margin  15px 0 5px 0
.op-name
  vertical-align middle
  margin-left 10px
.split-line
  height 1px  
  background #f0f1f2
.table
  tr
    background #fff
.content-wrapper
  flex-grow 1
</style>



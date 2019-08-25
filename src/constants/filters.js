const filters = {
  workType (val) {
    if (!val) {
      return '-'
    } else {
      let typeStr = ''
      val.forEach((v, i) => {
        typeStr += v === 'WASHING' ? (i === val.length - 1 ? '洗车' : '洗车/')
        : v === 'MAINTENANCE' ? (i === val.length - 1 ? '保养' : '保养/')
        : v === 'REPAIR' ? (i === val.length - 1 ? '维修' : '维修/')
        : (i === val.length - 1 ? '美容' : '美容/')
      })
      return typeStr
    }
  },
  licensePlate (val) {
    let plateStr = ''
    val.forEach((v, i) => {
      plateStr += i === val.length - 1 ? v.license_plate : v.license_plate + '/'
    })
    return plateStr
  },
  hourMinute (val) {
    return val.slice(0, -3)
  },
  hourMinuteDate (val) {
    return val.slice(11, 16)
  },
  position (val) {
    let positionStr = ''
    if (!val) {
      return '-'
    } else {
      val.forEach((v, i) => {
        positionStr += v === 'BOSS' ? (i === val.length - 1 ? '老板' : '老板/')
        : v === 'MANAGER' ? (i === val.length - 1 ? '店长' : '店长/')
        : (i === val.length - 1 ? '客户经理' : '客户经理/')
      })
      return positionStr
    }
  },
}

export const WORK_TYPE = filters.workType // 工位类型
export const LICENSE_PLATE = filters.licensePlate // 车牌号
export const HOUR_MINUTE = filters.hourMinute // 时间（小时分钟）
export const HOUR_MINUTE_DATE = filters.hourMinuteDate // 日期时间（小时分钟）
export const POSITION = filters.position // 职位类型

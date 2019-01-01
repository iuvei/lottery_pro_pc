export function initSelfContractsItem(data) {
  data.forEach(item => {
    let getStatus = getStatusFn(item.status, item.processing_status)
    item['statusTxt'] = getStatus.statusTxt
    item['isOperate'] = getStatus.isOperate
  })
  return data
}


function getStatusFn(status, process_status) {
  let statusTxt,isOperate
  if (status === '0' && process_status === '1') {
    statusTxt = '待签订'
    isOperate = true
  }
  if (status === '1' && process_status === '0') {
    statusTxt = '已签订'
    isOperate = false
  }
  if (status === '1' && process_status === '1') {
    statusTxt = '待启动'
    isOperate = true
  }
  if (status === '1' && process_status === '2') {
    statusTxt = '已签订未启用的契约上级想取消'
    isOperate = true
  }
  if (status === '2' && process_status === '0') {
    statusTxt = '已启动'
    isOperate = false
  }
  if (status === '2' && process_status === '2') {
    statusTxt = '已启用的契约上级想取消'
    isOperate = true
  }
  return {statusTxt : statusTxt, isOperate: isOperate}
}


export function initSubContractsItem(data) {
  data.forEach(item => {
    let getStatus = getSubStatusFn(item.status, item.processing_status)
    item['statusTxt'] = getStatus.statusTxt
    item['operateType'] = getStatus.operateType
  })
  return data
}


function getSubStatusFn(status, process_status) {
  let statusTxt,operateType
  if (status === '0' && process_status === '0') {
    statusTxt = '已创建'
    operateType = 1
  }
  if (status === '0' && (process_status === '1' || process_status === '2')) {
    statusTxt = '已创建,已发出'
    operateType = 0
  }
  if (status === '1' && process_status === '0') {
    statusTxt = '已接受,是否启用'
    operateType = 1
  }
  if (status === '1' && process_status === '1') {
    statusTxt = '已发出启用'
    operateType = 0
  }
  if (status === '1' && process_status === '2') {
    statusTxt = '取消签订'
    operateType = 0
  }
  if (status === '2' && process_status === '0') {
    statusTxt = '已启用'
    operateType = 0
  }
  if (status === '2' && (process_status === '1' || process_status === '2')) {
    statusTxt = '撤回启用'
    operateType = 0
  }
  return {statusTxt : statusTxt, operateType: operateType}
}
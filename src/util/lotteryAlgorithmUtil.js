import { sliceStrToArr, getComposeByArrays } from '../util/index'
// 组合算法
// 参考https://github.com/N-ZOO/everycode/issues/8
export function algorithmCombination(arr, size) {
  var r = [] // result

  function _(t, a, n) {
    // tempArr, arr, num
    if (n === 0) {
      r[r.length] = t
      return
    }
    for (var i = 0, l = a.length - n; i <= l; i++) {
      var b = t.slice()
      b.push(a[i])
      _(b, a.slice(i + 1), n - 1)
    }
  }
  _([], arr, size)
  return r
}

/*
 *排列组合运算
 */
export function ACAlgorithm(m, n, type = 'combination') {
  function factorial(m, n) {
    var num = 1
    var count = 0
    for (var i = m; i > 0; i--) {
      if (count == n) {
        //当循环次数等于指定的相乘个数时，即跳出for循环
        break
      }
      num = num * i
      count++
    }
    return num
  }
  if (!m || m < n) {
    return 0
  }
  if (type === 'combination') {
    return factorial(m, n) / factorial(n, n)
  }
  if (type === 'arrangement') {
    return factorial(m, n)
  }
}
// [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]

// 筛选出符合条件的和值数组
function filterSumList({ sum, list, result = [] }) {
  _.sum(list) === sum && result.push(list.sort((n1, n2) => n1 - n2))
}

// 去除重复的数组
export function removeRepeat(list) {
  return Array.from(new Set(list.map(item => JSON.stringify(item)))).map(item =>
    JSON.parse(item)
  )
}

// 去除数组里面相等的
export function removeEqual(list) {
  list.map((item, index) => {
    let equal = true
    for (var i = 0; i < item.length - 1; i++) {
      if (item[i] !== item[i + 1]) {
        equal = false
      }
    }
    if (equal) {
      list.splice(index, 1)
    }
  })
  return list
}

/*  */
export function getPlayInfo(store) {
  let { playMenuTitle } = store.state.game
  let lotteryGameInfo = store.state.game.gameInfo
  let lotteryType = store.state.game.currentGameInfo.type
  let navTitle = playMenuTitle.split('-')[0]
  let subNavTitle = playMenuTitle.split('-')[1]
  // 根据彩种类型,找出对应的最小值,最大值和位数
  let { min, max, repeat, addZero } = lotteryGameInfo.find(
    item => item.type === lotteryType
  )
  let len
  if (
    navTitle === '前一' ||
    (subNavTitle && subNavTitle.indexOf('一码') !== -1) ||
    (lotteryType === 'pk10' && (navTitle === '大小单双' || navTitle === '龙虎'))
  ) {
    len = 1
  }
  if (
    subNavTitle === '冠亚季选一' ||
    subNavTitle === '任选一中一' ||
    navTitle === '选一' ||
    subNavTitle === '任选一' ||
    navTitle === '三同号' ||
    (navTitle === '二同号' && subNavTitle === '复选')
  ) {
    len = 1
  }
  if (
    navTitle === '二星' ||
    navTitle === '任选二' ||
    navTitle === '前二' ||
    navTitle === '后二' ||
    (subNavTitle && subNavTitle.indexOf('二码') !== -1) ||
    (subNavTitle && subNavTitle.indexOf('后二') !== -1) ||
    (subNavTitle && subNavTitle.indexOf('前二') !== -1) ||
    subNavTitle === '冠亚季选二' ||
    subNavTitle === '任选二中二' ||
    navTitle === '选二' ||
    navTitle === '二不同号' ||
    subNavTitle === '任选二' ||
    navTitle === '二字组合'
  ) {
    len = 2
  }
  if (
    navTitle === '三星' ||
    navTitle === '任选三' ||
    navTitle === '前三' ||
    navTitle === '后三' ||
    navTitle === '中三' ||
    (subNavTitle && subNavTitle.indexOf('三码') !== -1) ||
    (subNavTitle && subNavTitle.indexOf('后三') !== -1) ||
    (subNavTitle && subNavTitle.indexOf('前三') !== -1) ||
    subNavTitle === '任选三中三' ||
    navTitle === '选三' ||
    navTitle === '三不同号' ||
    subNavTitle === '任选三'
  ) {
    len = 3
  }
  if (
    navTitle === '四星' ||
    navTitle === '任选四' ||
    subNavTitle === '任选四中四' ||
    navTitle === '选四' ||
    subNavTitle === '任选四'
  ) {
    len = 4
  }
  if (
    navTitle === '五星' ||
    subNavTitle === '任选五中五' ||
    navTitle === '选五' ||
    subNavTitle === '任选五'
  ) {
    len = 5
  }
  if (subNavTitle === '任选六中五' || subNavTitle === '任选六') {
    len = 6
  }
  if (subNavTitle === '任选七中五' || subNavTitle === '任选七') {
    len = 7
  }
  if (subNavTitle === '任选八中五' || subNavTitle === '任选八') {
    len = 8
  }
  // 六合彩
  // 连码
  if (navTitle === '连码') {
    if (subNavTitle === '四中一') {
      len = 4
    }
    if (subNavTitle === '三全中' || subNavTitle === '三中二') {
      len = 3
    }
    if (
      subNavTitle === '二全中' ||
      subNavTitle === '二中特' ||
      subNavTitle === '特串'
    ) {
      len = 2
    }
  }
  // 全不中
  if (navTitle === '全不中') {
    ;[
      '五不中',
      '六不中',
      '七不中',
      '八不中',
      '九不中',
      '十不中',
      '十一不中',
      '十二不中'
    ].map((item, index) => {
      if (item === subNavTitle) {
        len = index + 5
      }
    })
  }
  // 合肖
  if (navTitle === '合肖') {
    ;[
      '二肖',
      '三肖',
      '四肖',
      '五肖',
      '六肖',
      '七肖',
      '八肖',
      '九肖',
      '十肖',
      '十一肖'
    ].map((item, index) => {
      if (item === subNavTitle) {
        len = index + 2
      }
    })
  }
  // 连肖
  if (navTitle === '连肖') {
    ;[
      { name: '二肖连中', len: 2 },
      { name: '三肖连中', len: 3 },
      { name: '四肖连中', len: 4 },
      { name: '五肖连中', len: 5 },
      { name: '二肖连不中', len: 2 },
      { name: '三肖连不中', len: 3 },
      { name: '四肖连不中', len: 4 }
    ].map((item, index) => {
      if (item.name === subNavTitle) {
        len = item.len
      }
    })
  }
  // 连肖
  if (navTitle === '尾数连') {
    ;[
      { name: '二尾连中', len: 2 },
      { name: '三尾连中', len: 3 },
      { name: '四尾连中', len: 4 },
      { name: '二尾连不中', len: 2 },
      { name: '三尾连不中', len: 3 },
      { name: '四尾连不中', len: 4 }
    ].map((item, index) => {
      if (item.name === subNavTitle) {
        len = item.len
      }
    })
  }

  // 快乐十分
  if (lotteryType === 'xync' && navTitle === '任选') {
    ;[
      { name: '任一中一', len: 1 },
      { name: '任二中二', len: 2 },
      { name: '任三中三', len: 3 },
      { name: '任四中四', len: 4 },
      { name: '任五中五', len: 5 }
    ].map((item, index) => {
      if (item.name === subNavTitle) {
        len = item.len
      }
    })
  }

  return {
    navTitle,
    subNavTitle,
    min,
    max,
    len,
    repeat,
    addZero
  }
}

//计算和值注数
export function calcSumBetNum({
  num,
  playMenuTitle,
  lotteryType,
  lotteryGameInfo,
  store
}) {
  let result = []
  let { navTitle, subNavTitle, min, max, len, repeat, addZero } = getPlayInfo(
    store
  )
  if (subNavTitle === '组六和值') {
    repeat = false
  }
  // 快三和值
  if (lotteryType === 'k3' && navTitle === '和值') {
    len = 3
  }
  if (subNavTitle === '组三和值') {
    for (let a = min; a <= max; a++) {
      for (let b = min; b <= max; b++) {
        for (let c = min; c <= max; c++) {
          if (
            Array.from(new Set([a, b, c])).length === 2 &&
            a + b + c === num
          ) {
            // result.push(removeRepeat([a, b, c].sort((n1, n2) => n1 - n2)))
            filterSumList({
              sum: num,
              list: [a, b, c],
              result
            })
          }
        }
      }
    }
  } else {
    for (var a = min; a <= max; a++) {
      // 循环条件语句
      for (var b = min; b <= max; b++) {
        if (len === 2) {
          if (repeat || Array.from(new Set([a, b])).length === 2) {
            filterSumList({
              sum: num,
              list: [a, b],
              result
            })
          }
        }
        for (var c = min; c <= max; c++) {
          if (len === 3) {
            if (repeat || Array.from(new Set([a, b, c])).length === 3) {
              filterSumList({
                sum: num,
                list: [a, b, c],
                result
              })
            }
          }
          for (var d = min; d <= max; d++) {
            if (len === 4) {
              if (repeat || Array.from(new Set([a, b, c, d])).length === 4) {
                filterSumList({
                  sum: num,
                  list: [a, b, c, d],
                  result
                })
              }
            }
          }
        }
      }
    }
  }
  if (subNavTitle === '组选和值' || subNavTitle === '组三和值') {
    return removeEqual(removeRepeat(result)).length
  } else {
    return result.length
  }
}

/* 计算跨度注数 */

function calcSpanBetNum(num, store) {
  let result = []
  let { navTitle, subNavTitle, min, max, len } = getPlayInfo(store)
  for (var a = min; a <= max; a++) {
    for (var b = min; b <= max; b++) {
      if (len === 2) {
        _.max([a, b]) - _.min([a, b]) === num && result.push([a, b])
      }
      for (var c = min; c <= max; c++) {
        if (len === 3) {
          _.max([a, b, c]) - _.min([a, b, c]) === num && result.push([a, b, c])
        }
        for (var d = min; d <= max; d++) {
          if (len === 4) {
            _.max([a, b, c, d]) - _.min([a, b, c, d]) === num &&
              result.push([a, b, c, d])
          }
        }
      }
    }
  }
  return result
}

// 计算任选n-直选复式,福彩3d二字定位注数
function calcCombinationBetNum({ betData, len }) {
  let combineArr = []
  let betNum = 0
  betData.forEach((item, index) => {
    if (item.selectedList.length) {
      combineArr.push(index)
    }
  })
  algorithmCombination(combineArr, len).forEach(item => {
    betNum += _.map(
      betData.filter((item1, index) => {
        return item.includes(index)
      }),
      n => n.selectedList.length
    ).reduce((n1, n2) => n1 * n2)
  })
  return betNum
}

/*
 *选中注单注单数
 *生成注单
 */
export function calcBetNum({ betData, store }) {
  let betNum = 0
  let playMenuTitle = store.state.game.playMenuTitle
  let navTitle = playMenuTitle.split('-')[0]
  let subNavTitle = playMenuTitle.split('-')[1]
  let lotteryType = store.state.game.currentGameInfo.type
  let lotteryGameInfo = store.state.game.gameInfo
  let { len, repeat, addZero, max, min } = getPlayInfo(store)

  let selectedList = _.map(betData, item => item.selectedList || item)
  let selectedLenArr = _.map(
    betData,
    item => (item.selectedList && item.selectedList.length)||item
  )
  if (
    (navTitle.indexOf('任选') === -1 &&
      ((subNavTitle && subNavTitle.search('直选复式') !== -1) ||
        navTitle === '大小单双' ||
        navTitle === '前一')) ||
    (navTitle === '二同号' && subNavTitle === '单选')
  ) {
    betNum =
      selectedLenArr.length &&
      selectedLenArr.reduce((prev, next) => prev * next)
  }

  // 单个列表组合
  if (
    (subNavTitle && subNavTitle.search('组选复式') !== -1) ||
    navTitle === '不定位' ||
    subNavTitle === '组六复式' ||
    navTitle === '任选复式' ||
    (lotteryType === 'xync' &&
      (subNavTitle === '任选' ||
        subNavTitle === '前组' ||
        subNavTitle === '连组' ||
        subNavTitle === '任选二')) ||
    (navTitle === '三不同号' && subNavTitle === '标准') ||
    (navTitle === '二不同号' && subNavTitle === '标准')
  ) {
    betNum = ACAlgorithm(betData[0].selectedList.length, len)
  }

  // 多个列表组合
  if (
    lotteryType === 'kl8' &&
    navTitle === '任选' &&
    subNavTitle !== '任选一'
  ) {
    let selectedLen = _.map(betData, item => item.selectedList).reduce(
      (n1, n2) => n1.length + n2.length
    )
    betNum = selectedLen >= len && ACAlgorithm(selectedLen, len)
  }

  if (
    navTitle === '定位胆' ||
    subNavTitle === '和值尾数' ||
    (lotteryType === 'syxw' &&
      navTitle === '不定位' &&
      (subNavTitle === '前三位' ||
        subNavTitle === '中三位' ||
        subNavTitle === '后三位')) ||
    subNavTitle === '红投' ||
    subNavTitle === '数投' ||
    navTitle === '三连号' ||
    navTitle === '三同号' ||
    (navTitle === '二同号' && subNavTitle === '复选') ||
    (lotteryType === 'kl8' && (subNavTitle === '任选一' || navTitle === '其他'))
  ) {
    betNum = selectedLenArr.reduce((prev, next) => prev + next)
  }

  if (navTitle === '任选四') {
    if (subNavTitle === '组选4') {
      selectedList[0].forEach(item => {
        betNum += _.difference(selectedList[1], [item]).length
      })
    }
    if (subNavTitle === '组选6') {
      betNum = ACAlgorithm(selectedList[0].length, 2)
    }
    if (subNavTitle === '组选12') {
      selectedList[0].forEach(item => {
        betNum += ACAlgorithm(_.difference(selectedList[1], [item]).length, 2)
      })
    }
    if (subNavTitle === '组选24') {
      betNum = ACAlgorithm(selectedList[0].length, 4)
    }
  }
  if (
    subNavTitle === '组选和值' ||
    subNavTitle === '直选和值' ||
    (lotteryType === 'k3' && navTitle === '和值') ||
    subNavTitle === '组六和值' ||
    subNavTitle === '组三和值'
  ) {
    let total = 0
    betData[0] &&
      betData[0].selectedList.map(item => {
        total += calcSumBetNum({
          num: parseInt(item.name),
          playMenuTitle,
          lotteryType,
          lotteryGameInfo,
          store
        })
      })
    betNum = total
  }
  if (subNavTitle === '组选包胆') {
    if (len === 2) {
      betNum = betData[0].selectedList.length && 9
    }
    if (len === 3) {
      betNum = betData[0].selectedList.length && 54
    }
  }
  if (subNavTitle && subNavTitle.indexOf('组合') !== -1) {
    betNum = len * selectedLenArr.reduce((prev, next) => prev * next)
  }
  // 任选n-直选复式
  if (navTitle.indexOf('任选') !== -1 && subNavTitle === '直选复式') {
    betNum = calcCombinationBetNum({ betData, len })
  }
  if (subNavTitle === '组三复式') {
    betNum =
      betData[0].selectedList.length * (betData[0].selectedList.length - 1)
  }
  if (
    subNavTitle === '特殊号' ||
    (lotteryType === 'k3' && subNavTitle === '大小单双')
  ) {
    betNum = betData[0].selectedList.length
  }
  if (subNavTitle === '直选跨度') {
    betData[0].selectedList.forEach(item => {
      betNum += calcSpanBetNum(parseInt(item.name), store).length
    })
  }
  if (subNavTitle === '直选单式') {
    betNum = Math.floor(betData.length / len)
  }
  if (subNavTitle === '组选单式' || subNavTitle === '混合组选') {
    let filteredList = []
    if (!addZero) {
      betNum = betData.filter(function(item) {
        if (item.length === len) {
          return Array.from(new Set(item.split(''))).length !== 1
        }
      }).length
    } else {
      // 前面需要添加0的彩种
      betNum = betData.filter(function(item) {
        if (item.length === len * 2) {
          return Array.from(new Set(sliceStrToArr(item, 2))).length !== 1
        }
      }).length
    }
  }

  if (subNavTitle === '组三单式') {
    // 有2个一样的号码
    betNum = betData.filter(function(item) {
      if (item.length === len) {
        return Array.from(new Set(item.split(''))).length === 2
      }
    }).length
  }
  if (subNavTitle === '组六单式') {
    // 3个号码都不一样
    betNum = betData.filter(function(item) {
      if (item.length === len) {
        return Array.from(new Set(item.split(''))).length === len
      }
    }).length
  }

  if (
    addZero &&
    !repeat &&
    (subNavTitle === '直选单式' || navTitle === '任选单式')
  ) {
    // 数字前加0的需要特别处理
    betNum = betData.filter(item => {
      if (item.length / 2 === len) {
        return (
          Array.from(
            new Set(
              _.filter(
                sliceStrToArr(item, 2),
                item1 => item1 <= max && item1 >= min
              )
            )
          ).length === len
        )
      }
    }).length
  }

  if (navTitle === '龙虎') {
    let filteredList = _.filter(
      betData,
      item => item.selectedList && item.selectedList.length
    )
    filteredList.map(item => {
      betNum += item.selectedList.length
    })
  }

  /*
   *特殊玩法,不允许重号
   */

  if (
    !repeat &&
    (subNavTitle === '直选复式' ||
      subNavTitle === '前直' ||
      subNavTitle === '连直')
  ) {
    let filteredlist = getComposeByArrays(
      _.map(betData, item => item.selectedList.map(item1 => item1.name))
    ).filter(item => Array.from(new Set(item.split(','))).length === len)
    betNum = filteredlist.length
  }

  // 胆拖玩法
  if (
    (navTitle && navTitle.search('胆拖') !== -1) ||
    (subNavTitle && subNavTitle.search('胆拖') !== -1) ||
    (navTitle === '二同号' && subNavTitle === '单选')
  ) {
    let danmaList = _.map(betData, item => item.selectedList)[0]
    let tuomaList = _.map(betData, item => item.selectedList)[1]
    /* 胆码和拖码都至少需要选中一个,并且和值需要大于最小要求 */
    if (
      danmaList.length > 0 &&
      tuomaList.length > 0 &&
      danmaList.length + tuomaList.length >= len
    ) {
      betNum = ACAlgorithm(tuomaList.length, len - danmaList.length)
    }
  }
  // 两面盘玩法的注数
  if (store.state.game.currentGameInfo.position === 1) {
    betNum = betData
      .map(item => item.list.filter(item1 => parseInt(item1.moneyNum)).length)
      .reduce((prev, next) => prev + next)
    // 福彩3d二字定位与任选n直选复式的注数算法一致
    if (navTitle === '二字定位') {
      betNum = calcCombinationBetNum({ betData, len: 2 })
    }
    if (navTitle === '三字定位') {
      betNum = betData
        .map(item => item.selectedList.length)
        .reduce((n1, n2) => n1 * n2)
    }
    if (navTitle === '二字组合' || navTitle === '三字组合') {
      let composedArray = getComposeByArrays(
        betData
          .map(item => item.selectedList)
          .map(item => item.map(item1 => item1.name))
      ).map(item =>
        item
          .split(',')
          .sort((n1, n2) => n1 - n2)
          .join(',')
      )

      betNum = Array.from(new Set(composedArray)).length
    }

    // 六合彩连码
    if (
      navTitle === '连码' ||
      navTitle === '全不中' ||
      navTitle === '尾数连' ||
      navTitle === '连肖' ||
      navTitle === '合肖' ||
      (lotteryType === 'xync' && navTitle === '任选')
    ) {
      betNum =
        betData[0].selectedList.length >= len &&
        ACAlgorithm(betData[0].selectedList.length, len)
    }
  }
  return betNum * store.state.game.checkListCombineNum
}

// 生成下注参数
// 需要去除不符合规范的content
export function generateBetContent({ betData, store }) {
  let content = ''
  let betContent = ''
  let checkedStr = store.state.game.checkedList.length
    ? store.state.game.checkedList.join(',') + ';'
    : ''
  let betTplType = store.state.game.betTplType
  let playMenuTitle = store.state.game.playMenuTitle
  let navTitle = playMenuTitle.split('-')[0]
  let subNavTitle = playMenuTitle.split('-')[1]
  let lotteryType = store.state.game.currentGameInfo.type
  let lotteryGameInfo = store.state.game.gameInfo
  let filteredList = []
  let { len, addZero, max, min } = getPlayInfo(store)
  let { position } = store.state.game.currentGameInfo
  // 默认下注内容
  if (position === 0) {
    if (betTplType === 'textArea') {
      content = betData.map(item => item.split('').join(',')).join(';')
    } else {
      content = _.map(betData, item =>
        item.selectedList.map(item1 => item1.name)
      ).join(';')
    }
  }
  if (position === 1) {
    content = _.map(betData, item =>
      _.map(item.selectedList, item1 => item1.name)
    ).join(';')
  }
  if (
    navTitle === '大小单双' ||
    navTitle === '两面' ||
    subNavTitle === '大小单双'
  ) {
    let list = _.map(_.filter(betData, item => item.title !== '总和'), item =>
      item.selectedList.map(item1 => item1.name)
    )
    let filteredList = list.map(item =>
      item.map(item1 => ['大', '小', '单', '双'].indexOf(item1))
    )
    betContent = filteredList.join(';')
  }
  if (navTitle === '定位胆' || subNavTitle === '数投') {
    betContent = _.map(betData, item =>
      item.selectedList.map(item1 => item1.name)
    ).join(';')
  }
  if (subNavTitle === '直选单式' || navTitle === '任选单式') {
    if (!addZero) {
      filteredList = betData.filter(function(item) {
        return item.length === len
      })
      betContent = _.map(filteredList, item => item.split('').join(',')).join(
        ';'
      )
    } else {
      filteredList = betData.filter(item => {
        if (item.length / 2 === len) {
          return (
            Array.from(
              new Set(
                _.filter(
                  sliceStrToArr(item, 2),
                  item1 => item1 <= max && item1 >= min
                )
              )
            ).length === len
          )
        }
      })
      filteredList = filteredList.map(item => {
        item = sliceStrToArr(item, 2).join(',')
        return item
      })
      content = betContent = filteredList.join(';')
    }
  }
  if (subNavTitle === '组选单式' || subNavTitle === '混合组选') {
    let filteredList = []
    if (!addZero) {
      filteredList = betData.filter(function(item) {
        if (item.length === len) {
          return Array.from(new Set(item.split(''))).length !== 1
        }
      })
      betContent = _.map(filteredList, item => item.split('').join(',')).join(
        ';'
      )
    } else {
      // 前面需要添加0的彩种
      filteredList = betData.filter(function(item) {
        if (item.length === len * 2) {
          return Array.from(new Set(sliceStrToArr(item, 2))).length !== 1
        }
      })
      betContent = _.map(filteredList, item =>
        sliceStrToArr(item, 2).join(',')
      ).join(';')
    }
  }

  if (subNavTitle === '组三单式') {
    // 有2个一样的号码
    let filteredList = betData.filter(function(item) {
      if (item.length === len) {
        return Array.from(new Set(item.split(''))).length === 2
      }
    })
    betContent = _.map(filteredList, item => item.split('').join(',')).join(';')
  }
  if (subNavTitle === '组六单式') {
    // 3个号码都不一样
    let filteredList = betData.filter(function(item) {
      if (item.length === len) {
        return Array.from(new Set(item.split(''))).length === len
      }
    })
    betContent = _.map(filteredList, item => item.split('').join(',')).join(';')
  }
  if (navTitle === '龙虎' && lotteryType === 'ssc') {
    let filteredList = _.filter(
      betData,
      item => item.selectedList && item.selectedList.length
    )
    let betArr = []
    let contentArr = []
    filteredList.map(item => {
      item.selectedList.map(selectedItem => {
        contentArr.push(item.list.join('vs') + ' ' + selectedItem)
        betArr.push(
          selectedItem + ',' + _.filter(item.list, n => n !== selectedItem)[0]
        )
      })
    })
    content = contentArr.join(';')
    // 生成下注项content
    betContent = betArr
      .join(';')
      .replace(/万位/g, 0)
      .replace(/千位/g, 1)
      .replace(/百位/g, 2)
      .replace(/十位/g, 3)
      .replace(/个位/g, 4)
  }

  if (navTitle === '龙虎' && lotteryType === 'pk10') {
    let list = betData[0].selectedList.map(item => {
      item = item === '龙' ? 0 : 1
      return item
    })
    betContent = list.join(',')
  }

  if (navTitle.indexOf('任选') !== -1 && subNavTitle === '直选复式') {
    checkedStr = ''
  }
  // 特殊玩法,只传id
  if (
    navTitle === '三连号' ||
    (navTitle === '三同号' && subNavTitle === '通选')
  ) {
    betContent = ''
  }
  // 二同号-单选
  if (
    (navTitle === '二同号' && subNavTitle === '单选') ||
    (navTitle === '三同号' && subNavTitle === '单选') ||
    (navTitle === '二同号' && subNavTitle === '复选')
  ) {
    betContent = _.map(betData, item =>
      item.selectedList.map(item1 => item1.name.charAt(0))
    ).join(';')
  }
  // 快乐8人选玩法
  if (lotteryType === 'kl8' && navTitle === '任选') {
    let arr = []
    _.map(betData, item => item.selectedList).forEach(item => {
      item.forEach(item1 => {
        arr.push(item1.name)
      })
    })
    betContent = arr.join(',')
  }
  // 将勾选的位数转换为汉字
  let filteredCheckedStr =
    (checkedStr &&
      checkedStr
        .slice(0, -1)
        .split(',')
        .map(item =>
          ['万位', '千位', '百位', '十位', '个位'].find(
            (item1, index) => item == index
          )
        ) + ';') ||
    ''
  if (content === '三同号通选' || content === '三连号通选') {
    return {
      content,
      betContent: ''
    }
  } else {
    return {
      content: filteredCheckedStr + content,
      betContent: checkedStr + (betContent || content)
    }
  }
}

/*
 * 一些玩法需要对下注数据进行预处理
 * 胆拖投注,胆码和拖码不能一样
 */
export function filterBetData({ oldBetData, newBetData, store }) {
  let navTitle = store.state.game.playMenuTitle.split('-')[0]
  let subNavTitle = store.state.game.playMenuTitle.split('-')[1]
  let { len } = getPlayInfo(store)
  if (navTitle === '二同号' && subNavTitle === '单选') {
    len = 6
  }
  if (
    (navTitle && navTitle.search('胆拖') !== -1) ||
    (subNavTitle && subNavTitle.search('胆拖') !== -1) ||
    (navTitle === '二同号' && subNavTitle === '单选')
  ) {
    // 比较连个数组中相同的部分,并且移除相同的部分,保留后添加进去的项
    let danmaList = _.map(newBetData, item => item.selectedList)[0]
    let tuomaList = _.map(newBetData, item => item.selectedList)[1]
    const diffDanma = _.difference(
      _.map(newBetData, item => item.selectedList.map(item1 => item1.name))[0],
      _.map(oldBetData, item => item.selectedList.map(item1 => item1.name))[0]
    )
    const diffTuoma = _.difference(
      _.map(newBetData, item => item.selectedList)[1],
      _.map(oldBetData, item => item.selectedList)[1]
    ).map(item => item.name)
    let sameItem = []
    sameItem = danmaList
      .filter(item => tuomaList.map(tuoma => tuoma.name).includes(item.name))
      .map(item => item.name)
    if (navTitle === '二同号' && subNavTitle === '单选') {
      danmaList.map(danma => {
        tuomaList.map(tuoma => {
          if (`${tuoma.name}${tuoma.name}` === danma.name) {
            sameItem.push(tuoma.name)
          }
        })
      })
      ;(diffDanma.length &&
        _.remove(tuomaList, item => sameItem.includes(item.name))) ||
        (diffTuoma.length &&
          _.remove(danmaList, item => sameItem.includes(item.name.charAt(0))))
    } else {
      // 有一样的item时,需要移除相同的项
      ;(diffDanma.length &&
        _.remove(tuomaList, item => sameItem.includes(item.name))) ||
        (diffTuoma.length &&
          _.remove(danmaList, item => sameItem.includes(item.name)))
    }
    if (danmaList.length === len) {
      danmaList.shift()
    }
    return store.state.game.betData.map((item, index) => {
      if (index === 0) {
        return {
          ...item,
          selectedList: danmaList
        }
      }
      if (index === 1) {
        return {
          ...item,
          selectedList: tuomaList
        }
      }
    })
  } else {
    return newBetData
  }
}

// 计算返点
function calcRebate(store) {
  let game = store.state.game
  let { playInfo } = game
  let rebateMax =
    playInfo.rebate_max ||
    (playInfo.children &&
      playInfo.children.length &&
      playInfo.children[0].rebate_max)
  let rebateMin = parseInt(
    playInfo.rebate_min ||
      (playInfo.children &&
        playInfo.children.length &&
        playInfo.children[0].rebate_min)
  )
  return (
    rebateMin +
    (rebateMax - rebateMin) * (game.betSettings.sliderNum / 100)
  ).toFixed(1)
}

// 计算赔率
function calcOdds(store) {
  let game = store.state.game
  let { playInfo } = game
  let betListData =
    playInfo.children && playInfo.children.length
      ? playInfo.children
      : playInfo.betData

  // 返回了多个赔率的情况 比如特殊号
  if (betListData && betListData.length) {
    let arr = []
    betListData.map(item => {
      arr.push(
        (
          item.odds_max -
          (item.odds_max - item.odds_min) * (game.betSettings.sliderNum / 100)
        ).toFixed(3)
      )
    })
    return Array.from(new Set(arr)).join(' | ')
  }
  return (
    playInfo.odds_max -
    (playInfo.odds_max - playInfo.odds_min) * (game.betSettings.sliderNum / 100)
  ).toFixed(3)
}

export function generateTplOrder(store, randomList) {
  let game = store.state.game
  let lotteryType = game.currentGameInfo.type
  let betData = randomList || game.betData
  let { playInfo, betTplType } = game
  let playMenuTitle = game.playMenuTitle
  let navTitle = playMenuTitle.split('-')[0]
  let { position } = game.currentGameInfo
  let betParams = []

  let rebate = calcRebate(store)
  let odds = calcOdds(store)
  // 对betData按照index索引进行排序
  if (betTplType !== 'textArea') {
    betData.map(item => {
      item.selectedList = item.selectedList.sort(
        (n1, n2) => n1.index - n2.index
      )
    })
  }

  // 筛选出选中含有id的下注项
  // 含有id的下注项不需要传content值
  let selectedIdArray =
    betTplType !== 'textArea' &&
    _.flattenDeep(
      betData.map(item => {
        return item.selectedList
          .filter(item1 => !!item1.id)
          .map(item2 => {
            item2.title = item.title
            return item2
          })
      })
    )

  // 筛选出不含有id的下注内容
  let removedIdBetData =
    betTplType !== 'textArea' && betData.filter(item => !item.list[0].id)
  let betNum

  // 机选需要重新计算注数
  if (randomList) {
    betNum = calcBetNum({ betData, store })
  } else {
    betNum =
      (position === 1 &&
        removedIdBetData.length &&
        removedIdBetData
          .map(item => item.selectedList.length)
          .reduce((n1, n2) => n1 + n2)) ||
      game.betTotalNum
  }

  let content = generateBetContent({
    betData: removedIdBetData || betData,
    store: store
  })

  let groupedBetData = _.groupBy(
    _.flattenDeep(
      _.map(
        _.filter(removedIdBetData, item => item.selectedList.length),
        item => item.selectedList
      )
    ),
    item => item.odds_max
  )

  let basicParams = {
    game_code: game.currentGameInfo.game_code,
    round: game.currentGameInfo.round,
    id: game.playInfo.id,
    rebate,
    odds,
    amount: game.betSettings.moneyNum,
    content: content.content,
    betContent: content.betContent,
    multiple: game.betSettings.multiple,
    type: playMenuTitle,
    betNum: betNum
  }

  if (selectedIdArray.length) {
    betParams.push(
      ...selectedIdArray.map((item, index) => {
        let odds = (
          item.odds_max -
          (item.odds_max - item.odds_min) * (game.betSettings.sliderNum / 100)
        ).toFixed(3)
        return {
          ...basicParams,
          id: item.id,
          rebate,
          betContent: '',
          odds,
          betNum: 1,
          content: item.name,
          betTitle: item.title
        }
      })
    )
  }

  // 特殊号需要特殊处理
  // 时时彩龙虎斗
  if (playMenuTitle === '龙虎斗' && lotteryType === 'ssc') {
    let arr = []
    let titleList = ['第一球', '第二球', '第三球', '第四球', '第五球']
    betData.map(item => {
      if (item.selectedList.length) {
        let compareArr = []
        item.title.split('vs').forEach(item1 => {
          titleList.forEach((item2, index) => {
            if (item1 === item2) {
              compareArr.push(index)
            }
          })
        })
        let str = compareArr.join(',')
        _.map(item.selectedList, item1 => {
          let odds = (
            item1.odds_max -
            (item1.odds_max - item1.odds_min) *
              (game.betSettings.sliderNum / 100)
          ).toFixed(3)
          if (item1.name === '龙') {
            arr.push({
              betContent: `${str},5`,
              odds,
              content: '龙',
              betTitle: `${titleList[compareArr[0]]}vs${
                titleList[compareArr[1]]
              }`
            })
          }
          if (item1.name === '虎') {
            arr.push({
              betContent: `${str},6`,
              odds,
              content: '虎'
            })
          }
          if (item1.name === '和') {
            arr.push({
              betContent: `${str},7`,
              odds,
              content: '和',
              betTitle: `${titleList[compareArr[0]]}vs${
                titleList[compareArr[1]]
              }`
            })
          }
        })
      }
    })
    betParams = arr.map(item => {
      return {
        ...basicParams,
        id: game.playInfo.betData[0].id,
        betContent: item.betContent,
        content: item.content,
        odds: item.odds,
        betTitle: item.betTitle
      }
    })
  }
  // 幸运农场第n球玩法
  if (
    lotteryType === 'xync' &&
    [
      '第一球',
      '第二球',
      '第三球',
      '第四球',
      '第五球',
      '第六球',
      '第七球',
      '第八球'
    ].includes(navTitle)
  ) {
    let filteredRemovedIdBetData = removedIdBetData
      .filter(item => item.selectedList.length)
      .map(item => {
        let odds =
          item.selectedList[0].odds_max -
          (item.selectedList[0].odds_max - item.selectedList[0].odds_min) *
            (game.betSettings.sliderNum / 100)
        if (item.title === '单码') {
          return {
            ...basicParams,
            betContent: item.selectedList.map(item1 => item1.name).join(','),
            content: item.selectedList.map(item1 => item1.name).join(','),
            betNum: item.selectedList.length,
            odds,
            id: item.id
          }
        } else {
          return {
            ...basicParams,
            betContent: item.selectedList.map(item1 => item1.index).join(','),
            content: item.selectedList.map(item1 => item1.name).join(','),
            betNum: item.selectedList.length,
            odds,
            id: item.id
          }
        }
      })
    return [...betParams, ...filteredRemovedIdBetData]
  }
  // 除了时时彩之外的龙虎斗
  if (playMenuTitle === '龙虎斗' && lotteryType === 'pk10') {
    let list = _.map(betData, item => item.selectedList).map(item =>
      item.map(item1 =>
        item1.name === '龙' ? 0 : item1.name === '虎' ? 1 : ''
      )
    )
    betParams.push({
      ...basicParams,
      betContent: list.join(';'),
      content: content.content
    })
  }
  // 梭哈,牛牛,11选5两面玩法特殊处理
  if (lotteryType === 'syxw' && navTitle === '两面' && position === 1) {
    let arr = []
    // 大小单双赔率
    let oddsMax = game.playInfo.betData[1].odds_max
    let oddsMin = game.playInfo.betData[1].odds_max
    let odds = (
      oddsMax -
      (oddsMax - oddsMin) * (game.betSettings.sliderNum / 100)
    ).toFixed(3)
    betParams.push({
      ...basicParams,
      odds,
      id: game.playInfo.betData[1].id
    })
  }
  // 除了时时彩和11选5之外的龙虎斗玩法
  /* if (playMenuTitle === '龙虎斗') {
    let result = []
    betData.forEach(item => {
      let arr1 = item.selectedList.map(selectedItem => {
        let arr = item.title.split('vs').map(item2 => {
          return ['第一球', '第二球', '第三球', '第四球', '第五球'].indexOf(
            item2
          )
        })
        if (selectedItem.name === '龙') {
          return arr
        }
        return arr.reverse()
      })
      result.push(...arr1)
    })
    betParams.push({
      ...basicParams,
      betContent: result.join(';')
    })
  } */

  if (lotteryType === 'k3' && position === 1) {
    let betParams = []
    if (navTitle === '三军/大小') {
      let sanjunContent = betData
        .find(item => item.title === '三军')
        .selectedList.map(item => item.name)
        .join(',')
      let daxiaoContent = betData
        .find(item => item.title === '总和')
        .selectedList.map(item => ['大', '小', '单', '双'].indexOf(item.name))
        .join(',')
      sanjunContent &&
        betParams.push({
          ...basicParams,
          id: playInfo.betData[0].id,
          betContent: sanjunContent,
          odds: (
            playInfo.betData[0].odds_max -
            (playInfo.betData[0].odds_max - playInfo.betData[0].odds_min) *
              (game.betSettings.sliderNum / 100)
          ).toFixed(3)
        })
      daxiaoContent &&
        betParams.push({
          ...basicParams,
          id: playInfo.betData[1].id,
          betContent: daxiaoContent,
          odds: (
            playInfo.betData[1].odds_max -
            (playInfo.betData[1].odds_max - playInfo.betData[1].odds_min) *
              (game.betSettings.sliderNum / 100)
          ).toFixed(3)
        })
    }
    if (navTitle === '点数') {
      betData[0].selectedList.map(item => {
        betParams.push({
          ...basicParams,
          id: item.id,
          odds: (
            item.odds_max -
            (item.odds_max - item.odds_min) * (game.betSettings.sliderNum / 100)
          ).toFixed(3),
          betContent: ' '
        })
      })
    }

    if (navTitle === '长牌/短牌') {
      let changpaiContent = betData
        .find(item => item.title === '长牌')
        .selectedList.map(item => item.name)
        .join(';')
      let duanpaiContent = betData
        .find(item => item.title === '短牌')
        .selectedList.map(item => item.name)
        .join(',')
      changpaiContent &&
        betParams.push({
          ...basicParams,
          id: playInfo.betData[0].id,
          odds: (
            playInfo.betData[0].odds_max -
            (playInfo.betData[0].odds_max - playInfo.betData[0].odds_min) *
              (game.betSettings.sliderNum / 100)
          ).toFixed(3),
          betContent: changpaiContent
        })
      duanpaiContent &&
        betParams.push({
          ...basicParams,
          id: playInfo.betData[1].id,
          odds: (
            playInfo.betData[1].odds_max -
            (playInfo.betData[1].odds_max - playInfo.betData[1].odds_min) *
              (game.betSettings.sliderNum / 100)
          ).toFixed(3),
          betContent: duanpaiContent
        })
    }

    if (navTitle === '围骰/全骰') {
      // 围骰
      let weishaiContent = betData
        .find(item => item.title === '围骰')
        .selectedList.map(item => item.name)
        .join(',')
      weishaiContent &&
        betParams.push({
          ...basicParams,
          id: playInfo.betData[0].id,
          odds: (
            playInfo.betData[0].odds_max -
            (playInfo.betData[0].odds_max - playInfo.betData[0].odds_min) *
              (game.betSettings.sliderNum / 100)
          ).toFixed(3),
          betContent: weishaiContent
        })
      // 全骰
      betData
        .find(item => item.title === '全骰')
        .selectedList.map(item => {
          betParams.push({
            ...basicParams,
            id: playInfo.betData[1].id,
            odds: (
              playInfo.betData[1].odds_max -
              (playInfo.betData[1].odds_max - playInfo.betData[1].odds_min) *
                (game.betSettings.sliderNum / 100)
            ).toFixed(3),
            betContent: ' '
          })
        })
    }
    return betParams
  }
  if (lotteryType === 'three' && position === 1) {
    let betParams = []
    if (navTitle === '二字组合' || navTitle === '三字组合') {
      let composedArray = getComposeByArrays(
        betData
          .map(item => item.selectedList)
          .map(item => item.map(item1 => item1.name))
      ).map(item =>
        item
          .split(',')
          .sort((n1, n2) => n1 - n2)
          .join(',')
      )
      betParams.push({
        ...basicParams,
        betContent: Array.from(new Set(composedArray)).join(';')
      })
    }
    if (
      navTitle.indexOf('定位') !== -1 ||
      navTitle === '两面' ||
      navTitle === '一字组合' ||
      navTitle === '跨度'
    ) {
      let betContent = betData
        .map(item => item.selectedList)
        .map(item => {
          if (navTitle === '两面') {
            return item.map(item1 =>
              ['大', '小', '单', '双', '质', '合'].indexOf(item1.name)
            )
          }
          return item.map(item1 => item1.name)
        })
        .join(';')
      let odds = (
        playInfo.odds_max -
        (playInfo.odds_max - playInfo.odds_min) *
          (game.betSettings.sliderNum / 100)
      ).toFixed(3)
      betParams.push({
        ...basicParams,
        id: playInfo.id,
        odds,
        betContent
      })
    }
    if (navTitle === '二字和数' || navTitle === '三字和数') {
      // 和值数据需要特殊处理
      let sumBetData = betData.find(item => item.title === '和值')
      let filteredSumBetData = sumBetData.selectedList
        .map(item =>
          sumBetData.list.map(item1 => item1.name).indexOf(item.name)
        )
        .join(',')
      betData
        .filter(item => item.selectedList.length)
        .map(selectedRows => {
          let betContent = ' '
          let selectedPlayData = playInfo.betData.find(
            item => item.name === selectedRows.title
          )
          let id = selectedPlayData.id
          let odds = (
            selectedPlayData.odds_max -
            (selectedPlayData.odds_max - selectedPlayData.odds_min) *
              (game.betSettings.sliderNum / 100)
          ).toFixed(3)
          if (selectedRows.title === '和值') {
            betContent = selectedRows.selectedList
              .map(item =>
                selectedRows.list.map(item1 => item1.name).indexOf(item.name)
              )
              .join(',')
          }
          if (selectedRows.title === '尾数') {
            betContent = selectedRows.selectedList
              .map(item => item.name)
              .join(',')
          }
          // 三字和数大小单双玩法
          if (selectedRows.title === '大小单双') {
            betContent = selectedRows.selectedList
              .map(item => ['大', '小', '单', '双'].indexOf(item.name))
              .join(',')
          }
          // 二字和数单双玩法
          if (selectedRows.title === '和值单双') {
            betContent = selectedRows.selectedList
              .map(item => ['单', '双'].indexOf(item.name))
              .join(',')
          }
          if (
            selectedRows.title === '尾数双面' ||
            selectedRows.title === '尾数双面'
          ) {
            betContent = selectedRows.selectedList
              .map(item => ['大', '小', '质', '合'].indexOf(item.name))
              .join(',')
          }
          betParams.push({
            ...basicParams,
            odds,
            id,
            betContent
          })
        })
    }
    return betParams
  }
  if (lotteryType === 'six' && position === 1) {
    // includesNum是否包含1-49下注
    let includesNum = !!playInfo.odds_array.find(
      oddsData => oddsData.name === '1-49'
    )
    if (
      navTitle === '连码' ||
      navTitle === '合肖' ||
      navTitle === '连肖' ||
      navTitle === '尾数连' ||
      navTitle === '全不中'
    ) {
      betParams.push({
        ...basicParams,
        odds: playInfo.odds_array[0].odds,
        betContent: betData[0].selectedList
          .map(item =>
            navTitle === '连码' || navTitle === '全不中'
              ? item.name
              : item.index
          )
          .join(','),
        betNum: 1
      })
    } else {
      if (includesNum) {
        Object.keys(groupedBetData).map(key => {
          let indexList = groupedBetData[key].map(item => {
            let betContent = ''
            if (isNaN(parseInt(item.name))) {
              let index = playInfo.odds_array
                .map(odd => odd.name)
                .indexOf(item.name)
              betContent = index + 49
            } else {
              // 1-49球下注
              betContent = item.name
            }

            betParams.push({
              ...basicParams,
              content: item.name,
              betContent,
              odds: key,
              betNum: 1
            })
          })
        })
      } else {
        betData[0].selectedList.map(item => {
          betParams.push({
            ...basicParams,
            odds: item.odds_max,
            betContent: item.index,
            content: item.name,
            betNum: 1
          })
        })
      }
    }
  }
  if (lotteryType === 'lucky28' && navTitle === '混合') {
    let betContent = betData[0].selectedList
      .map(item =>
        playInfo.odds_array.map(odds => odds.name).indexOf(item.name)
      )
      .join(',')

    betParams.push({
      ...basicParams,
      odds: playInfo.odds_array[0].odds_max,
      betContent
    })
  }
  if (!betParams.length) {
    betParams = [basicParams]
  }

  // 信用玩法需要区分于wap处理
  if (position === 1) {
    betParams = []
    betData
      .map(item => item.list.filter(item1 => parseInt(item1.moneyNum)))
      .map(item =>
        item.map(item1 => {
          let creditBasicParams = {
            ...basicParams,
            id: game.playInfo.id,
            rebate,
            odds,
            amount: parseInt(item1.moneyNum),
            content: item1.name,
            betContent: item1.id || item1.name,
            multiple: game.betSettings.multiple,
            type: playMenuTitle,
            betNum: 1
          }
          betParams.push(creditBasicParams)
        })
      )
  }
  return betParams
}

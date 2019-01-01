/*
 *存放与彩票游戏相关的数据
 *storeDataToSession 将接口返回的数据存在session里面，避免重复请求接口
 *playMenuShow 彩种下拉菜单显示状态
 *randomSelectType 0代表既没有机选1注,也没有机选5注,1代表只有机选1注,5代表有机选1注和机选5注
 *checkListCombineNum 任选checklist的组合数
 *playInfo 玩法相关信息,赔率,返点,id等
 *currentGame 当前游戏的信息 game_code,round
 *betData 下注信息,
 *betTplType 下注的类型,输入框,龙虎,选择数字
 */
import storeDataToSession from '../../util/storeDataToSession'
import {
  getPlayMenu,
  getGameResult,
  bet,
  getBetHistory,
  getGameList,
  getGameSetting
} from '../../api/game'
import { tranformMenuData } from '../../util/filters'
export default {
  state: {
    gameType: '',
    playMenuShow: false,
    playMenuTitle: '',
    betTotalNum: 0,
    playInfo: {},
    randomSelectType: 1,
    checkListCombineNum: 1,
    currentGameInfo: {},
    betData: {},
    checkedList: [],
    betTplType: '',
    playTabStatus: undefined,
    gameInfo: [],
    betHistoryData: [],
    betSettings: {
      sliderNum: 0,
      playMode: '元',
      moneyNum: 2,
      multiple: 1,
      presetMoneyCheck: true
    }
  },
  mutations: {
    setGameType(state, type) {
      state.gameType = type
    },
    toggleGameMenu(state, bool) {
      state.playMenuShow = bool
    },
    setMenutitle(state, title) {
      state.playMenuTitle = title
    },
    setBetTotalNum(state, num) {
      state.betTotalNum = num
    },
    setPlayInfo(state, intro) {
      state.playInfo = intro
    },
    setRandomSelectType(state, type) {
      state.randomSelectType = type
    },
    setCheckListCombineNum(state, num) {
      state.checkListCombineNum = num
    },
    setCurrentGameInfo(state, info) {
      console.log(info)
      state.currentGameInfo = info
    },
    setBetData(state, list) {
      state.betData = list
    },
    setCheckedList(state, list) {
      state.checkedList = list
    },
    setBetTplType(state, type) {
      state.betTplType = type
    },
    setPlayTabStatus(state, status) {
      state.playTabStatus = status
    },
    setGameInfo(state, info) {
      state.gameInfo = info
    },
    setBetSettings(state, setting) {
      state.betSettings = setting
    },
    setBetHistoryData(state, setting) {
      state.betHistoryData = setting
    }
  },
  actions: {
    GET_PLAY_MENU: async ({ state, commit }, params) => {
      // 菜单数据需要存储在sessionStorage中,避免重复请求
      // 判断session中是否存在该玩法的菜单
      let playMenuList = JSON.parse(sessionStorage.getItem('playMenuList'))
      let gameId = params.game_code
      // 有对应玩法的menu
      if (
        playMenuList &&
        playMenuList[gameId] &&
        playMenuList[gameId].data[`games${params.position}`]
      ) {
        return playMenuList[gameId]
      } else {
        // session中无数据时,需要重新请求
        let original = JSON.parse(sessionStorage.getItem('playMenuList')) || {}
        let res = await getPlayMenu(params)
        tranformMenuData(res.data.games, params.position)
        // 返回的数据进行处理
        let storedData = {
          ...original,
          [gameId]: {
            data: {
              ...(original[params.game_code] &&
                original[params.game_code].data),
              [`games${params.position}`]: res.data.games,
              info: res.data.info
            }
          }
        }
        // 存到sessionStorage中
        sessionStorage.setItem('playMenuList', JSON.stringify(storedData))
        // 存到store中，便于取值
        return storedData[gameId]
      }
    },
    GET_GAME_RESULT: async ({ state, commit }, params) => {
      if (!params.type) {
        params = { ...params, loop: true }
      }
      let res = await getGameResult(params)
      return res
    },
    BET: async ({ state, commit }, params) => {
      let res = await bet(params)
      return res
    },
    GET_BET_HISTORY: async ({ state, commit }, params) => {
      let res = await getBetHistory(params)
      return res
    },
    GET_GAME_LIST: async ({ state, commit }, params) => {
      let res = await getGameList(params)
      // 将服务器返回的数据进行处理,转换为本地json文件
      let filteredData = {}

      res.data && res.data.lottery.map(item => {
        let key = item.type
        filteredData[key] = item
      })
      Object.keys(filteredData).map(key => {
        filteredData[key].includes.map(item => {
          item.code = item.game_code
          return item
        })
      })
      return res
    },
    GET_GAME_SETTING: async ({ state, commit }, params) => {
      let res = await getGameSetting(params)
      return res
    }
  }
}

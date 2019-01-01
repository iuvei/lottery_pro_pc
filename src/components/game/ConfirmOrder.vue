<template>
  <div class="confirm-order">
    <div class="left">
      <div>

      </div>
      <div>
        <div>
          <ul class="order-title-list">
            <li>玩法</li>
            <li class="play-mode-item">下注内容</li>
            <li class="width80">注数</li>
            <li class="width80">倍数</li>
            <li class="width80">单注金额</li>
            <li>赔率、返点</li>
            <li>金额</li>
          </ul>
        </div>
        <div class="scrollbar">
          <ul class="order-list scrollbar">
            <li v-for="(item,index) in orderData.list">
              <div>
                <div>
                  <ul class="order-detail-list">
                    <li>[{{item.type}}]</li>
                    <li class="play-mode-item">{{item.content}}</li>
                    <li class="width80">{{item.betNum}}</li>
                    <li class="width80">{{item.multiple}}</li>
                    <li class="width80">{{item.amount}}</li>
                    <li>{{`${item.odds}/${item.rebate}%`}}</li>
                    <li>{{item.multiple*item.amount}}</li>
                  </ul>
                </div>
                <div class="order-content">

                </div>
              </div>
              <div
                class="delete-icon-wrap"
                @click="clearOrderItem(item,index)"
              >
                <i class="iconfont icon-jiahao transform45"></i>
              </div>
            </li>
          </ul>
        </div>
        <div class="order-bottom">
          <div>
            我要追号
            <i-Switch
              v-model="bingeSwitch"
              @on-change="handleBingeSwitchChange"
            />
          </div>
          <div
            class="delete-all"
            @click="clearAll"
          >
            <i class="iconfont icon-jiahao transform45"></i>
            删除全部
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="random-btn-box">
        <button
          class="random-btn"
          @click="generateRandomBet(1)"
        >机选1注</button>
        <button
          class="random-btn"
          @click="generateRandomBet(5)"
        >机选5注</button>
      </div>
      <div class="bet-summary">
        <div>总注数：<span class="theme-color strong-font">{{(parseInt(bingeNum)?bingeNum:1)*totalBetNum}}</span> 注</div>
        <div>总金额：<span class="theme-color strong-font" >{{(parseInt(bingeNum)?bingeNum:1)*totalBetMoney}}</span> 元</div>
      </div>
      <div @click="bet">
        <button class="bet-btn">确认投注</button>
      </div>
    </div>
  </div>
</template>

<script>
import { betOrderContent } from '../../util/filters'
import { randomBetSelect } from '../../util/game/randomSelect'
import {
  generateBetContent,
  generateTplOrder
} from '../../util/lotteryAlgorithmUtil'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      orderData: JSON.parse(localStorage.getItem('tplBetOrder')) || {},
      bingeSwitch: false,
      totalBetNum: 0,
      totalBetMoney: 0,
      bingeChecked: true,
      bingeNum: 1
    }
  },
  created() {
    this.registerGlobalEvents()
    // 初始化页面
    this.initPage()
    console.log(history)
    if (!(this.orderData.list && this.orderData.list.length)) {
      this.$router.replace({
        path: `/game/${this.$route.params.game_code}`
      })
    }
  },
  methods: {
    ...mapActions(['BET', 'GET_MEMBER_INFO', 'GET_BET_HISTORY',]),
    betOrderContent,
    goToGame() {
      this.$router.replace({
        path: `/game/${this.$route.params.game_code}`
      })
    },
    setBetSummary() {
      let totalBetNum = 0
      let totalBetMoney = 0
      this.orderData.list &&
        this.orderData.list.map(item => {
          totalBetNum += item.betNum
          totalBetMoney += item.amount * item.betNum * item.multiple
        })
      this.totalBetNum = totalBetNum
      this.totalBetMoney = totalBetMoney.toFixed(2)
    },
    initPage() {
      /*
       *判断当前的游戏是否和缓存里面的游戏一致,如果不一致需要删除当前注单数据
       *localStorage中有注单的时候,需要将round值更新到当前接口返回的round值
       */
      if (this.orderData.game_code) {
        if (this.$route.params.game_code !== this.orderData.game_code) {
        }
      }
      // 下注注数和下注总金额
      this.setBetSummary()
    },
    setStyle(text) {
      let style = {}
      if (text === ',') {
        return {
          width: '10px'
        }
      }
    },
    registerGlobalEvents() {
      this.$eventBus.$on('clearSelectedBet', () => {
        this.clearAll()
      })
      this.$eventBus.$on('addToLocalStorage', () => {
        this.updateOrderList()
      })
    },
    addOrderToLocalStorage(betArr) {
      console.log(betArr)
      // 把符合条件的注单添加到localStorage中
      let tplBetOrder = JSON.parse(localStorage.getItem('tplBetOrder')) || {
        list: []
      }
      tplBetOrder.game_code = this.$store.state.game.currentGameInfo.game_code
      tplBetOrder.round = this.$store.state.game.currentGameInfo.round
      tplBetOrder.list = [...betArr, ...tplBetOrder.list]
      this.orderData = tplBetOrder
      localStorage.setItem('tplBetOrder', JSON.stringify(tplBetOrder))
    },
    clearAll() {
      localStorage.removeItem('tplBetOrder')
      this.orderData = {}
    },
    clearSelectedList() {
      this.confirmShow = true
    },
    onConfirm() {
      this.clearAll()
    },
    handleConfirmHide() {},
    clearOrderItem(item, index) {
      this.orderData.list = this.orderData.list.filter(
        (orderItem, index1) => index !== index1
      )
      localStorage.setItem('tplBetOrder', JSON.stringify(this.orderData))
    },
    updateOrderList(round) {
      // 更新localStorage存放的期数
      let orderData = JSON.parse(localStorage.getItem('tplBetOrder')) || {
        list: []
      }
      if (orderData.list) {
        orderData.list = orderData.list.map(item => {
          item.round = round||item.round
          return item
        })
      }
      orderData.round = round
      this.orderData = orderData
      localStorage.setItem('tplBetOrder', JSON.stringify(orderData))
    },
    generateBetParams(orderData) {
      let params = []
      let bingeMode = this.bingeChecked ? 0 : 1
      orderData.list.map(item => {
        let {
          game_code,
          round,
          id,
          odds,
          rebate,
          amount,
          content,
          betContent,
          multiple
        } = item
        params.push({
          game_code,
          token: this.$store.getters.token,
          round,
          id,
          odds,
          rebate,
          amount,
          content: betContent,
          multiple,
          binge_mode: bingeMode,
          binge: this.bingeNum
        })
      })
      console.log(params)
      return params
    },
    generateRandomBet(num) {
      // 随机选中一个注单
      let randomList = randomBetSelect({ store: this.$store })
      this.addOrderToLocalStorage(generateTplOrder(this.$store, randomList))
      if (num > 1) {
        this.generateRandomBet(num - 1)
      }
      // generateTplOrder(this.$store)
      // console.log(this.$store.state.game.betData)
    },
    bet() {
      var _this = this;
      this.BET(this.generateBetParams(this.orderData)).then(res => {
        if (res.result) {
          // 清空注单
          this.clearAll()
          //清空投注去选中

          // 更新余额
          this.GET_MEMBER_INFO({ item: 'balance' })
          // 更新下注记录
            // 更新投注记录
            this.GET_BET_HISTORY({
                game_code: this.$store.state.game.currentGameInfo.game_code,
                rows: "10",
                page: "1"
            }).then(res => {
                console.log(res)
                _this.$bus.emit("clearSelect")
                this.$store.commit("setBetHistoryData",res.data.bills)
            })
              .catch(err => {
                  //this.verifyCodeShouldReload = true
              })

        }
      })
    },
    handleBingeSwitchChange() {}
  },
  watch: {
    orderData: {
      deep: 'true',
      handler: function(val, oldVal) {
        this.setBetSummary()
      }
    },
    '$store.state.game.currentGameInfo.round': function(val) {
      this.updateOrderList(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-order {
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  > .left {
    flex: 1;
    border: solid 1px #e2e4ef;
    .order-title-list {
      display: flex;
      justify-content: space-between;
      text-align: center;
      background-color: #fafbff;
      line-height: 27px;
      text-align: center;
      > .width80 {
        width: 80px;
      }
      > li:not(.width80) {
        flex: 1;
      }
    }
    .order-list {
      overflow-y: auto;
      > li {
        height: 40px;
        border-bottom: dotted 1px #e2e4ef;
        position: relative;
        .delete-icon-wrap {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 50%;
          right: 10px;
          margin-top: -10px;
          display: flex;
          align-items: center;
          color: red;
          cursor: pointer;
        }
      }
      .order-detail-list {
        display: flex;
        justify-content: space-between;
        text-align: center;
        line-height: 40px;
        color: #333;
        > li {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > li:not(.width80) {
          flex: 1;
        }
        > .width80 {
          width: 80px;
        }
      }
    }
    .order-list {
      height: 120px;
      background-color: white;
    }
    .order-bottom {
      display: flex;
      justify-content: space-between;
      background-color: #fafbff;
      line-height: 27px;
      padding: 0 10px;
      .delete-all {
        cursor: pointer;
        .iconfont {
          margin-right: 5px;
          color: red;
        }
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .transform45 {
      transform: rotate(45deg);
      display: block;
    }
  }
  > .right {
    width: 217px;
    margin-left: 15px;
    margin-top: 10px;
    .random-btn-box {
      display: flex;
      justify-content: space-between;
      .random-btn {
        width: 100px;
        height: 32px;
        border-radius: 4px;
        border: solid thin #e2e4ef;
      }
      .random-btn:hover {
        color: #fa2939;
        border: solid thin #fa2939;
      }

    }
    .bet-summary {
      height: 70px;
      background-color: #fafbff;
      position: relative;
      margin-top: 5px;
      padding: 10px;
      line-height: 25px;
      &:after {
        content: '';
        display: block;
        position: absolute;
        border: solid 10px transparent;
        border-top: solid 10px #fafbff;
        bottom: -20px;
        left: 50%;
        margin-left: -10px;
      }
    }

    .bet-btn {
      width: 218px;
      height: 40px;
      margin-top: 15px;
      line-height: 40px;
      border: none;
      outline: none;
      border-radius: 5px;
      font-weight: 600;
      box-shadow: -1px 3px 4px #ffd0d3;
      text-align: center;
      font-size: 14px;
      background: linear-gradient(to right, #f30c1e, #ff505e);
      color: #fff;
      &:hover {
        background: linear-gradient(to right, #ff505e, #f30c1e);
      }
    }
  }
  .strong-font{
    color: #fa2939;
    font-size: 16px;
    font-weight: 600
  }
}
</style>

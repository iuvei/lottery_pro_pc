<template>
  <div>
    <div class="lottery-game-bottom" style="padding-left: 10px" v-if="$store.state.game.currentGameInfo.position===0">
      <div class="option-left">
        <div class="slider-area">
          <div>
            <div>{{odds}}</div>
            <div>{{rebate}}%</div>
          </div>
          <div class="mt5">
            <div>赔率</div>
            <div class="slider">
              <slider
                v-model="sliderNumber"
                :range-bar-height="6"
                :step="0.1"
                @on-change="handleSliderChange"
              ></slider>
            </div>
            <div>返利</div>
          </div>
        </div>
        <div class="input-area">
          <span>倍数</span>
          <div>
            <div v-if="$store.state.game.currentGameInfo.position===0" class="input-multiple">
              <div
                @click="multiple>1?multiple-=1:''"
                :class="{'disabled':multiple<=1}"
                class="icon-wrap"
              >
                <i class="iconfont icon-jianhao"></i>
              </div>
              <div class="input-main">
                <InputNumber
                  :inputStyle="{'text-align':'center','border':'none'}"
                  :value="multiple"
                  @handleNumberChange="handleMultipleChange"
                />
              </div>
              <div @click="multiple=multiple?parseInt(multiple)+1:1" class="icon-wrap">
                <i class="iconfont icon-jiahao1"></i>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ul class="playmode-list">
            <li
              :class="{'active':item===$store.state.game.betSettings.playMode}"
              v-for="(item,index) in playModeMenus"
              @click="handlePlayModeChange(index)"
            >{{item}}</li>
          </ul>
        </div>
        <div>
          <div class="fs12 black-level6" style="margin-top:-2px; font-size: 12px;">
            已选
            <span class="theme-color strong-font" style="font-weight: 400">{{$store.state.game.betTotalNum || 0}}</span> 注
          </div>
          <div class="fw500" style=" font-size: 16px;">
            共
            <span class="theme-color dib strong-font">{{(betTotalMoney*multiple || 0).toFixed(3)}}</span>
            <span class="fs14 dib">元</span>
          </div>
        </div>
      </div>
      <div class="option-right">
        <button @click="addToBet">
          <i class="iconfont icon-jiahao1"></i>添加
        </button>
      </div>
    </div>
    <div v-else class="lottery-game-bottom-credit">
      <div>
        <div class="slider-area" v-show="$store.state.game.currentGameInfo.type!=='six'">
          <div class="slider-label">返点</div>
          <slider
            v-model="sliderNumber"
            :range-bar-height="6"
            :step="0.1"
            @on-change="handleSliderChange"
          ></slider>
          <div class="slider-label">{{rebate}}%</div>
        </div>
        <div class="input-box">
          <div>
            <Checkbox :value="$store.state.game.betSettings.presetMoneyCheck">预设金额:</Checkbox>
          </div>
          <div class="input-main">
            <InputNumber
              :inputStyle="{'text-align':'center','border':'none'}"
              :value="moneyNum"
              @handleNumberChange="handleNumberChange"
            />
            <div>元</div>
          </div>
        </div>
      </div>

      <div>
        <div class="summary-area">
          <div class="fs12 black-level6" style="margin-top:-2px;  font-size: 12px;">
            已选
            <span class="theme-color strong-font" style="font-weight: 400">{{$store.state.game.betTotalNum || 0}}</span> 注
          </div>
          <div class="fw500" style="font-size: 16px">
            共
            <span class="theme-color dib strong-font">{{(creditBetMoney*multiple || 0).toFixed(3) }} </span>
            <span class="fs14 dib"> 元</span>
          </div>
        </div>

        <div class="button-wrap">
          <button class="reset" @click="clearSelected">重置</button>
          <button class="bet" @click="addToBet">添加投注</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  generateBetContent,
  generateTplOrder
} from "../../util/lotteryAlgorithmUtil";
import { getComposeByArrays } from "../../util/index";
import InputNumber from "../../common/base/InputNumber/InputNumber";
export default {
  components: {
    InputNumber
  },
  data() {
    return {
      sliderNumber: 0,
      playModeMenus: ["元", "角", "分"],
      rate: 1,
      moneyNum: 2,
      multiple: 1,
      preSet: true
    };
  },
  computed: {
    betTotalMoney: function() {
      let rate;
      switch (this.$store.state.game.betSettings.playMode) {
        case "元":
          rate = 2;
          break;
        case "角":
          rate = 0.2;
          break;
        case "分":
          rate = 0.02;
          break;
      }
      this.rate =
        this.$store.state.game.currentGameInfo.position === 0
          ? rate
          : this.moneyNum;
      return this.rate * this.$store.state.game.betTotalNum;
    },
    creditBetMoney: function() {
      return _.sum(
        (this.$store.state.game.betData &&
          this.$store.state.game.betData.map(item => {
            return _.sum(
              item.list
                .filter(item1 => parseInt(item1.moneyNum))
                .map(item2 => parseInt(item2.moneyNum))
            );
          })) ||
          []
      );
    },
    maxLotteryMoney: function() {
      return this.rate * this.$store.state.game.betTotalNum * this.odds;
    },
    odds: function() {
      let playInfo = this.$store.state.game.playInfo;
      let betListData =
        playInfo.children && playInfo.children.length
          ? playInfo.children
          : playInfo.betData;

      // 返回了多个赔率的情况 比如特殊号
      if (betListData && betListData.length) {
        let arr = [];
        betListData.map(item => {
          arr.push(
            (
              item.odds_max -
              (item.odds_max - item.odds_min) * (this.sliderNumber / 100)
            ).toFixed(3)
          );
        });
        return Array.from(new Set(arr)).join(" | ");
      }
      return (
        playInfo.odds_max -
        (playInfo.odds_max - playInfo.odds_min) * (this.sliderNumber / 100)
      ).toFixed(3);
    },
    rebate: function() {
      let playInfo = this.$store.state.game.playInfo;
      let rebateMax =
        playInfo.rebate_max ||
        (playInfo.children &&
          playInfo.children.length &&
          playInfo.children[0].rebate_max);
      let rebateMin = parseInt(
        playInfo.rebate_min ||
          (playInfo.children &&
            playInfo.children.length &&
            playInfo.children[0].rebate_min)
      );
      return (
        rebateMin +
        (rebateMax - rebateMin) * (this.sliderNumber / 100)
      ).toFixed(1);
    }
  },
  created() {},
  methods: {
    ...mapActions(["BET"]),
    clearSelected() {
      this.$eventBus.$emit("clearSelectedBet");
    },
    handleNumberChange(e) {
      // 设置单注金额
      this.moneyNum = e.target.value;

      this.$store.commit("setBetSettings", {
        ...this.$store.state.game.betSettings,
        moneyNum: e.target.value
      });
    },
    handlePlayModeChange(index) {
      // 设置单注金额

      let moneyNum;
      switch (this.playModeMenus[index]) {
        case "元":
          moneyNum = 2;
          break;
        case "角":
          moneyNum = 0.2;
          break;
        case "分":
          moneyNum = 0.02;
          break;
      }
      this.$store.commit("setBetSettings", {
        ...this.$store.state.game.betSettings,
        playMode: this.playModeMenus[index],
        moneyNum
      });
    },
    handleSliderChange(val) {
      this.$store.commit("setBetSettings", {
        ...this.$store.state.game.betSettings,
        sliderNum: val
      });
    },
    handleMultipleChange(e) {
      this.multiple = e.target.value;
      this.$store.commit("setBetSettings", {
        ...this.$store.state.game.betSettings,
        multiple: e.target.value
      });
    },
    addOrderToLocalStorage(betArr) {
      // 把符合条件的注单添加到localStorage中
      let tplBetOrder = JSON.parse(localStorage.getItem("tplBetOrder")) || {
        list: []
      };
      tplBetOrder.game_code = this.$store.state.game.currentGameInfo.game_code;
      tplBetOrder.round = this.$store.state.game.currentGameInfo.round;
      tplBetOrder.list = [...betArr, ...tplBetOrder.list];
      // 清除不属于当前游戏的临时注单
      this.clearAdditionalOrder(tplBetOrder);
      localStorage.setItem("tplBetOrder", JSON.stringify(tplBetOrder));
    },
    clearAdditionalOrder(order) {
      order.list = order.list.filter(
        item => item.game_code === order.game_code
      );
    },
    addToBet() {
      if (!this.$store.state.game.betTotalNum) {
        this.$Message.error("下注类容不符合条件");
        return;
      }
      if (!this.checkBetContent()) {
        return;
      }

      // this.addOrderToLocalStorage(this.generateTplOrder())
      this.addOrderToLocalStorage(generateTplOrder(this.$store));

      this.$eventBus.$emit("addToLocalStorage");
      /* 生成临时注单 ,需要放在localStorage中*/
      // (game_code,round,)
      /* 跳转到确认投注单页面 */
    },
    checkBetContent() {
      /* 不满足下注条件时 */
      // errorInfo:下注不满足条件时候的错误提示
      let betTplType = this.$store.state.game.betTplType;
      let errorInfo =
        betTplType === "textArea"
          ? "输入号码不规范,请重新输入"
          : "号码选择不完整,请重新选择";
      if (!this.$store.state.game.betTotalNum) {
        this.$eventBus.$emit("toast", {
          type: "warn",
          time: 2000,
          text: errorInfo
        });
        // 无法通过过滤
        return false;
      }
      // 通过过滤
      return true;
    }
  },
  watch: {
    "$store.state.game.currentGameInfo": function() {
      // 切换玩法之后需要重置对应的数据
      this.multiple = 1;
      this.sliderNumber = 0;
      this.rate = 1;
      this.moneyNum = 2;
    }
  }
};
</script>

<style scoped lang="scss">
.lottery-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
.option-left {
  width: 655px;
  justify-content: space-between;
  display: flex;
  align-items: center;
  .slider-area {
    width: 240px;
    font-size: 12px;
    >div:nth-child(1){
      color: #FA2938;
    }
    > div {
      display: flex;

      justify-content: space-between;
      align-items: center;
      .fw500{
        font-size:16px;
      }
      > .slider {
        flex: 1;
        margin: 0 10px;
      }
    }
  }
  .input-area {
    display: flex;
    align-items: center;
    .icon-wrap {
      background-color: #fafbff;
      cursor: pointer;
    }
    span{
      font-size: 12px;
    }
    .input-multiple {
      border: solid 1px #e2e4ef;
      border-radius: 3px;
      display: flex;
      align-items: center;
      margin: 0 10px;
      width: 98px;
      color: #666;
      .iconfont {
        font-size: 14px;
        font-weight: bold;
      }
      > div:not(.input-main) {
        width: 35px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      > div.disabled {
        color: #ababab;
      }
      > .input-main {
        flex: 1;
        display: flex;
        align-items: center;
        padding-right: 5px;
      }
    }
  }
  .playmode-list {
    display: flex;
    border: solid thin #e2e4ef;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    .active {
      background-color: #ff505e;
      color: white;
    }
    > li {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
  }
  .strong-font{
    color: #fa2939;
    font-size: 16px;
    font-weight: 600
  }
}
.option-right {
  > button {
    width: 218px;
    height: 40px;
    line-height: 40px;
    border: none;
    outline: none;
    border-radius: 5px;
    box-shadow: -1px 3px 4px #ffd0d3;
    font-weight: 600;
    text-align: center;
    font-size: 14px;
    background: linear-gradient(to right, #f30c1e, #ff505e);
    color: #fff;
    &:hover {
      background: linear-gradient(to right, #ff505e, #f30c1e);
    }
    > .iconfont {
      vertical-align: middle;
      margin-right: 5px;
    }
  }
}

.lottery-game-bottom-credit {
  display: flex;
  justify-content: space-between;
  > div {
    display: flex;
    align-items: center;
  }
  .slider-area {
    width: 240px;
    display: flex;
    align-items: center;

    > div:not(.slider-label) {
      flex: 1;
    }
    > .slider-label {
      width: 50px;
    }
  }
  .input-box {
    display: flex;
    align-items: center;
    .input-main {
      display: flex;
      align-items: center;
      input {
        width: 120px;
        height: 28px;
        border: solid thin #e2e4ef;
        font-size: 14px;
      }
    }
  }
  .summary-area {
    margin-right: 20px;

    .strong-font{
      color: #fa2939;
      font-size: 16px;
      font-weight: 600
    }
  }
  .button-wrap {
    width: 266px;
    display: flex;
    justify-content: space-between;
    > button {
      width: 127px;
      height: 40px;
      &.reset {
        color: red;
        border: solid thin red;
      }
      &.bet {
        background-color: red;
        color: white;
      }
    }
  }

}
</style>

<style>
.slider-area .ivu-slider-wrap {
  margin: 0;
}
</style>


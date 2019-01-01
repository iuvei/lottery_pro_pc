<template>
  <div class="open-lottery">
    <div class="open-lottery-left">
      <div class="lottery-option">
        <div class="lottery-icon">
          <img :src="$store.state.game.currentGameInfo.icon_3x" alt>
        </div>
        <div class="lottery-name">
          <div style="font-weight: 600; font-size: 16px;color: #333;">{{$store.state.game.currentGameInfo.name}}</div>
          <div class="play-tab">
            <div
              v-show="$store.state.game.gameType!==1"
              :class="{'active':activeTab===0}"
              @click="changePlayTab(0)"
            >官方玩法</div>
            <div
              v-show="$store.state.game.gameType!==0"
              :class="{'active':activeTab===1}"
              @click="changePlayTab(1)"
            >信用玩法</div>
          </div>
        </div>
        <div class="lottery-info-wrap">
          <div class="peroid-num">总共：120期</div>
          <div class="trend">号码走势</div>
        </div>
      </div>
      <div class="countdown-box">
        <div>
          <span style="font-size: 14px">第{{$store.state.game.currentGameInfo.round}}期 </span>
          <span style="color: #999; font-size: 12px">截止投注</span>
        </div>
        <div class="countdown-time" v-show="openTime.split(':')[0].length==2"v-cloak>
          <span class="time-black-cell" v-cloak>{{openTime.split(":")[0]}}</span><span class="spacer">:</span>
          <span class="time-black-cell" v-cloak>{{openTime.split(":")[1]}}</span><span class="spacer">:</span>
          <span class="time-black-cell" v-cloak>{{openTime.split(":")[2]}}</span>
        </div>
      </div>
    </div>
    <div>
      <div class="lottery-number">
        <div>
          第{{lastRound}}期
          <span class="color-red" style="font-size: 12px;">已开奖</span>
        </div>
        <div>
          <ul class="peroid-number-list">
            <li
              v-for="number in lotteryAreaData.openedLotteryList&&lotteryAreaData.openedLotteryList[0].number.split(',')"
              :class="[`peroid-number-item-${number}`,setBgColor($store.state.game.currentGameInfo.type,number)]"
            >
              <div>{{number}}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="toggle-peroid"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { transformSecondsToTime } from "../../util/index";
export default {
  data() {
    return {
      currentGame: {},
      numberList: [],
      lotteryAreaData: {},
      recentLotteryShow: false,
      countDownTimer: null,
      openTime: "加载中...",
      confirmShow: false,
      lastRound: "",
      round: "",
      cancelText: "取消",
      cancelSeconds: 5,
      confirmTimer: null,
      fetchGameTimer: null,
      openHeight: "0px",
      lotteryName: "",
      activeTabIndex: null
    };
  },
  computed: {
    activeTab: function() {
      return this.activeTabIndex !== null
        ? this.activeTabIndex
        : this.$store.state.game.gameType === 0 ||
          this.$store.state.game.gameType === 2
        ? 0
        : 1;
    }
  },
  created() {
    this.initPage();
  },
  methods: {
    ...mapActions(["GET_GAME_RESULT", "GET_MEMBER_INFO"]),
    initPage() {
      /* 获取开奖结果 */
      this.getGameResult();
      // 设置彩种名称
      this.getLotteryName();
      // 登录之后获取余额
      this.$store.getters.token && this.GET_MEMBER_INFO({ item: "balance" });
      // 设置默认选中的玩法
    },
    changePlayTab(index) {
      this.$eventBus.$emit("changePlayTab", index);
      this.activeTabIndex = index;
    },
    getLotteryName() {
      let lotteryName;
      let _this = this;
      // 彩种名称
      this.$store.state.game.gameInfo &&
        this.$store.state.game.gameInfo.forEach(item => {
          item.includes.forEach(gameItem => {
            if (gameItem.game_code === this.$route.params.game_code) {
              lotteryName = gameItem.name;
              _this.lotteryName = lotteryName;
            }
          });
        });
    },
    toggleLotteryList() {
      this.recentLotteryShow = !this.recentLotteryShow;
      window.scrollTo(0, 0);
    },
    getGameResult() {
      this.GET_GAME_RESULT({
        game_code: this.$route.params.game_code
      }).then(res => {
        console.log(res)
        this.lastRound = res.data.last.round;
        if (!res.data.next) {
          return;
        }
        // 下一期
        this.round = res.data.next.round;
        this.lotteryAreaData.periodNumber = res.data.next.round.slice(-3);

        // 更新确认投注单数据里的期数
        this.updateOrderList();
        // 如果没有获取到当前最新的开奖号码，需要重新获取接口
        if (res.data.next.round - res.data.last.round !== 1) {
          clearTimeout(this.fetchGameTimer);
          this.fetchGameTimer = setTimeout(() => {
            this.getGameResult();
          }, 3000);
        } else {
        }
        if (
          this.$store.state.game.currentGameInfo.round !== res.data.next.round
        ) {
          // 设置当前游戏的信息
          this.$store.commit("setCurrentGameInfo", {
            ...this.$store.state.game.currentGameInfo,
            round: res.data.next.round
          });
        }
        // 倒计时
        this.lotteryAreaData.countDown =
          res.data.next.end_time - res.data.next.current_time;

        // 倒计时转换为时间
        this.openTime = transformSecondsToTime(
          this.lotteryAreaData.countDown || 0
        );
        // 最近5期开奖结果
        this.lotteryAreaData.openedLotteryList = res.data.history;
        // 重新倒计时
        clearInterval(this.countDownTimer);
        this.countDown();
      });
    },
    updateOrderList() {
      // 更新localStorage存放的期数
      let orderData = JSON.parse(localStorage.getItem("tplBetOrder")) || {
        list: []
      };
      if (orderData.list) {
        orderData.list = orderData.list.map(item => {
          item.round = this.round;
          return item;
        });
      }
      orderData.round = this.round;
      localStorage.setItem("tplBetOrder", JSON.stringify(orderData));
    },
    countDown() {
      this.countDownTimer = setInterval(() => {
        if (this.lotteryAreaData.countDown >= 1) {
          this.lotteryAreaData.countDown -= 1;
        }
        this.openTime = transformSecondsToTime(
          this.lotteryAreaData.countDown || 0
        );
        // console.log(this.lotteryAreaData.countDown)
        if (this.lotteryAreaData.countDown === 0) {
          // 显示清空弹窗
          this.confirmShow = true;
          // 弹窗倒计时
          this.setCancelText();
          // 清空倒计时
          clearInterval(this.countDownTimer);
          // 重新请求开奖数据,直到开出奖
          this.getGameResult();
        }
      }, 1000);
    },
    onConfirm() {
      this.$eventBus.$emit("clearSelectedBet");
    },
    setCancelText() {
      if (this.cancelSeconds !== 0) {
        this.cancelSeconds -= 1;
        this.confirmTimer = setTimeout(() => {
          this.setCancelText();
        }, 1000);
      } else {
        this.confirmShow = false;
      }
      this.cancelText = `取消(${this.cancelSeconds + 1}秒)`;
    },
    handleConfirmHide() {
      this.cancelSeconds = 5;
    },
    setBgColor(type, number) {
      let bgClass = "";
      if (type === "six") {
        if (
          [
            "1",
            "2",
            "7",
            "8",
            "12",
            "13",
            "18",
            "19",
            "23",
            "24",
            "29",
            "30",
            "34",
            "35",
            "40",
            "45",
            "46"
          ].includes(number)
        ) {
          bgClass = "redNum";
        }
        if (
          [
            "3",
            "4",
            "9",
            "10",
            "14",
            "15",
            "20",
            "25",
            "26",
            "31",
            "36",
            "37",
            "41",
            "42",
            "47",
            "48"
          ].includes(number)
        ) {
          bgClass = "blueNum";
        }
        if (
          [
            "5",
            "6",
            "11",
            "16",
            "17",
            "21",
            "22",
            "27",
            "28",
            "32",
            "33",
            "38",
            "39",
            "43",
            "44",
            "49"
          ].includes(number)
        ) {
          bgClass = "greenNum";
        }
      }
      return bgClass;
    }
  },
  destroyed() {
    clearInterval(this.countDownTimer);
    clearTimeout(this.confirmTimer);
    clearTimeout(this.fetchGameTimer);
  }
};
</script>

<style lang="scss" scoped>
.open-lottery {
  display: flex;
  justify-content: space-between;
}
.lottery-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lottery-icon {
  width: 60px;
  height: 60px;
  border-radius: 60px;
  margin-right: 20px;
  > img {
    width: 100%;
  }
}
.play-tab {
  display: flex;
  line-height: 24px;
  border-radius: 24px;
  width: 88px;
  font-size: 12px;
  overflow: hidden;
  text-align: center;
  margin-top: 6px;
  background-color: #fafbff;
  > div {
    flex: 1;
    cursor: pointer;
  }
  > .active {
    background: linear-gradient(to right, #F74654, #FC6672);
    color: white;
  }
}
.trend {
  line-height: 25px;
  width: 68px;
  background-color: #fff;
  font-size: 12px;
  border: 1px solid #F0F1F6;
  border-radius: 25px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
}
.lottery-name {
  margin-right: 20px;
}
.peroid-num {
  font-size: 12px;
}
.lottery-info-wrap {
  display: flex;
  flex-direction: column;
  height: 48px;
  justify-content: space-between;
}
.open-lottery-left {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 520px;
  text-align: center;
}
.countdown-time {
  font-size: 30px;
  font-weight: 500;
  margin-top: 5px;
  position: relative;
}
.time-black-cell{
  background-color: #32343E;
  display: inline-block;
  width: 48px;
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  color: #fff;
  box-shadow:0px 20px 10px -15px #32343E;
}
.spacer{
  color: #32343E;
  height: 34px;
  display: inline-block;
  width: 15px;
}
.peroid-number-list {
  display: flex;
  margin-top: 5px;
}
.peroid-number-list > li {
  width: 38px;
  height: 38px;
  border-radius: 38px;
  font-size: 22px;
  text-align: center;
  line-height: 38px;
  color: white;
  background: linear-gradient(to right, #F74654, #FC6672);
  margin-right: 8px;
}
.color-red {
  color: red;
}
</style>

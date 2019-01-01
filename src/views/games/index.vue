<template>
  <div class="game-box">
    <SiderMenu />
    <div
      class="game-main"
      :style="{height:$window.innerHeight-120+'px'}"
    >
      <div class="bet-main">
        <OpenLottery />
        <LotteryGameMenu />
        <!-- 下注模板 -->
        <router-view></router-view>
        <!-- 彩种调节 -->
        <LotteryGameBottom />
      </div>

      <div class="bet-confirm-order">
        <!-- 注单确认区域 -->
        <ConfirmOrder />
      </div>
      <div class="lottery-history">
        <!-- 下注历史 -->
        <LotteryHistory />
      </div>
    </div>
    <div v-if="false" class="game-right">

    </div>
  </div>
</template>

<script>
// 左侧彩种菜单
import SiderMenu from "../../components/game/SiderMenu";
// 开奖区域
import OpenLottery from "../../components/game/OpenLottery";
// 彩种菜单
import LotteryGameMenu from "../../components/game/LotteryGameMenu";
// 彩种调节
import LotteryGameBottom from "../../components/game/LotteryGameBottom";
// 确认投注
import ConfirmOrder from "../../components/game/ConfirmOrder";
// 下注历史，开奖历史
import LotteryHistory from '../../components/game/LotteryHistory'
export default {
  components: {
    SiderMenu,
    OpenLottery,
    LotteryGameMenu,
    LotteryGameBottom,
    ConfirmOrder,
    LotteryHistory
  }
};
</script>

<style lang="scss" scoped>
.game-box{
  width: 1285px;
  margin: 0 auto;
}
.game-main {
  width: 1090px;
  height: calc(100% - 122px);
  overflow-y: auto;
  margin-left: 200px;
}
.bet-main {
  background-color: white;
  margin-top: 10px;
  border: solid thin #F0F1F6;
  padding: 15px 20px;
}
.game-right {
  width: 500px;
  height: calc(100% - 122px);
  position: fixed;
  right: 0;
  top: 122px;
  background-color: white;
}
.bet-confirm-order {
  height: 200px;
  border: solid thin #F0F1F6;
  margin-top: 10px;
  background-color: white;
}
.lottery-history {
  height: 210px;
  border: solid thin #F0F1F6;
  margin-top: 10px;
  background-color: white;
}
@media screen and (max-width: 1850px) {
  .game-right {
    display: none;
  }
}
</style>

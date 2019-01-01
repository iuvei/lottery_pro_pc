<template>
  <div class="bet-area" style="padding-left: 10px":class="{'bet-area-credit':$store.state.game.currentGameInfo.position===1}">
    <ul class="bet-area-list" v-if="$store.state.game.betTplType!=='textArea'"  :class="{'long-hu':$store.state.game.playMenuTitle==='龙虎'}">
      <li
        v-for="(item,index) in betData"
        :class="{'horizontal':item.horizontal||betData.length===1}"
      >
        <div class="bet-area-content">
          <div class="bet-area-content-wrap">
            <div
              class="bet-area-title"
              v-if="$store.state.game.playMenuTitle==='龙虎'"
              :style="setMarginTop(item)"
            >
              <div v-if="index===0" class="dib">选码</div>
            </div>
            <div
              class="bet-area-title bet-area-vs-title"
              v-else-if="$store.state.game.playMenuTitle==='龙虎斗'"
            >{{item.title.split('vs')[0]}} vs {{item.title.split('vs')[1]}}</div>
            <div class="bet-area-title" v-else :style="setMarginTop(item)">
              <div class="dib">{{item.title}}</div>
            </div>
            <ul
              class="select-round-list"
              :class="`${$store.state.game.currentGameInfo.type}-${$store.state.game.playInfo.id}`"
              v-if="$store.state.game.betTplType==='roundList'||$store.state.game.playMenuTitle==='连码-三中二'||$store.state.game.playMenuTitle==='连码-二中特'"
            >
              <!-- 选择数字的,大小单双 -->
              <li v-for="(subItem,subIndex) in item.list" :class="{'empty-cell':subItem.empty}">
                <div
                  @click="selectItem(index,subItem,subIndex)"
                  :class="[{'bet-selected-item':item.selectedList.map(st=>st.name).includes(subItem.name)},subItem.color]"
                  :style="setStyle(subItem,item)"
                >{{subItem.name}}</div>
              </li>
            </ul>

            <ul class="select-rect-list" v-if="$store.state.game.betTplType==='rectList'">
              <!-- 选择方块 -->
              <li
                v-for="(subItem,subIndex) in item.list"
                :style="calcSelectItem(item.list&&item.list.length)"
              >
                <div
                  @click="selectItem(index,subItem,subIndex)"
                  :class="{'bet-selected-item':item.selectedList.map(st=>st.name).includes(subItem.name)}"
                >{{subItem.name}}</div>
              </li>
            </ul>

            <ul class="select-dragonTiger-list" v-if="$store.state.game.betTplType==='vsList'">
              <!-- 选择龙虎 -->
              <li :style="calcSelectItem(item.list&&item.list.length)">
                <div
                  @click="selectDragon(item,index,0)"
                  :class="{'bet-selected-item':item.selectedList&&item.selectedList.includes(item.list[0])}"
                >{{item.list[0]}}</div>
                <div>vs</div>
                <div
                  @click="selectDragon(item,index,1)"
                  :class="{'bet-selected-item':item.selectedList&&item.selectedList.includes(item.list[1])}"
                >{{item.list[1]}}</div>
              </li>
            </ul>

            <ul
              class="rect-odds-list"
              :class="[item.width&&`rect-odds-list-${item.width}`]"
              v-if="$store.state.game.betTplType==='rectOddsList'&&($store.state.game.playMenuTitle!=='连码-三中二'&&$store.state.game.playMenuTitle!=='连码-二中特')"
            >
              <!-- 两面盘还有赔率 -->
              <li
                v-for="(subItem,subIndex) in item.list"
                :key="subIndex"
                @click="selectItem(index,subItem,subIndex)"
                class="rect-odds-item"
                :class="[
              {'rect-odds-item-selected':setRectOddsSelected(subItem,item.selectedList)},
              {'empty-cell':subItem.empty}
              ]"
              >
                <!-- 筛子 -->
                <div v-if="item.type==='dice'">
                  <Dice :title="item.title" :dicePoint="subItem.name"/>
                </div>
                <!-- 默认 -->
                <div
                  class="bet-text-wrap"
                  :class="{'bet-number':(!isNaN(subItem.name*1))&&($store.state.game.currentGameInfo.type!=='six')}"
                  :style="setStyle(subItem)"
                  v-else
                >{{subItem.name}}</div>
                <div
                  class="odds-wrap"
                >{{( subItem.odds_max - (subItem.odds_max - subItem.odds_min) * ($store.state.game.betSettings.sliderNum / 100) ).toFixed(3)}}</div>
                <div class="input-wrap" @click.stop v-if="inputType==='text'">
                  <InputNumber
                    @handleNumberChange="e=>{
                       handleMoneyChange(e,index,subIndex)
                     }"
                    :value="subItem.moneyNum"
                    :inputStyle="{'border-radius':'4px','border':'1px solid #dfdfdf','text-align':'center'}"
                  />
                </div>
                <div class="input-wrap" @click.stop v-if="inputType==='checkbox'">
                  <input type="checkbox" :checked="setRectOddsSelected(subItem,item.selectedList)">
                </div>
              </li>
            </ul>
          </div>

          <div v-if="item.selectedBtnType!==undefined">
            <ul class="btn-select-list black-level5" @click="selectList($event,item,index)">
              <li
                v-for="itemBtn in btnSelectList"
                :class="{'btn-selected-item':item.selectedBtnType===itemBtn}"
              >{{itemBtn}}</li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="$store.state.game.betTplType==='textArea'">
      <textarea
        type="number"
        v-model="betText"
        class="bet-area-textarea"
        placeholder="每注号码之间请使用逗号（，）、分号（；）或回车键隔开，每注内间隔使用空格即可。如123；34567；"
      />
      <div class="text-intro">每一注号码之间请用一个空格、逗号或者分号隔开(输入的号码会自动排序并去除不合格号码)。</div>
    </div>
  </div>
</template>

<script>
import { generateBetTplData } from "../../util/generateBetTplData";
import { calcBetNum, filterBetData } from "../../util/lotteryAlgorithmUtil";
import Dice from "./Dice";
import setGameSixColor from "../../util/game/setGameSixColor";
import InputNumber from "../../common/base/InputNumber/InputNumber";
export default {
  components: {
    Dice,
    InputNumber
  },
  computed: {
    inputType: function() {
      let type = "text";
      ["连码", "合肖", "连肖", "尾数连", "全不中"].map(item => {
        if (this.$store.state.game.playMenuTitle.search(item) !== -1) {
          type = "checkbox";
        }
      });
      return type;
    }
  },
  data() {
    return {
      betData: [],
      originalBetData: [],
      betText: "",
      btnSelectList: ["全", "大", "小", "单", "双", "清"],
      gameType: ""
    };
  },
  created() {
    this.getGameType();
    var _this = this;
    this.$bus.on("clearSelect",()=>{
        for(var i in _this.betData){
            _this.betData[i].selectedList = [];
        }
        _this.betText = "";
    })
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.getTplType();
      this.registerGlobalEvents();
    },
    setMoneyNum(item, subItem) {
      if (subItem.moneyNum !== undefined) {
        return subItem.moneyNum;
      } else if (
        this.$store.state.game.betSettings.moneyNum &&
        this.setRectOddsSelected(subItem, item.selectedList)
      ) {
        return this.$store.state.game.betSettings.moneyNum;
      } else {
        return "";
      }
    },
    handleMoneyChange(e, index, subIndex) {
      this.betData[index].list.splice(subIndex, 1, {
        ...this.betData[index].list[subIndex],
        moneyNum: e.target.value
      });
    },
    getGameType() {
      this.$store.state.game.gameInfo.forEach(game => {
        game.includes.map(item => {
          if (item.game_code === this.$route.params.game_code) {
            // 加载对应的模板
            this.gameType = game.type;
            // 判断是否切换了游戏
            // 设置当前游戏的信息
            this.$store.commit("setCurrentGameInfo", {
              ...this.$store.state.game.currentGameInfo,
              name: item.name,
              game_code: item.game_code,
              type: game.type,
              position: this.$store.state.game.currentGameInfo.position || 0
            });
          }
        });
      });
    },
    setZoom(title) {
      if (!title) {
        return {};
      }
      let zoom = 1;
      if (title.length > 3) {
        zoom = 1 - (title.length - 3) * 0.2;
      }
      return { transform: `scale(${zoom})` };
    },
    setMarginTop(item) {
      let style = {};
      if (item.selectedBtnType === undefined) {
        style["margin-top"] = "12px";
      }
      return style;
    },
    setStyle(betText, item) {
      let res = {};
      if (isNaN(betText.name * 1)) {
        res = {
          "font-size": "14px",
          "font-weight": "bold"
        };
      }
      return res;
    },
    getTplType() {
      let betTplType = "roundList";
      let navTitle = this.$store.state.game.playMenuTitle.split("-")[0];
      let subNavTitle = this.$store.state.game.playMenuTitle.split("-")[1];
      if (navTitle === "龙虎" && this.gameType === "ssc") {
        betTplType = "vsList";
      }
      if (
        navTitle === "任选单式" ||
        (subNavTitle &&
          (subNavTitle.indexOf("单式") !== -1 ||
            subNavTitle.indexOf("混合组选") !== -1))
      ) {
        betTplType = "textArea";
      }
      // 快三部分玩法方形下注样式
      if (
        this.$store.state.game.currentGameInfo.type === "k3" &&
        (navTitle === "三同号" || navTitle === "三连号")
      ) {
        betTplType = "rectList";
      }

      if (this.$store.state.game.currentGameInfo.position === 1) {
        betTplType = "rectOddsList";
      }
      this.$store.commit("setBetTplType", betTplType);

      return betTplType;
    },
    calcSelectItem(len) {
      if (!len) {
        return {};
      }
      if (len === 4) {
        // 当只有四个如大小单双
        return {
          width: "25%"
        };
      }
    },
    generateBetTplData(menu) {
      let { odds_max, odds_min } = this.$store.state.game.playInfo;
      let betData = generateBetTplData({
        position:this.$store.state.game.currentGameInfo.position,
        playMenu: menu,
        lotteryType: this.gameType,
        playInfo: this.$store.state.game.playInfo,
        odds_max,
        odds_min,
        lotteryGameInfo: this.$store.state.game.gameInfo
      }).betData;
      // 给每一个betItem加上index
      betData.map(item => {
        item.list.map((item1, index) => {
          if (typeof item1 === "object") item1.index = index;
        });
      });
      this.betData = betData;
    },
    registerGlobalEvents() {
      this.$eventBus.$on("menuChange", title => {
        this.getTplType();
        this.generateBetTplData(title);
        this.clearAll();
      });
      this.$eventBus.$on("clearSelectedBet", () => {
        this.clearAll();
      });
      this.$eventBus.$on("randomSelect", randomList => {
        this.randomSelect(randomList);
      });
    },
    unregisterGlobalEvents() {
      this.$eventBus.$off("menuChange");
      this.$eventBus.$off("clearSelectedBet");
      this.$eventBus.$off("randomSelect");
    },
    randomSelect(list) {
      let { betTplType } = this.$store.state.game;
      if (betTplType === "textArea") {
        this.betText = list.join("");
      } else {
        this.betData = list;
      }
    },
    selectItem(index, item,subIndex) {
      let selectedList = this.betData[index].selectedList;
      let navTitle = this.$store.state.game.playMenuTitle.split("-")[0];
      let subNavTitle = this.$store.state.game.playMenuTitle.split("-")[1];
      let { type, position } = this.$store.state.game.currentGameInfo;
      this.originalBetData = _.cloneDeep(this.betData);

      if (selectedList.map(item1 => item1.name).indexOf(item.name) !== -1) {
        this.betData[index].selectedList = _.remove(
          selectedList,
          selectedItem => selectedItem.name !== item.name
        );
      } else {
        this.betData[index].selectedList.push(item);
        // 如果预设金额勾选的话，选中了某一项之后需要把改项的默认金额改为预设的金额
        if(position===1){
          this.betData[index].list[subIndex].moneyNum = this.$store.state.game.betSettings.moneyNum
        }
        if (subNavTitle === "组选包胆" || subNavTitle === "红投") {
          // 单选
          this.betData[index].selectedList = [item];
        }
      }

      // 六合彩
      if (type === "six") {
        if (
          navTitle === "连码" ||
          subNavTitle === "五不中" ||
          subNavTitle === "六不中" ||
          subNavTitle === "七不中" ||
          subNavTitle === "八不中"
        ) {
          // 连码最多选10个号码
          if (this.betData[0].selectedList.length > 10) {
            this.betData[0].selectedList.splice(0, 1);
          }
        }
        if (
          ["九不中", "十不中", "十一不中", "十二不中"].includes(subNavTitle)
        ) {
          [
            {
              name: "九不中",
              len: 11
            },
            {
              name: "十不中",
              len: 12
            },
            {
              name: "十一不中",
              len: 13
            },
            {
              name: "十二不中",
              len: 14
            }
          ].map(item => {
            if (
              item.name === subNavTitle &&
              this.betData[0].selectedList.length > item.len
            ) {
              this.betData[0].selectedList.splice(0, 1);
            }
          });
        }
      }

      // 一些玩法需要对选中后的号码进行处理
      this.betData = filterBetData({
        oldBetData: _.cloneDeep(this.originalBetData),
        newBetData: _.cloneDeep(this.betData),
        store: this.$store
      });
      console.log(this.betData);
    },
    selectDragon(item, index, itemIndex) {
      let selectedList = this.betData[index].selectedList;
      let selectedItem = item.list[itemIndex];
      this.originalBetData = _.cloneDeep(this.betData);
      if (selectedList.includes(selectedItem)) {
        this.betData[index].selectedList = _.remove(
          selectedList,
          n => n !== selectedItem
        );
      } else {
        selectedList.push(selectedItem);
      }
    },
    selectList(e, item, index) {
      let type = e.target.innerText;
      let filteredList = this.filterSelectType(type, item.list);
      // 选中对应的按钮
      item.selectedBtnType = type;
      // 保存原始下注副本数据
      this.originalBetData = _.cloneDeep(this.betData);
      // 清空已经选中的
      this.betData[index].selectedList = [];
      // 选中筛选后的
      filteredList.map(x => {
        this.selectItem(index, x);
      });
    },
    setRectOddsSelected(subItem, selectedList) {
        var style = _.map(selectedList, item => item.name).includes(subItem.name);
        console.log(style);
      return style;
    },
    clearAll() {
      this.originalBetData = _.cloneDeep(this.betData);
      this.betData.map(item => {
        if (typeof item === "string") {
          return;
        }
        item.selectedList = [];
        item.list.map(item1 => delete item1.moneyNum);
        if (item.selectedBtnType !== undefined) {
          item.selectedBtnType = "";
        }
      });
      this.betText = "";
    },
    filterSelectType(type, list) {
      if (type === "全") {
        return list;
      }
      if (type === "大") {
        // 当list列表的长度不为偶数时
        let comparedNum = Math.ceil(list.length / 2 - 1);
        return list.filter(item => item.name > list[comparedNum].name);
      }
      if (type === "小") {
        // 当list列表的长度不为偶数时
        let comparedNum = Math.floor(list.length / 2 - 1);
        return list.filter(item => item.name <= list[comparedNum].name);
      }
      if (type === "单") {
        return list.filter(item => item.name % 2);
      }
      if (type === "双") {
        return list.filter(item => !(item.name % 2));
      }
      if (type === "清") {
        return [];
      }
    },
    setListClass(len, type) {
      let width = 5;
      if (len === 1) {
        return "";
      }
      if (!(len % 2)) {
        width = 2;
      }
      if (!(len % 3)) {
        width = 3;
      }
      if (!(len % 4)) {
        width = 4;
      }
      if (!(len % 5) || len === 11) {
        width = 5;
      }
      return `${type}-${width}`;
    }
  },
  watch: {
    betData: {
      deep: "true",
      handler: function(val, oldVal) {
        // 计算注单数
        let betTotalNum = calcBetNum({
          betData: val,
          store: this.$store
        });
        // 存到store中
        this.$store.commit("setBetTotalNum", betTotalNum);
        // 下注信息存到store中
        this.$store.commit("setBetData", val);
      }
    },
    "$store.state.game.checkListCombineNum": function(val) {
      let betData;
      if (this.betText) {
        betData = _.filter(
          _.compact(this.betText.replace(/;|、|；|，|\n|\s/g, ",").split(",")),
          n => !isNaN(n * 1)
        );
      } else {
        betData = this.betData;
      }
      // 计算注单数
      let betTotalNum = calcBetNum({
        betData,
        store: this.$store
      });
      this.$store.commit("setBetTotalNum", betTotalNum);
    },
    betText: function(val) {
      let array = _.filter(
        _.compact(val.replace(/;|、|；|，|\n|\s/g, ",").split(",")),
        n => !isNaN(n * 1)
      );
      let betTotalNum = calcBetNum({
        betData: array,
        store: this.$store
      });
      // 存到store中
      this.$store.commit("setBetTotalNum", betTotalNum);
      this.$store.commit("setBetData", array);
    },
    "$store.state.game.betSettings.moneyNum": function(val) {
      // 选中的项要变成和moneyNum一样的值
      this.betData = this.betData.map(item => {
        item.list
          .filter(item1 =>
            item.selectedList.map(item2 => item2.name).includes(item1.name)
          )
          .map(item => {
            item.moneyNum = val;
          });
        return item;
      });
      console.log(this.betData);
    }
  },
  destroyed() {
    this.unregisterGlobalEvents();
  }
};
</script>

<style scoped lang="scss">
@import "./betTpl.scss";
</style>

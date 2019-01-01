<template>
  <div>
    <div class="game-menu-box" @click="$store.commit('toggleGameMenu',false)">
      <div class="game-menu-main black-level5" @click.stop>
        <ul class="top-menu-list">
          <li
            v-for="(item,index) in firstLevelMenu"
            :class="{'game-menu-item-selected':activeFirstLevelIndex==index}"
            @click="selectTopMenu(item,index)"
          >
            <div>
              <span>{{item.name}}</span>
            </div>
          </li>
        </ul>

        <ul
          v-if="secondLevelMenu[activeSecondLevelIndex]&&secondLevelMenu[activeSecondLevelIndex].children[activeThirdLevelIndex]"
        >
          <li v-for="(item,index) in secondLevelMenu" class="sub_menu_box">
            <!-- 二级菜单标题 -->
            <div class="title-menu-list">{{item.name}}</div>
            <!-- 三级菜单 -->
            <div>
              <ul class="menu-list">
                <li
                  v-for="(subItem,subIndex) in item.children"
                  class="third-menu-item"
                  :class="{'game-menu-item-selected':activeSecondLevelIndex==index&&activeThirdLevelIndex==subIndex}"
                  @click="selectSubMenu(item,index,subIndex)"
                >
                  <div class="circle"></div>
                  <div style="font-size: 12px">{{subItem.name}}</div>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <ul class="menu-list second_menu_list" v-else>
          <li
            v-for="(item,index) in secondLevelMenu"
            class="third-menu-item"
            :class="{'game-menu-item-selected':activeSecondLevelIndex==index}"
            @click="selectSubMenu(item,index,0)"
          >
            <div class="circle"></div>
            <div style="font-size: 12px">{{item.name}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="play-intro">
      <div>
        <span class="theme-color mr5">玩法提示:</span>
        <span>{{$store.state.game.playInfo.remark}}</span>
      </div>
      <div class="play-intro-right theme-color">
        <div class="example">
          <Tooltip
            max-width="200"
            :content="$store.state.game.playInfo.description"
            v-if="$store.state.game.playInfo.description"
          >
            <i class="iconfont icon-jiangbei" style="font-size:16px"></i>
            中奖说明
          </Tooltip>
        </div>
        <div class="lotteyintro">
          <Tooltip
            max-width="200"
            :content="$store.state.game.playInfo.example"
            v-if="$store.state.game.playInfo.example"
          >
            <i class="iconfont icon-news" style="font-size:16px"></i>
            范例
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      menus: [],
      activeFirstLevelIndex: 0,
      activeSecondLevelIndex: 0,
      activeThirdLevelIndex: 0,
      firstLevelMenu: [],
      secondLevelMenu: [],
      firstPlayType: "",
      secondPlayType: "",
      position: 0,
      gameType: 0
    };
  },
  created() {
    /* 重置选中菜单 */
    this.initPage();
  },
  methods: {
    ...mapActions(["GET_PLAY_MENU"]),
    registerGlobalEvents() {
      this.$eventBus.$on("changePlayTab", index => {
        this.changePlayType(index);
      });
    },
    unRegisterGlobalEvents(){
      this.$eventBus.$off("changePlayTab")
    },
    initPage() {
      this.registerGlobalEvents()
      let { game_code } = this.$route.params;
      let restoreMenu = false;
      if (game_code !== this.$store.state.game.currentGameInfo.game_code) {
        // 需要重置菜单
        this.activeFirstLevelIndex = 0;
        this.activeSecondLevelIndex = 0;
        this.activeThirdLevelIndex = 0;
        restoreMenu = true;
      }
      this.$store.state.game.gameInfo.map(item => {
        item.includes.map(item1 => {
          if (item1.game_code === this.$route.params.game_code) {
            this.initPosition(parseInt(item1.position), restoreMenu);
          }
        });
      });
    },
    initPosition(pos, restoreMenu) {
      this.gameType = pos;
      this.$store.commit('setGameType',pos)
      console.log(pos)
      if (pos === 0 || pos === 2) {
        this.position = 0;
      }
      if (pos === 1) {
        this.position = 1;
      }
      if ("position" in this.$route.query) {
        this.position = parseInt(this.$route.query.position);
      }
      if (!restoreMenu) {
        this.position = parseInt(
          this.$store.state.game.currentGameInfo.position
        );
      }

      /* 获取游戏数据 */
      this.getGameData();
      /*  切换玩法类型*/
      this.$store.commit("setCurrentGameInfo", {
        ...this.$store.state.game.currentGameInfo,
        position: this.position
      });
      /* 设置默认选中的玩法 */
      this.setDefaultPlayInfo();
    },
    setDefaultPlayInfo() {
      // 设置选中的玩法
      // this.position = this.$route.query.position * 1 || 0
      // 判断是否切换了游戏
      if (
        this.$route.params.game_code !==
        this.$store.state.game.currentGameInfo.game_code
      ) {
        return;
      }
      let { activeIndexList } = this.$store.state.game.playInfo;
      //
      /*  if (this.$store.state.app.path.from.path.search('confirmOrder') === -1) {
        activeIndexList = [0, 0, 0]
        this.$store.commit('setCurrentGameInfo', {
          ...this.$store.state.game.currentGameInfo,
          position: 0
        })
      } */
      this.activeFirstLevelIndex = (activeIndexList && activeIndexList[0]) || 0;
      this.activeSecondLevelIndex =
        (activeIndexList && activeIndexList[1]) || 0;
      this.activeThirdLevelIndex = (activeIndexList && activeIndexList[2]) || 0;
    },
    getGameData() {
      let position = this.position;
      this.GET_PLAY_MENU({
        game_code: this.$route.params.game_code,
        position
      }).then(res => {
        this.menus = res.data[`games${position}`];
        this.setMenu();
      });
    },
    selectTopMenu(item, index) {
      // level 玩法层级
      this.activeFirstLevelIndex = index;
      this.activeSecondLevelIndex = 0;
      // 判断是否属于两面盘玩法

      this.secondLevelMenu = this.menus[this.activeFirstLevelIndex].children;
      if (!this.secondLevelMenu.length) {
        this.activeSecondLevelIndex = 0;
        this.activeThirdLevelIndex = 0;
        this.$store.commit("toggleGameMenu", false);
        this.setMenu();
      } else {
        this.selectSubMenu(this.secondLevelMenu[0], 0, 0, true);
      }
    },

    selectSubMenu(item, index, subIndex, showMenu) {
      this.activeSecondLevelIndex = index;
      this.activeThirdLevelIndex = subIndex;
      this.$store.commit("toggleGameMenu", showMenu || false);
      // 设置当前游戏玩法信息
      this.setMenu();
    },
    setMenu() {
      // 设置一级菜单menu
      this.firstLevelMenu = this.menus;
      this.secondLevelMenu = this.menus[this.activeFirstLevelIndex].children;
      let menuTitle = "";
      let firstMenuItem = this.menus[this.activeFirstLevelIndex];
      this.firstPlayType = `${firstMenuItem.name}`;

      // 一级菜单
      if (!firstMenuItem.children.length) {
        menuTitle = `${firstMenuItem.name}`;
      } else {
        if (
          !firstMenuItem.children[this.activeSecondLevelIndex].children.length
        ) {
          // 二级菜单
          menuTitle = `${firstMenuItem.name}-${
            firstMenuItem.children[this.activeSecondLevelIndex].name
          }`;
        } else {
          // 三级菜单
          menuTitle = `${firstMenuItem.name}-${
            firstMenuItem.children[this.activeSecondLevelIndex].children[
              this.activeThirdLevelIndex
            ].name
          }`;
        }
      }
      // 二码和三码玩法的菜单需要特别处理
      if (firstMenuItem.name === "二码" || firstMenuItem.name === "三码") {
        let navTitle = firstMenuItem.children[this.activeSecondLevelIndex].name;
        let subNavTitle =
          firstMenuItem.children[this.activeSecondLevelIndex].children[
            this.activeThirdLevelIndex
          ].name;
        menuTitle = `${navTitle}-${subNavTitle}`;
      }
      // 设置当前玩法信息
      let currentPlayInfo = {};
      if (!this.menus[this.activeFirstLevelIndex].children.length) {
        currentPlayInfo = this.menus[this.activeFirstLevelIndex];
      } else {
        if (
          !this.menus[this.activeFirstLevelIndex].children[0].children.length
        ) {
          currentPlayInfo = this.menus[this.activeFirstLevelIndex].children[
            this.activeSecondLevelIndex
          ];
        } else {
          currentPlayInfo = this.menus[this.activeFirstLevelIndex].children[
            this.activeSecondLevelIndex
          ].children[this.activeThirdLevelIndex];
        }
      }
      this.$store.commit("setPlayInfo", {
        activeIndexList: [
          this.activeFirstLevelIndex,
          this.activeSecondLevelIndex,
          this.activeThirdLevelIndex
        ],
        ...currentPlayInfo
      });
      this.$store.commit("setMenutitle", menuTitle);
      this.$eventBus.$emit("menuChange", menuTitle);
    },
    setZoom(len) {
      let zoom = 1;
      if (len > 4) {
        zoom = 1 - len * 0.05;
      }
      return { zoom };
    },
    resetMenu() {
      this.activeFirstLevelIndex = 0;
      this.activeSecondLevelIndex = 0;
      this.activeThirdLevelIndex = 0;
    },
    changePlayType(index) {
      this.position = index
      this.resetMenu();
      this.getGameData();
      this.$store.commit("setCurrentGameInfo", {
        ...this.$store.state.game.currentGameInfo,
        position: this.position
      });
    }
  },
  watch: {}
};
</script>
<style scoped>
.game-menu-box {
  margin-top: 10px;
  border-bottom: solid 0.5px #F0F1F6;
}
.game-menu-title {
  padding-left: 10px;
}

.top-menu-list {
  background: linear-gradient(to bottom, #fcfcff, #f3f5fb);
  border-radius: 4px 4px 0 0;
  border-bottom: solid 0.5px #fa2939;
  color: #333;
}

.top-menu-list,
.menu-list {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  font-size: 14px;
}

.top-menu-list > li,
.menu-list > li {
  box-sizing: border-box;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px 0 0 0 ;
}

.top-menu-list .game-menu-item-selected {
  background-color: #fa2939;
}

.top-menu-list .game-menu-item-selected {
  color: white;
  border: none;
}

.third-menu-item {
  display: flex;
  align-items: center;
}

.menu-list {
  display: flex;
}

.title-menu-list {
  padding-left: 10px;
}

.sub_menu_box {
  display: flex;
  align-items: center;
}

.sub_menu_box > div:last-child {
  flex: 1;
}

.sub_menu_box .game-menu-item-selected {
  color: #fa2939;
}
.play-tab-list {
  padding: 10px 10px 0 10px;
}

.circle {
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background-color: white;
  border: solid 5px #e2e4ef;
  margin-right: 10px;
}

.game-menu-item-selected .circle {
  border-color: #fa2939;
}
.play-intro {
  display: flex;
  justify-content: space-between;
  line-height: 35px;
  font-size: 12px;
  padding-left: 10px;
  color: #666;
}
.play-intro-right {
  display: flex;
  cursor: pointer;
}
.example {
  margin-right: 10px;
}
.theme-color {
  color: #fa2939;
}
.mr5 {
  margin-right: 5px;
}
</style>
<style>
.play-intro .ivu-tooltip-popper {
  width: 300px;
}
</style>


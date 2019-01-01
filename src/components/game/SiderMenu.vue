<template>
  <div class="sider-menu">
    <div>
      <ul class="lottery-type-list">
        <li v-for="item in menuList" :class="{'active':item.active}">
          <div @click="toggleFold(item)">
            <div class="lottery-type-item">
              <div class="lottery-icon">
                <img :src=" require('../../../static/images/icons/'+item.type + '.png')">
              </div>
              <div class="lottery-name-wrappper">
                <div>{{item.name}}</div>
                <i class="iconfont icon-jianhao" v-if="item.active"></i>
                <i class="iconfont icon-jiahao1" v-else></i>
              </div>
            </div>
            <div></div>
          </div>
            <div v-show="item.active">
              <ul class="lottery-game-list">
                <li v-for="game in item.includes" :class="{'active':game.active}" @click="goToGame(game, icon_3x)">
                  <div class="lottery-icon">
                      <img :src="game.icon_2x">
                  </div>
                  <div>
                    {{game.name}}
                  </div>
                </li>
              </ul>
            </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.menuList = _.cloneDeep(this.$store.state.game.gameInfo).map(item => {
        item.includes.map(item1 => {
          if (item1.game_code === this.$route.params.game_code) {
            item.active = true
            item1.active = true
              this.$store.commit("setCurrentGameInfo", {
                ...this.$store.state.game.currentGameInfo,
                icon_3x: item1.icon_3x
              });
          }
          return item1
        })
        return item
      })
    },
    toggleFold(item) {
      this.menuList = this.menuList.map(item1 => {
        if (item.type === item1.type) {
          item1.active = !item1.active
        }
        return item1
      })
    },
    goToGame(item) {
      this.$store.commit("setCurrentGameInfo", {
        ...this.$store.state.game.currentGameInfo,
        icon_3x: item.icon_3x
      });
      this.$router.push({
        path: `/game/${item.game_code}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sider-menu {
  width: 190px;
  height: calc(100% - 122px);
  position: fixed;
  top: 104px;
  z-index: 10;
  background-color: white;
  cursor: pointer;
  border-right: solid 0.5px #F0F1F6;
  border-left: solid 0.5px #F0F1F6;
  .lottery-icon {
    width: 28px;
    height: 28px;
    border-radius: 28px;
    margin-right: 15px;
    >img{
      width: 28px;
    }
  }
}
.lottery-type-item {
  height: 40px;
  line-height: 40px;
  display: flex;
  border-left: 1px solid #F0F1F6;
  align-items: center;
  padding: 0 20px;
  .iconfont {
    font-weight: bold;
    /*color: $color-gary;*/
    color: $color-icon;
    font-size: 14px;
  }
  .icon-jianhao {
    color: $color-active-icon;
    font-size: 14px;
  }
  .icon-jianhao1 {
    color: $color-icon;
    font-size: 14px;
  }
}
.lottery-game-list {
  background-color: #F8F9FF;
  border-left: 1px solid #F0F1F6;
  > li {
    display: flex;
    align-items: center;
    padding: 0 20px;
    line-height: 40px;
  }
  .lottery-icon{
      >img{
          width: 1.8rem;
      }
  }
  .active {
    background: linear-gradient(to right, #FFEBC3, #FFF5E1);
  }
}
.lottery-type-list > li {
  border-bottom: solid 0.5px #F0F1F6;
  color: $color-black;
}
.lottery-name-wrappper {
  display: flex;
  justify-content: space-between;
  flex: 1;
}
</style>

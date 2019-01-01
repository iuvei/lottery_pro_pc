<template>
    <div>
        <div class="lotteryHall-wrapper" ref="wrapper">
            <div class="container">
                <Carousel class="carousel-box" autoplay :autoplay-speed=3500 loop dots="inside" :radius-dot="true">
                    <!--<CarouselItem class="carousel-item">
                        <img class="carousel-img" src="http://img4.imgtn.bdimg.com/it/u=419366524,3763594224&fm=26&gp=0.jpg" alt="">
                    </CarouselItem>-->
                    <CarouselItem class="carousel-item">
                        <img class="carousel-img" src="http://img3.3lian.com/2013/c3/62/d/48.jpg" alt="">
                    </CarouselItem>
                    <CarouselItem class="carousel-item">
                        <img class="carousel-img" src="http://pic40.photophoto.cn/20160701/1155116870045975_b.jpg" alt="">
                    </CarouselItem>
                    <CarouselItem class="carousel-item">
                        <img class="carousel-img" src="http://pic3.16pic.com/00/56/91/16pic_5691110_b.jpg" alt="">
                    </CarouselItem>
                </Carousel>
                <div class="content">
                    <div class="switch-tab-group">
                        <span class="switch-item" :class="gameSwitchId === 'all'? 'active' :''" @click="switchIdHandle('all')">全部彩种</span>
                        <span class="switch-item" v-for="item in gameList" :key="item.type" :class="gameSwitchId === item.type? 'active' :''" @click="switchIdHandle(item.type)">{{item.name}}</span>
                    </div>
                    <div class="tab-wrapper">
                        <!--根据当前彩种的 position 0-官方盘,1-信用盘,2-Both-->
                        <div v-if="false" class="game-type-switch">
                            <span class="switch-item guanfang-btn" :class="[gameTypeSwitchId === 0?'active':'',!creditList.length || !officialList.length ? 'bans':'']" @click="switchTypeHandle(0)">官方彩种</span>
                            <span class="switch-item xinyong-btn" :class="[gameTypeSwitchId === 1?'active':'',!creditList.length || !officialList.length ? 'bans':'']" @click="switchTypeHandle(1)">信用彩种</span>
                        </div>
                        <div class="tab-box" ref="tabBox">
                            <Carousel v-if="gameList.length" class="carouse" v-model="carouseIndex" :dots="dots" :radius-dot="true" :arrow="arrow">
                                <CarouselItem v-for="(item, index) in gameTypeList" :key="index">
                                    <div class="carousel-content">
                                        <div class="carousel-li" v-for="(li, index2) in item">
                                            <div class="li-top">
                                                <img :src="li.icon_3x" class="game-icon" />
                                                <div class="game-info">
                                                    <div class="game-title">{{li.name}}</div>
                                                    <div class="round-num">{{li.next_round}}期</div>
                                                    <div class="count-down">
                                                        <span class="hour num">{{formatTime(timeList[index2 + index * pageTotal])[0]}}</span>
                                                        <span class="dot">:</span>
                                                        <span class="minutes num">{{formatTime(timeList[index2 + index * pageTotal])[1]}}</span>
                                                        <span class="dot">:</span>
                                                        <span class="second num">{{formatTime(timeList[index2 + index * pageTotal])[2]}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="li-bottom">
                                                <div class="button-group">
                                                    <button type="button" @click="goHistory(li.game_code)">开奖历史</button>
                                                    <button type="button" @click="goTrend(li.game_code)">彩种走势</button>
                                                </div>
                                                <span @click="goToGame(li.icon_3x)">
                                                    <router-link :to="`/game/${li.game_code}?position=${gameTypeSwitchId}`"  class="play-btn">立刻投注</router-link>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footers></Footers>
    </div>
</template>

<script>
  import Footers from '../../../components/footers/footers'
  import {transformSecondsToTime2} from "../../../common/js/date";
  import { mapActions } from 'vuex'

  export default {
    name: "lotteryHall",
    data() {
      return {
        carouseIndex: 0,
        pageTotal: 12, //一页显示几个
        gameSwitchId: 'all',
        gameTypeSwitchId: 0,
        gameList: [],
        gameTypeList: [],
        officialList: [],
        creditList: [],
        timeList: [],
        arrow: 'never',
        dots: 'none',
        canClick: true,
        timer: null,
        carouselList: [{
          id: 1,
          src: 'http://pic28.photophoto.cn/20130818/0020033143720852_b.jpg'
        }, {
          id: 2,
          src: 'http://5b0988e595225.cdn.sohucs.com/images/20170906/58cdb24be3624488ad3e8d3d00b4585f.jpeg'
        }, {
          id: 3,
          src: 'http://img.zcool.cn/community/017c5d554909920000019ae9d202fe.jpg@1280w_1l_2o_100sh.jpg'
        }]
      }
    },
    mounted() {
      this._initPage()
    },
    destroyed() {
      this.clearTimer()
    },
    methods: {
      ...mapActions(['GET_GAME_LIST']),
      switchIdHandle(id) {
        if (this.gameSwitchId === id) {
          return
        }
        if (!this.canClick) {
          return
        }
        this.clearTimer()
        this.carouseIndex = 0
        this.$refs.tabBox.classList.remove('bounceInRight')
        this.gameSwitchId = id
        this.gameTypeSwitchId = 0
        this._getGameList()
      },
      switchTypeHandle(id) {
        if (!this.creditList.length || !this.officialList.length) {
          return
        }
        if (!this.canClick) {
          return
        }
        if (this.gameTypeSwitchId === id) {
          return
        }
        this.clearTimer()
        this.carouseIndex = 0
        this.gameTypeSwitchId = id
        this._getGameList()
      },
      formatTime(date) {
        return transformSecondsToTime2(date)
      },
      countDown() {
        let list = []
        let oldList = this.timeList
        oldList.forEach((item) => {
          if (item === 0) {
            console.log('ok')
          } else {
            item--
          }
          list.push(item)
        })
        this.timeList = list
        this.timer = setTimeout(() => {
          this.countDown()
        }, 1000)
      },
      clearTimer() {
        clearTimeout(this.timer)
        this.timer = null
      },
      _getGameList() {
        this.GET_GAME_LIST({type: 0}).then(res => {
          let type = this.gameSwitchId
          let gameTypeList = []
          let officialList = []
          let creditList = []
          if (type === 'all') {
            gameTypeList = res.data.all
          } else {
            gameTypeList = res.data.all.filter(item => {
              return item.type === type
            })
          }
          gameTypeList.forEach((item) => {
            if (item.position == '0' || item.position == '2') {
              officialList.push(item)
            }
            if (item.position == '1' || item.position == '2'){
              creditList.push(item)
            }
          })
          this.officialList = officialList
          this.creditList = creditList
          this._initGameList()
        })
      },
      _initGameList() {
        let result = []
        let officialList = this.officialList
        let creditList = this.creditList
        let filterList = this.gameTypeSwitchId === 0 ? officialList : creditList
        if (!officialList.length) {
          this.gameTypeSwitchId = 1
          filterList = creditList
        }
        if (!creditList.length) {
          this.gameTypeSwitchId = 0
          filterList = officialList
        }
        this.timeList = filterList.map((item) => {
          return item.countdown
        })
        this.countDown()
        for(let i = 0 ; i < filterList.length; i += this.pageTotal) {
          result.push(filterList.slice(i , i + this.pageTotal));
        }
        if (!officialList.length || !creditList.length) {
          this.gameTypeSwitchId = officialList.length ? 0 : 1
        }
        this.arrow = result.length >=2 ?'always' :'never'
        this.dots = result.length >=2 ?'outside' :'none'
        this.$refs.tabBox.classList.add('bounceInRight')
        this.gameTypeList = result
        this.canClick = false
        this.timer = setTimeout(() => {
          this.$refs.tabBox.classList.remove('bounceInRight')
          this.canClick = true
        }, 1000)
      },
      _initPage() {
        this.gameList = this.$store.state.game.gameInfo
        this._getGameList()
      },
      goToGame(url) {
        this.$store.commit("setCurrentGameInfo", {
          ...this.$store.state.game.currentGameInfo,
          icon_3x: url
        });
      },
      goHistory(itemStyle){
        this.$router.push('/notice/all/' + itemStyle)
      },
      goTrend(itemStyle){
        this.$router.push('/notice/all/' + itemStyle)
      }
    } ,
    components: {
      Footers
    }
  }
</script>

<style lang="scss">
    .lotteryHall-wrapper {
        margin-top: 20px;
        .carousel-box {
            width: 100%;
            margin-bottom: 20px;
            height: 220px;
            background-color: #333;
            .ivu-carousel-dots {
                bottom: 6px;
                li {
                    margin: 0 5px;
                    &.ivu-carousel-active {
                        .radius {
                            background-color: #ffffff;
                        }
                    }
                    .radius {
                        width: 8px;
                        height: 8px;
                        background-color: #426161;
                        opacity: 1;
                    }
                }
            }
            .carousel-item {
                width: 100%;
                height: 220px;
                .carousel-img {
                    width: 100%;
                    height: 220px;
                }
            }
        }
        .content {
            margin-bottom: 20px;
            .switch-tab-group {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
                width: 100%;
                height: 35px;
                margin: 10px 0 20px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                border: 1px solid $border-color-gary;
                border-bottom: 1px solid $theme-color;
                background-color: #f8f9fd;
                .switch-item {
                    display: inline-block;
                    /*width: 90px;*/
                    height: 33px;
                    line-height: 33px;
                    padding: 0 25px;
                    text-align: center;
                    font-size: $font-size-medium;
                    color: $color-black;
                    cursor: pointer;
                    &:first-child {
                        border-top-left-radius: 5px;
                    }
                    &.active, &:hover {
                        color: $color-white;
                        background-color: $theme-color;
                    }
                }
            }
            .tab-wrapper {
                .game-type-switch {
                    margin-bottom: 20px;
                    text-align: center;
                    .switch-item {
                        display: inline-block;
                        width: 88px;
                        height: 34px;
                        line-height: 34px;
                        border-radius: 5px;
                        box-sizing: border-box;
                        text-align: center;
                        font-size: $font-size-medium;
                        border: 1px solid $theme-color;
                        color: $theme-color;
                        background-color: $color-white;
                        vertical-align: middle;
                        cursor: pointer;
                        &.guanfang-btn {
                            border-top-right-radius: 0;
                            border-bottom-right-radius: 0;
                        }
                        &.xinyong-btn {
                            border-top-left-radius: 0;
                            border-bottom-left-radius: 0;
                        }
                        &.bans {
                            cursor: not-allowed;
                        }
                        &.active {
                            border: 1px solid transparent;
                            color: $color-white;
                            background-color: $theme-color;
                        }
                    }
                }
                .tab-box {
                    min-height: 300px;
                    &.bounceInRight {
                        animation: bounceInRight 1s
                    }
                    .carouse {
                        .ivu-carousel-arrow {
                            box-shadow: 0 1px 5px #ced1de;
                            background-color: #ffffff;
                            &.left {
                                left: -52px !important;
                            }
                            &.right {
                                right: -52px !important;
                            }
                            .ivu-icon {
                                font-size: 26px;
                                color: $theme-color;
                            }
                        }
                        .ivu-carousel-dots {
                            li {
                                margin: 0 7px;
                                .radius {
                                    width: 14px;
                                    height: 14px;
                                }
                            }
                        }
                        .carousel-content {
                            display: flex;
                            flex-flow: row wrap;
                            justify-content: flex-start;
                            align-items: flex-start;
                            width: 100%;
                            padding: 0 5px;
                            margin: 0 auto;
                            .carousel-li {
                                display: flex;
                                flex-flow: column nowrap;
                                justify-content: center;
                                width: 282px;
                                height: 194px;
                                padding: 0 18px;
                                margin: 0 13px 20px 0;
                                border: 1px solid $border-color-gary;
                                border-radius: 8px;
                                box-shadow: 0 1px 3px #ced1de;
                                background-color: #ffffff;
                                .li-top {
                                    display: flex;
                                    flex-flow: row wrap;
                                    justify-content: flex-start;
                                    align-items: center;
                                    margin-bottom: 12px;
                                    .game-icon {
                                        flex: 0 0 70px;
                                        width: 70px;
                                        height: 70px;
                                        margin-right: 35px;
                                    }
                                    .game-info {
                                        flex: 1;
                                        .game-title {
                                            width: 139px;
                                            line-height: 1.3;
                                            font-size: 22px;
                                            font-weight: bold;
                                            color: $color-black;
                                            overflow: hidden;
                                            text-overflow:ellipsis;
                                            white-space: nowrap;
                                        }
                                        .round-num {
                                            line-height: 1.3;
                                            font-size: $font-size-medium;
                                            color: $color-dark;
                                        }
                                        .count-down {
                                            .dot {
                                                display: inline-block;
                                                margin: 0 4px;
                                            }
                                            .num {
                                                display: inline-block;
                                                width: 28px;
                                                height: 20px;
                                                line-height: 20px;
                                                margin-top: 3px;
                                                border-radius: 5px;
                                                text-align: center;
                                                font-size: $font-size-medium;
                                                color: $color-white;
                                                background: #32343e;
                                            }
                                        }
                                    }
                                }
                                .li-bottom {
                                    width: 100%;
                                    .button-group {
                                        display: flex;
                                        flex-flow: row wrap;
                                        justify-content: space-between;
                                        align-items: center;
                                        width: 100%;
                                        margin-bottom: 8px;
                                        button {
                                            width: 116px;
                                            height: 32px;
                                            line-height: 32px;
                                            border: 1px solid $border-color-gary;
                                            border-radius: 3px;
                                            text-align: center;
                                            font-size: $font-size-medium;
                                            color: #8e919a;
                                            &:hover {
                                                color: $color-black;
                                            }
                                        }
                                    }
                                    .play-btn {
                                        display: inline-block;
                                        width: 100%;
                                        height: 38px;
                                        line-height: 38px;
                                        border: 1px solid $color-theme;
                                        border-radius: 3px;
                                        text-align: center;
                                        font-size: $font-size-large;
                                        color: $color-theme;
                                        background-color: #ffffff;
                                        transition: all .3s linear;
                                        &:hover {
                                            border: 1px solid transparent;
                                            color: #ffffff;
                                            background-color: $color-theme;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    @keyframes bounceInRight {
        0%,60%,75%,90%,to {
            animation-timing-function: cubic-bezier(.215,.61,.355,1)
        }

        0% {
            opacity: 0;
            transform: translate3d(3000px,0,0)
        }

        60% {
            opacity: 1;
            transform: translate3d(-25px,0,0)
        }

        75% {
            transform: translate3d(10px,0,0)
        }

        90% {
            transform: translate3d(-5px,0,0)
        }

        to {
            transform: none
        }
    }


</style>

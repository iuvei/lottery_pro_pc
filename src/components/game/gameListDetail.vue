<template>
    <div class="gameListDetail-wrapper">
        <div class="top-notice-box">
            <div class="notice">
                <span class="text">{{newData.name}}开奖公告</span>
                <span class="date">第<span class="num">{{newData && newData.round}}</span>期开奖号</span>
            </div>
            <div class="result-num">
                <ul class="peroid-number-list" :class="newData.type" v-if="newData">
                    <li v-for="number in newData.number.split(',')"
                        :class="[`peroid-number-item-${number}`, setBgColor(newData,number)]">
                        <div>
                            {{newData.type==='k3'?'':number}}
                        </div>
                    </li>
                </ul>
            </div>
            <router-link :to="`/game/${newData.game_code}`" tag="button" type="button" class="buy-btn">立刻投注</router-link>
        </div>
        <div class="filter-box">
            <div class="text">{{searchRoundNum?searchRoundNum:'历史'}} 开奖号码</div>
            <div class="filter">
                <DatePicker :editable="false" type="date" placeholder="请选择日期" @on-change="filterList" style="width: 180px"></DatePicker>
            </div>
        </div>
        <div class="gameLog-box">
            <div class="gameLog-left gameLog">
                <div class="gameLog-title">
                    <div class="text">期号</div>
                    <div class="btn-wrapper">
                        <div class="tab-btn-group" v-if="leftList.length">
                            <a v-for="item in resultList" class="tab-btn" href="javascript:;"
                               @click="leftSwitchTab(item.name)" :class="leftSwitchTabType === item.name?'selected':''"
                               :key="item.name">{{item.name}}</a>
                        </div>
                    </div>
                </div>
                <ul class="gameLog-list">
                    <li class="gameLog-item" v-for="item in leftList" :key="item.round" v-if="leftList.length">
                        <div class="round">{{item.round}}</div>
                        <div class="num">
                            <ul class="peroid-number-list" :class="newData.type" v-if="newData">
                                <li v-for="number in item.number.split(',')"
                                    :class="[`peroid-number-item-${number}`, setBgColor(newData,number)]">
                                    <div :class="number==='大'||number==='单'?'big-single':number==='小'||number==='双'?'small-double':''">
                                        {{newData.type==='k3'?'':number}}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="gameLog-item" v-if="!leftList.length">
                        <div class="noData">暂无数据</div>
                    </li>
                </ul>
            </div>
            <div class="gameLog-right gameLog">
                <div class="gameLog-title">
                    <div class="text">期号</div>
                    <div class="btn-wrapper">
                        <div class="tab-btn-group" v-if="rightList.length">
                            <a v-for="item in resultList" class="tab-btn" href="javascript:;"
                               @click="rightSwitchTab(item.name)"
                               :class="rightSwitchTabType === item.name?'selected':''"
                               :key="item.name">{{item.name}}</a>
                        </div>
                    </div>
                </div>
                <ul class="gameLog-list">
                    <li class="gameLog-item" v-for="item in rightList" :key="item.round" v-if="rightList.length">
                        <div class="round">{{item.round}}</div>
                        <div class="num">
                            <ul class="peroid-number-list" :class="newData.type" v-if="newData">
                                <li v-for="number in item.number.split(',')"
                                    :class="[`peroid-number-item-${number}`, setBgColor(newData,number)]">
                                    <div :class="number==='大'||number==='单'?'big-single':number==='小'||number==='双'?'small-double':''">
                                        {{newData.type==='k3'?'':number}}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="gameLog-item" v-if="!rightList.length">
                        <div class="noData">暂无数据</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="pagination">
            <Page :current="nowPage" :total="totalRows" :page-size="pageTotal" show-elevator style="font-size: 12px"
                  @on-change="setPageIndex" v-if="totalRows > 20"/>
        </div>
        <div>{{countDownNum}}</div>
    </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: "gameListDetail",
    data() {
      return {
        code: '',
        leftSwitchTabType: '',
        rightSwitchTabType: '',
        totalRows: 0,
        nowPage: 1,
        pageTotal: 20,
        resultList: [],
        leftList: [],
        rightList: [],
        newData: '',
        nowPeriodData: '',
        gameData: '',
        searchRoundNum: '',
        countDownNum: '',
        timer: ''
      }
    },
    created() {
      this._initPage()
    },
    destroyed() {
      clearTimeout(this.timer)
    },
    methods: {
      ...mapActions(['GET_GAME_RESULT', 'GET_GAME_LIST']),
      leftSwitchTab(type) {
        this.leftSwitchTabType = type
        this.getLeftList(type)
      },
      rightSwitchTab(type) {
        this.rightSwitchTabType = type
        this.getRightList(type)
      },
      getNewData() {
        let data = ''
        this.GET_GAME_LIST({type: 1}).then(res => {
          data = res.data.all.find(item => {
            return item.game_code == this.code
          })
          if (this.newData.round == data.round) {
            setTimeout(() => {
              this.getNewData()
            }, 2000)
          } else {
            this._getGameIndex()
          }
        })
      },
      countDown(date) {
        if (date === 0) {
          this.getNewData()
          console.log('ok')
        } else {
          date--
          this.newData.countdown = date
          this.timer = setTimeout(() => {
            this.countDown(date)
          }, 1000)
        }
      },
      setBgColor(item, number) {
        let bgClass = ''
        if (item.type === 'six') {
          if (
            [
              '1',
              '2',
              '7',
              '8',
              '12',
              '13',
              '18',
              '19',
              '23',
              '24',
              '29',
              '30',
              '34',
              '35',
              '40',
              '45',
              '46'
            ].includes(number)
          ) {
            bgClass = 'redNum'
          }
          if (
            [
              '3',
              '4',
              '9',
              '10',
              '14',
              '15',
              '20',
              '25',
              '26',
              '31',
              '36',
              '37',
              '41',
              '42',
              '47',
              '48'
            ].includes(number)
          ) {
            bgClass = 'blueNum'
          }
          if (
            [
              '5',
              '6',
              '11',
              '16',
              '17',
              '21',
              '22',
              '27',
              '28',
              '32',
              '33',
              '38',
              '39',
              '43',
              '44',
              '49'
            ].includes(number)
          ) {
            bgClass = 'greenNum'
          }
        }
        return bgClass
      },
      filterList(date) {
        this.searchRoundNum = date;
        this.linkToPage(1);
      },
      setPageIndex(index) {
        this.linkToPage(index);
      },
      linkToPage(index) {
        this.nowPage = index;
        this._getResultList(index);
      },
      getLeftList(type) {
        let list = this.resultList
        let leftList = {}
        if (type) {
          leftList = list.find(item => {
            return item.name === type
          })
          this.leftSwitchTabType = type
          this.leftList = leftList.list.slice(0, 10)
        } else {
          this.leftSwitchTabType = list[0].name
          this.leftList = list[0].list.slice(0, 10)
        }
      },
      getRightList(type) {
        let list = this.resultList
        let rightList = {}
        if (type) {
          rightList = list.find(item => {
            return item.name === type
          })
          this.rightSwitchTabType = type
          this.rightList = rightList.list.slice(10)
        } else {
          this.rightSwitchTabType = list[0].name
          this.rightList = list[0].list.slice(10)
        }
      },
      _getResultList() {
        this.GET_GAME_RESULT({
          game_code: this.code,
          type: 1,
          rows: this.pageTotal,
          page: this.nowPage,
          date: this.searchRoundNum
        }).then(res => {
          this.totalRows = res.data.total_rows
          if (res.data.includes.length) {
            this.resultList = res.data.includes
            this.getLeftList()
            this.getRightList()
          } else {
            this.resultList = []
            this.leftList = []
            this.rightList = []
          }
        })

      },
      _getGameIndex() {
        this.GET_GAME_LIST({type: 1}).then(res => {
          this.newData = res.data.all.find(item => {
            return item.game_code == this.code
          })
          this.countDown(this.newData.countdown)
          this.linkToPage(1)
        })
      },
      _getGameName() {
        let gameInfo = this.$store.state.game.gameInfo;
        let gameList = []
        gameInfo.map(item => {
          gameList.push(...item.includes.map(item1 => {
            return {
              name: item1.name,
              game_code: item1.game_code
            }
          }))
        });
        this.gameData = gameList.find(item => {
          return item.game_code === this.code
        })

      },
      _initPage() {
        this.code = this.$route.params.code
        this._getGameName()
        this._getGameIndex()
      }
    }
  }
</script>

<style scoped lang="scss">
    .gameListDetail-wrapper {
        .peroid-number-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin: 2px 0;
            li {
                width: 10%;
                color: white;
                text-align: center;
                line-height: 22px;
                font-size: 14px;
                margin: 2px 0px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Helvetica;
                div {
                    width: 34px;
                    height: 34px;
                    line-height: 34px;
                    border-radius: 50%;
                    background-color: #f10215;
                    font-size: $font-size-large;
                }
                .big-single {
                    background-color: rgb(249, 152, 46);
                }
                .small-double {
                    background-color: rgb(127, 138, 176);
                }
            }
        }
        .top-notice-box {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 20px;
            .notice {
                .text {
                    margin-right: 7px;
                    font-size: $font-size-medium-x;
                    color: $color-black;
                    vertical-align: middle;
                }
                .date {
                    font-size: $font-size-small;
                    color: $color-gary;
                    vertical-align: middle;
                    .num {
                        color: $color-theme;
                    }
                }
            }
            .result-num {
                flex: 0 0 780px;
                margin: 0 10px;
            }
            .buy-btn {
                width: 68px;
                height: 32px;
                line-height: 32px;
                border: 1px solid $color-theme;
                margin-right: 11px;
                box-sizing: border-box;
                font-size: $font-size-medium;
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
        .filter-box {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 7px;
            .text {
                font-size: $font-size-medium;
                color: $color-black;
            }
        }
        .gameLog-box {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: stretch;
            width: 100%;
            margin-bottom: 20px;
            border-top: 2px solid $color-theme;
            border-left: 1px solid $border-color-gary;
            border-right: 1px solid $border-color-gary;
            border-bottom: 1px solid $border-color-gary;
            .gameLog {
                flex: 1;
                &.gameLog-right {
                    border-left: 1px solid $border-color-gary;
                }
                .gameLog-title {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 35px;
                    background: linear-gradient(to bottom, #f7fcff, #f0f9ff);
                    .text {
                        flex: 0 0 130px;
                        margin-right: 20px;
                        text-align: center;
                        font-size: $font-size-medium;
                        color: $color-dark;
                    }
                    .btn-wrapper {
                        flex: 1;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;
                        .tab-btn-group {
                            display: inline-flex;
                            text-align: center;
                            border: 1px solid $color-theme;
                            border-radius: 5px;
                            .tab-btn {
                                width: 86px;
                                height: 26px;
                                line-height: 26px;
                                border-right: 1px solid $color-theme;
                                text-align: center;
                                font-size: $font-size-medium;
                                color: $color-theme;
                                background-color: #ffffff;
                                &:hover, &.selected {
                                    color: $color-white;
                                    background-color: $color-theme;
                                }
                                &:last-child {
                                    border-right: none;
                                    border-bottom-right-radius: 5px;
                                    border-top-right-radius: 5px;
                                }
                                &:first-child {
                                    border-top-left-radius: 5px;
                                    border-bottom-left-radius: 5px;
                                }
                            }
                        }
                    }
                }
                .gameLog-list {
                    .gameLog-item {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        align-items: center;
                        min-height: 40px;
                        padding: 5px;
                        border-bottom: 1px solid $border-color-gary;
                        &:last-child {
                            border-bottom: none;
                        }
                        .round {
                            flex: 0 0 130px;
                            margin-right: 20px;
                            padding: 0 12px;
                            text-align: center;
                            font-size: $font-size-medium;
                            color: $color-black;
                            word-break: break-all;
                        }
                        .num {
                            flex: 1;
                            text-align: center;
                        }
                    }
                }
                .noData {
                    width: 100%;
                    height: 100%;
                    padding: 10px;
                    text-align: center;
                    font-size: $font-size-medium-x;
                    font-weight: bold;
                    color: $color-dark;
                }
            }
        }
        .pagination {
            text-align: right;
        }
    }
</style>

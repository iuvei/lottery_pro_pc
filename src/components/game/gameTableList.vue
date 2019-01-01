<template>
    <div class="gameTableList-wrapper">
        <table class="table">
            <thead>
            <tr>
                <th>彩种</th>
                <th>期号</th>
                <th>开奖号码</th>
                <th>开奖倒计时</th>
                <th>详情</th>
                <th>走势</th>
                <th>购买彩票</th>
            </tr>
            </thead>
            <tbody>
            <router-link :to="`/notice/${type}/${item.game_code}`" tag="tr" v-for="(item, index) in list" :key="item.game_code">
                <td>{{item.name}}</td>
                <td>{{item.round}}</td>
                <td>
                    <ul class="peroid-number-list" :class="item.type">
                        <li v-for="number in item.number.split(',')"
                            :class="[`peroid-number-item-${number}`,setBgColor(item,number)]">
                            <div>
                                {{item.type==='k3'?'':number}}
                            </div>
                        </li>
                    </ul>
                </td>
                <td class="text-red font-bold">{{transformTime(timeList[index])}}</td>
                <td>
                    <router-link :to="`/notice/${type}/${item.game_code}`" tag="a" class="icon menu"></router-link>
                </td>
                <td>
                    <router-link to="" tag="a" class="icon line"></router-link>
                </td>
                <td>
                    <router-link :to="`/game/${item.game_code}`" tag="button" type="button" class="bettingBtn">投注</router-link>
                </td>
            </router-link>
            </tbody>
        </table>
    </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {transformSecondsToTime} from "../../common/js/date";

  export default {
    name: "gameTableList",
    data() {
      return {
        list: [],
        timeList: [],
        roundList: [],
        type: 'all',
        timer: null
      }
    },
    created() {
      this._initPage()
    },
    destroyed() {
      clearTimeout(this.timer)
    },
    methods: {
      ...mapActions(['GET_GAME_LIST']),
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
      test() {
        clearTimeout(this.timer)
      },
      transformTime(seconds) {
        return transformSecondsToTime(seconds || 0)
      },
      getNewData() {
        if (this.timeList.includes(0)) {
          console.log('ok')
          // this.GET_GAME_LIST({type: 1}).then(res => {
          //   let list = [], timeList = [], roundList = []
          //   if (this.type === 'all') {
          //     list = res.data.all
          //   } else {
          //     list= res.data.all.filter(item => {
          //       return item.type === type
          //     })
          //   }
          //   list.forEach((item) => {
          //     timeList.push(parseInt(item.countdown))
          //     roundList.push(item.round)
          //   })
          // })
        }
      },
      countDown() {
        let list = []
        let oldList = this.timeList
        oldList.forEach((item) => {
          if (item === 0) {
            this.getNewData()
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
      _getGameList() {
        this.GET_GAME_LIST({type: 1}).then(res => {
          if (this.type === 'all') {
            this.list = res.data.all
          } else {
            this.list = res.data.all.filter(item => {
              return item.type === this.type
            })
          }
          this.list.forEach((item) => {
            this.timeList.push(parseInt(item.countdown))
            this.roundList.push(item.round)
          })
          this.countDown()
        })
      },
      _initPage() {
        this.type = this.$route.params.type ? this.$route.params.type : 'all';
        this._getGameList()
      }
    }
  }
</script>

<style scoped lang="scss">
    .table {
        width: 100%;
        thead tr {
            background: linear-gradient(to bottom, #f7fcff, #f0f9ff);
        }
        tbody {
            tr {
                &:nth-child(even) {
                    background: linear-gradient(to bottom, #f7fcff, #f0f9ff);
                }
                &:hover {
                    background: #afa2a229;
                    cursor: pointer;
                }
            }
        }
        tr {
            th {
                padding: 10px 5px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-black;
            }
            td {
                padding: 10px 5px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-black;
                vertical-align: middle;
                &.text-red {
                    color: $color-theme;
                }
                &.font-bold {
                    font-weight: bold;
                }
                &:nth-child(3) {
                    width: 550px;
                }
                .bettingBtn {
                    width: 58px;
                    height: 34px;
                    border: 1px solid $color-theme;
                    font-weight: bold;
                    color: $color-theme;
                    transition: all .3s linear;
                    &:hover {
                        border: 1px solid transparent;
                        color: $color-white;
                        background-color: $color-theme;
                    }
                }
                .icon {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    &.menu {
                        background: url("/static/images/menu-icon.png") no-repeat center;
                        background-size: contain;
                    }
                    &.line {
                        background: url("/static/images/line-icon.png") no-repeat center;
                        background-size: contain;
                    }
                }
                .peroid-number-list {
                    display: flex;
                    flex-wrap: wrap;
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
                    }
                }
            }
        }
    }
</style>

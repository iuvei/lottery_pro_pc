<template>
    <div>
        <!-- 投注记录和开奖记录 -->
        <div class="history-head">
            <div class="tab-box">
                <div
                        :class="{'active':activeTab===0}"
                        @click="toggleTab(0)"
                >
                    投注记录
                </div>
                <div
                        @click="toggleTab(1)"
                        :class="{'active':activeTab===1}"
                >
                    开奖记录
                </div>
            </div>

            <div v-show="pageData.total" class="pagination">
                <Page :total="pageData.total" @on-change="changePage()"/>
            </div>
        </div>
        <div class="history-body">
            <!--历史记录/开奖记录 真实数据采用同一个接口-->
            <Table v-show="activeTab===0" height="200" :loading="loading" :columns="betColumns" :data="getBetData"></Table>
            <Table v-show="activeTab===1" height="200" :loading="loading" :columns="resColumns" :data="resData"></Table>
        </div>
    </div>
</template>

<script>
  import {mapActions} from 'vuex';
  export default {
    data() {
      return {
        activeTab: 0,
        loading: false,
        pageData: {
          current:1,
          total:0,
          pageSize:10
        },
        betColumns: [
          {
            title: '彩种名称',
            key: 'game_name'
          },
          {
            title: '期号',
            key: 'round'
          },
          {
            title: '玩法',
            key: 'full_name'
          },
          {
            title: '下注内容',
            key: 'content'
          },
          {
            title: '单注额',
            key: 'amount'
          },
          {
            title: '总额',
            key: 'amount_total'
          },
          {
            title: '下注时间',
            key: 'create_time'
          }
        ],
        resColumns: [
          {
            title: '彩种名称',
            key: 'game_name'
          },
          {
            title: '期号',
            key: 'round'
          },
          {
            title: '玩法',
            key: 'full_name'
          },
          {
            title: '单注额',
            key: 'amount'
          },
          {
            title: '总额',
            key: 'amount_total'
          },
          {
            title: '投注号码',
            key: 'content'
          },
          {
            title: '下注时间',
            key: 'create_time'
          },
          {
            title: '中奖注数',
            key: 'winning_num'
          }
        ],
        resData: [],
      }
    },
    created() {
      this.getRecordData(this.pageData)
    },
      computed: {
          getBetData() {
              return this.$store.state.game.betHistoryData;
          }
      },
    methods: {
      ...mapActions(['GET_BET_HISTORY', 'GET_GAME_RESULT']),
      toggleTab(index) {
        this.activeTab = index
        index==0 ? this.getRecordData(this.pageData) : this.getResultData(this.pageData);
      },
        changePage(){
          this.getRecordData();
        },
      /***
       * 下注记录
       * @param pageData
       */
      getRecordData(pageData) {
        this.loading = true
        this.GET_BET_HISTORY({
          game_code: this.$store.state.game.currentGameInfo.game_code,
          rows: pageData.pageSize || "10",
          page: pageData.current || "1"
        }).then(res => {
          console.log(res)
          this.loading = false
          this.pageData.total = res.data.total_rows
          this.pageData.current = res.data.page
          this.$store.commit("setBetHistoryData",res.data.bills)
        })
          .catch(err => {
            //this.verifyCodeShouldReload = true
          })
      },
      /****
       * 开奖结果
       * @param pageData
       */
      getResultData(pageData) {
        this.loading = true

          this.pageData.total = 0
          this.GET_BET_HISTORY({
              game_code: this.$store.state.game.currentGameInfo.game_code,
              rows: "10",
              page: "1",
              type: "5"  //已结注单还未提供接口
          }).then(res => {
              this.loading = false
              this.resData = res.data.bills
          })
              .catch(err => {
                    this.loading = false
                  //this.verifyCodeShouldReload = true
              })

      }
    }
  }
</script>

<style lang="scss" scoped>
    .history-head {
        height: 37px;
        line-height: 37px;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        > .tab-box {
            display: flex;
            width: 185px;
            cursor: pointer;
            > div {
                flex: 1;
                text-align: center;
            }
            > .active {
                color: red;
                position: relative;
                border-bottom: 2px solid;
                &:after {
                    content: '';
                    display: block;
                    position: absolute;
                    width: 50px;
                    height: 2px;
                    background-color: red;
                    left: 50%;
                    margin-left: -25px;
                    border-radius: 2px;
                }
            }
        }
    }
</style>

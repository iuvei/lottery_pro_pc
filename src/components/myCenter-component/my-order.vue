<template>
    <div class="my-order-wrapper">
        <div class="switch-tab">
            <a href="javascript:;" class="switch-btn" :class="switchId === 0?'selected':''"
               @click="switchTab(0)">全部注单</a>
            <a href="javascript:;" class="switch-btn" :class="switchId === 1?'selected':''"
               @click="switchTab(1)">未结算</a>
            <a href="javascript:;" class="switch-btn" :class="switchId === 2?'selected':''"
               @click="switchTab(2)">已中奖</a>
            <a href="javascript:;" class="switch-btn" :class="switchId === 3?'selected':''"
               @click="switchTab(3)">未中奖</a>
        </div>
        <div class="content">
            <div class="search-module">
                <div class="select-group">
                    <Select class="select-item" v-model="gameCode" placeholder="全部彩种">
                        <Option v-for="item in gameNameList" :value="item.code" :key="item.code">{{ item.name }}
                        </Option>
                    </Select>
                    <Select class="select-item" v-model="gameType" placeholder="全部投注">
                        <Option value="0">全部</Option>
                        <Option value="1">未结算</Option>
                        <Option value="2">已中奖</Option>
                        <Option value="3">未中奖</Option>
                        <Option value="4">已注销</Option>
                    </Select>
                    <DatePicker v-model="dateValue" :editable="false" type="daterange" placement="bottom-end" placeholder="请选择日期"
                                style="width: 200px" @on-change="getDate"></DatePicker>
                </div>
                <button type="button" class="search-btn" @click="filterHandle">搜索</button>
            </div>
            <table class="order-table">
                <thead>
                <tr>
                    <th>彩种</th>
                    <th>期数</th>
                    <th>下注玩法</th>
                    <th>投注内容</th>
                    <th>下注总额</th>
                    <th>赢/负</th>
                    <th>注单状态</th>
                    <th>详情</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in orderList" :key="item.id" v-if="orderList">
                    <td>{{item.game_name}}</td>
                    <td>{{item.round}}</td>
                    <td>{{item.game_full_name}}</td>
                    <td>{{item.content}}</td>
                    <td>{{item.total_amount}}</td>
                    <td :class="item.win_amount > 0 ? 'color-red':''">{{item.win_amount}}</td>
                    <td class="game-status" :class="item.statusCode === 1? 'color-red':'' ">{{item.statusText}}</td>
                    <td><a href="javascript:;" @click="showDetail(item)">查看</a></td>
                </tr>
                </tbody>
                <tr class="no-data" v-if="!orderList">
                    <td colspan="8">暂无数据</td>
                </tr>
            </table>
            <div class="pagination">
                <Page :current="nowPage" :total="totalRows" :page-size="pageSize" show-elevator style="font-size: 12px"
                      @on-change="setPageIndex"/>
            </div>
        </div>
        <order-detail-modal :mask='false'
                            :displayModal='detailDisplayModal'
                            :orderDetailList='orderDetail'
                            @closeModal="detailCloseModal">
        </order-detail-modal>
    </div>
</template>

<script>
  import OrderDetailModal from '../../common/base/detailModal/orderDetailModal'
  import {initOrderItem, initOrderDetail} from "../../common/js/initData/initList";
  import {mapActions} from 'vuex';

  const ORDER_LIST_LENGTH = 10

  export default {
    name: "my-order",
    data() {
      return {
        switchId: 0,
        gameCode: '',
        dateValue: '',
        gameNameList: [],
        gameType: '0',
        detailDisplayModal: false,
        orderDetail: [],
        orderList: '',
        totalRows: 0,
        nowPage: 1,
        pageSize: 10,
        start_time: '',
        end_time: ''
      }
    },
    created() {
      this._initPage();
    },
    methods: {
      ...mapActions(['GET_BET_HISTORY']),
      switchTab(type) {
        if (this.switchId === type) {
          return
        }
        this.switchId = type;
        this.gameCode = ''
        this.dateValue = ''
        this.gameType = '0'
        this.linkToPage(1);
      },
      getOrderList(pageIndex = 1, filter = '') {
        this.GET_BET_HISTORY({
          type: filter ? filter.type : this.switchId,
          rows: ORDER_LIST_LENGTH,
          page: pageIndex,
          date_start: filter ? filter.start_time : '',
          date_end: filter ? filter.end_time : '',
          game_code: filter ? filter.game_code : ''
        }).then(res => {
          if (res.data) {
            let orderList = res.data.bills;
            let initList = orderList.map(item => {
              return initOrderItem(item)
            });
            this.totalRows = parseInt(res.data.total_rows);
            this.orderList = initList;
          } else {
            this.orderList = '';
            this.totalRows = 0;
          }
        })
      },
      getDate(date) {
        this.start_time = date[0];
        this.end_time = date[1]
      },
      setPageIndex(index) {
        let data = {
          start_time: this.start_time,
          end_time: this.end_time,
          type: this.gameType,
          game_code: this.gameCode
        };
        this.linkToPage(index, data);
      },
      detailCloseModal() {
        this.detailDisplayModal = false
      },
      filterHandle() {
        let data = {
          start_time: this.start_time,
          end_time: this.end_time,
          type: this.gameType,
          game_code: this.gameCode
        };
        this.linkToPage(1, data);
      },
      showDetail(data) {
        this.orderDetail = initOrderDetail(data);
        this.detailDisplayModal = true
      },
      linkToPage(index, filter) {
        this.nowPage = index;
        this.getOrderList(index, filter);
      },
      _initPage() {
        if (!this.$store.getters.token) {
          return
        }
        this.$store.state.game.gameInfo.map(item => {
          this.gameNameList.push(...item.includes.map(item1 => {
            return {
              code: item1.game_code,
              name: item1.name
            }
          }))
        });
        this.linkToPage(1);
      }
    },
    components: {
      OrderDetailModal
    }
  }
</script>

<style scoped lang="scss">
    .my-order-wrapper {
        width: 100%;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        padding-bottom: 20px;
        box-sizing: border-box;
        .switch-tab {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            height: 59px;
            padding: 0 28px;
            margin-bottom: 10px;
            border-bottom: 1px solid $border-color-gary;
            .switch-btn {
                height: 59px;
                line-height: 59px;
                margin-right: 58px;
                border-bottom: 1px solid transparent;
                font-size: $font-size-medium-x;
                font-weight: bold;
                color: $color-black;
                &.selected {
                    border-bottom: 2px solid $color-theme;
                    color: $color-theme;
                }
            }
        }
        .content {
            padding: 0 28px;
            .search-module {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                .select-group {
                    .select-item {
                        width: 148px;
                        margin-right: 20px;
                        font-size: $font-size-medium;
                    }
                }
                .search-btn {
                    width: 88px;
                    height: 32px;
                    margin-bottom: 4px;
                    @include button-normal-base();
                }
            }
            .order-table {
                width: 100%;
                margin-bottom: 15px;
                text-align: center;
                .no-data {
                    width: 100%;
                    height: 300px;
                    border-bottom: none;
                    td {
                        text-align: center;
                        font-size: $font-size-medium;
                        color: $color-gary;
                    }
                }
                thead tr {
                    border-bottom: 1px solid $border-color-gary;
                }
                tbody tr:last-child {
                    border-bottom: none;
                }
                tr {
                    height: 44px;
                    line-height: 44px;
                    border-bottom: 1px dashed $border-color-gary;
                    th {
                        font-size: $font-size-medium;
                        color: $color-dark;
                    }
                    td {
                        font-size: $font-size-medium;
                        color: $color-black;
                        &:nth-child(4), &:nth-child(6) {
                            color: $color-dark;
                        }
                        &.color-red {
                            color: $color-theme;
                        }
                        a {
                            color: #3a8ff0;
                        }
                    }
                }
            }
            .pagination {
                text-align: right;
            }
        }
    }
</style>

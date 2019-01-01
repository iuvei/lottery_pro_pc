<template>
    <div class="moneyLog-wrapper">
        <div class="table-group-wrapper">
            <div class="switch-tab">
                <a href="javascript:;" class="switch-btn" :class="switchId === '0'?'selected':''"
                   @click="switchTab('0')">全部记录</a>
                <a href="javascript:;" class="switch-btn" :class="switchId === '2'?'selected':''"
                   @click="switchTab('2')">充值记录</a>
                <a href="javascript:;" class="switch-btn" :class="switchId === '3'?'selected':''"
                   @click="switchTab('3')">提现记录</a>
                <a href="javascript:;" class="switch-btn" :class="switchId === '1'?'selected':''"
                   @click="switchTab('1')">转账记录</a>
            </div>
            <div class="content">
                <div class="search-module">
                    <div class="select-group">
                        <Select class="select-item" v-model="type" placeholder="请选择资金类型">
                            <Option value="0">全部</Option>
                            <Option value="1">转账</Option>
                            <Option value="2">充值</Option>
                            <Option value="3">提现</Option>
                            <Option value="4">消费</Option>
                            <Option value="5">收益</Option>
                            <Option value="6">冻结</Option>
                            <Option value="7">其他</Option>
                        </Select>
                        <DatePicker v-model="dateValue" type="daterange" placement="bottom-end" placeholder="请选择日期" @on-change="getDate"
                                    style="width: 235px"></DatePicker>
                    </div>
                    <button type="button" class="search-btn" @click="filterHandle">搜索</button>
                </div>
                <table class="order-table">
                    <thead>
                    <tr>
                        <th>日期</th>
                        <th>收支单号</th>
                        <th>交易金额</th>
                        <th>交易类型</th>
                        <th>交易状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody v-show="orderList">
                    <tr v-for="item in orderList">
                        <th>{{item.create_time}}</th>
                        <th>{{item.order_num || '*'}}</th>
                        <th>{{item.amount}}</th>
                        <th>{{item.type}}</th>
                        <td class="color-red">{{item.status}}</td>
                        <td>文案</td>
                    </tr>
                    </tbody>
                    <tr v-show="!orderList" class="no-data">
                        <td colspan="6">暂无数据</td>
                    </tr>
                </table>
                <div class="pagination">
                    <Page :current="nowPage" :total="totalRows" :page-size="pageSize" show-elevator @on-change="setPageIndex"
                          style="font-size: 12px"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import {getLatelyMonth} from "../../common/js/date";

  const MONEY_LIST_LENGTH = 10;

  export default {
    name: "moneyLog",
    data() {
      return {
        switchId: '0',
        type: '0',
        dateValue: '',
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
      ...mapActions(['GET_MONEY_HISTORY']),
      switchTab(type) {
        if (this.switchId === type) {
          return
        }
        this.switchId = type;
        this.type = ''
        this.dateValue = ''
        this.linkToPage(1)
      },
      getOrderList(pageIndex = 1, filter = '') {
        this.GET_MONEY_HISTORY({
          type: filter ? filter.type : this.switchId,
          rows: MONEY_LIST_LENGTH,
          page: pageIndex,
          mode: 1,
          date_start: filter ? filter.start_time : getLatelyMonth()[0],
          date_end: filter ? filter.end_time : getLatelyMonth()[1],
        }).then(res => {
          if (res.data.list.length) {
            let orderList = res.data.list;
            this.totalRows = parseInt(res.data.total_rows);
            this.orderList = orderList;
          } else {
            this.orderList = '';
          }
        })
      },
      getDate(date) {
        this.start_time = date[0];
        this.end_time = date[1]
      },
      setPageIndex(index) {
        let data = {
          start_time: this.start_time ? this.start_time : getLatelyMonth()[0],
          end_time: this.end_time ? this.end_time : getLatelyMonth()[1],
          type: this.type
        };
        this.linkToPage(index, data);
      },
      linkToPage(index, filter) {
        this.nowPage = index;
        this.getOrderList(index, filter);
      },
      filterHandle() {
        let data = {
          start_time: this.start_time ? this.start_time : getLatelyMonth()[0],
          end_time: this.end_time ? this.end_time : getLatelyMonth()[1],
          type: this.type
        };
        this.linkToPage(1, data);
      },
      _initPage() {
        if (!this.$store.getters.token) {
          return
        }
        this.linkToPage(1);
      }
    }
  }
</script>

<style scoped lang="scss">
    .moneyLog-wrapper {
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
                position: relative;
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

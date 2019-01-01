<template>
    <div class="wagesList-wrapper">
        <div class="content" v-if="switchId === 0">
            <div class="search-module">
                <div class="select-group">
                    <div class="switch-tab-box">
                        <span class="switch-tab-item log-btn" :class="switchId === 0?'active':''" @click="switchTypeHandle(0)">领取记录</span>
                        <span class="switch-tab-item agreement-btn" :class="switchId === 1?'active':''" @click="switchTypeHandle(1)">日工资契约</span>
                    </div>
                    <DatePicker type="daterange" placement="bottom-end" placeholder="请选择日期" @on-change="getDate"
                                style="width: 235px"></DatePicker>
                </div>
                <button type="button" class="search-btn" @click="filterHandle">搜索</button>
            </div>
            <table class="order-table">
                <thead>
                <tr>
                    <th>发放时间</th>
                    <th>有效人数</th>
                    <th>有效投注</th>
                    <th>领取金额</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="item in logList.length" v-if="logList.length">
                        <th>{{formatTime(item.create_time)}}</th>
                        <th>{{item.valid_member}}</th>
                        <th>{{item.valid_money}}</th>
                        <th>{{item.amount}}</th>
                    </tr>
                    <tr v-if="!logList.length" class="no-data">
                        <td colspan="4">暂无数据</td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <Page :current="nowPage" :total="totalRows" :page-size="pageSize" show-elevator @on-change="setPageIndex"
                      style="font-size: 12px"/>
            </div>
        </div>
        <div class="content" v-if="switchId === 1">
            <div class="search-module">
                <div class="select-group">
                    <div class="switch-tab-box">
                        <span class="switch-tab-item log-btn" :class="switchId === 0?'active':''" @click="switchTypeHandle(0)">领取记录</span>
                        <span class="switch-tab-item agreement-btn" :class="switchId === 1?'active':''" @click="switchTypeHandle(1)">日工资契约</span>
                    </div>
                </div>
            </div>
            <table class="order-table">
                <thead>
                <tr>
                    <th>日工资比例</th>
                    <th>有效人数</th>
                    <th>有效投注</th>
                    <th>当前状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="item in contractsList" v-show="contractsList.length">
                        <th>{{item.rebate}}%</th>
                        <th>{{item.valid_member}}</th>
                        <th>{{item.valid_money}}</th>
                        <td>{{item.statusTxt}}</td>
                        <td>
                            <div class="btn-group" v-if="item.isOperate">
                                <button class="confirm-btn" type="button" @click="setContractStatusHandle(1, item.id)">接受</button>
                                <button class="reject-btn" type="button" @click="setContractStatusHandle(0, item.id)">拒绝</button>
                            </div>
                        </td>
                    </tr>
                    <tr v-show="!contractsList.length" class="no-data">
                        <td colspan="5">暂无数据</td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <Page :current="contractsNowPage" :total="contractsTotalRows" :page-size="pageSize" show-elevator @on-change="setPageIndex"
                      style="font-size: 12px"/>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import { initSelfContractsItem } from "../../../common/js/initData/initContracts";
  import { getYYYY_MM_HH } from "../../../common/js/date";

  export default {
    name: "wagesList",
    data() {
      return {
        switchId: 0,
        type: '0',
        logList: [],
        contractsList: [],
        totalRows: 0,
        nowPage: 1,
        contractsTotalRows: 0,
        contractsNowPage: 1,
        pageSize: 10,
        start_time: '',
        end_time: ''
      }
    },
    created() {
      this._initPage();
    },
    methods: {
      ...mapActions(['GET_WAGE_OR_BONUS', 'GET_CONTRACTS', 'SET_CONTRACTS_STATUS']),
      switchTypeHandle(type) {
        if (this.switchId === type) {
          return
        }
        this.switchId = type;
        this.linkToPage(1);
      },
      formatTime(date) {
        return getYYYY_MM_HH(date)
      },
      setContractStatusHandle(status, id) {
        this.SET_CONTRACTS_STATUS({
          id: id,
          status: status,
          type: 0
        }).then(res => {
          setTimeout(() => {
            this.linkToPage(1)
          }, 1000)
        })
      },
      getContractsList() {
        this.GET_CONTRACTS({
          type: 0,
          rows: this.pageSize,
          page: this.contractsNowPage
        }).then(res => {
          this.contractsList = initSelfContractsItem(res.data.contracts)
          this.contractsTotalRows = res.data.total_rows
        })
      },
      getOrderList(filter = '') {
        this.GET_WAGE_OR_BONUS({
          type: 0,
          rows: this.pageSize,
          page: this.nowPage,
          date_start: filter ? filter.start_time: '',
          date_end: filter ? filter.end_time: ''
        }).then(res => {
          this.totalRows = res.data.total_rows
          this.logList = res.data.wages
        })
      },
      getDate(date) {
        this.start_time = date[0];
        this.end_time = date[1]
      },
      setPageIndex(index) {
        let data = {
          start_time: this.start_time ? this.start_time : '',
          end_time: this.end_time ? this.end_time : ''
        };
        this.linkToPage(index, data);
      },
      linkToPage(index, filter) {
        if (this.switchId === 0) {
          this.nowPage = index;
          this.getOrderList(index, filter);
        } else {
          this.contractsNowPage = index;
          this.getContractsList(index);
        }
      },
      filterHandle() {
        let data = {
          start_time: this.start_time ? this.start_time : '',
          end_time: this.end_time ? this.end_time :''
        };
        this.linkToPage(1, data);
      },
      _initPage() {
        this.linkToPage(1);
      }
    }
  }
</script>

<style scoped lang="scss">
    .wagesList-wrapper {
        padding: 20px 28px;
        min-height: 500px;
        .content {
            .search-module {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                height: 36px;
                margin-bottom: 20px;
                .select-group {
                    .switch-tab-box {
                        display: inline-block;
                        margin-right: 10px;
                        text-align: center;
                        .switch-tab-item {
                            display: inline-block;
                            width: 88px;
                            height: 32px;
                            line-height: 32px;
                            border-radius: 5px;
                            box-sizing: border-box;
                            text-align: center;
                            font-size: $font-size-medium;
                            border: 1px solid $theme-color;
                            color: $theme-color;
                            background-color: $color-white;
                            vertical-align: middle;
                            cursor: pointer;
                            transition: all .3s linear;
                            &.log-btn {
                                border-top-right-radius: 0;
                                border-bottom-right-radius: 0;
                            }
                            &.agreement-btn {
                                border-left: none;
                                border-top-left-radius: 0;
                                border-bottom-left-radius: 0;
                            }
                            &.active, &:hover {
                                border: 1px solid transparent;
                                color: $color-white;
                                background-color: $theme-color;
                            }
                        }
                    }
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
                margin-bottom: 55px;
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
                tr th,  tr td { border:1px solid $border-color-gary; }
                td, th {
                    &:last-child {
                        width: 170px;
                    }
                }
                thead {
                    tr {
                        height: 37px;
                        line-height: 37px;
                        background-color: #fafbff;
                        th {
                            font-size: $font-size-medium-x;
                            color: $color-dark;
                        }
                    }
                }
                tbody {
                    tr {
                        height: 44px;
                        line-height: 44px;
                        &:last-child {
                            border-bottom: none;
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
                            .btn-group {
                                display: flex;
                                flex-flow: row nowrap;
                                justify-content: center;
                                align-items: center;
                                width: 134px;
                                margin: 0 auto;
                                button {
                                    width: 63px;
                                    height: 28px;
                                    line-height: 28px;
                                    border-radius: 20px;
                                    text-align: center;
                                    font-size: 14px;
                                    transition: all .3s linear;
                                    &.confirm-btn {
                                        margin-right: 10px;
                                        border: 1px solid transparent;
                                        background-color: $color-theme;
                                        color: #ffffff;
                                    }
                                    &.reject-btn {
                                        border: 1px solid $color-theme;
                                        background-color: #ffffff;
                                        color: $color-theme;
                                    }
                                    &:hover {
                                        border: 1px solid transparent;
                                        background-color: $color-theme;
                                        color: #ffffff;
                                    }
                                }
                            }
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

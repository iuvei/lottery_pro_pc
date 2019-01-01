<template>
    <div class="teamReport-wrapper">
        <div class="pay-tab">
            <span class="item online" @click="switchTab(0)" :class="switchTxt === 0? 'active' :''">团队报表</span>
            <span class="item outline" @click="switchTab(1)" :class="switchTxt === 1? 'active' :''">团队转账</span>
        </div>
        <div v-show="switchTxt === 0" class="tab-1 tab-item">
            <div class="search-module">
                <div class="select-group">
                    <Select v-model="listType" style="width:150px;margin-right: 10px" @on-change="handleListChange">
                        <Option value="0">用户名</Option>
                        <Option value="1">日期</Option>
                        <Option value="2">彩种</Option>
                    </Select>
                    <Input v-model="searchUsername" placeholder="请输入用户名" style="width: 150px;margin-right: 10px"/>
                    <Select class="select-item" v-model="game_code" placeholder="全部彩种">
                        <Option v-for="item in gameTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                    <DatePicker v-model="dateValue" type="daterange" placement="bottom-end" placeholder="请选择日期" @on-change="getDate"
                                style="width: 170px"></DatePicker>
                </div>
                <button type="button" class="search-btn" @click="filterHandle">搜索</button>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th>
                        {{listType === '0'? '用户名':''}}
                        {{listType === '1'? '日期':''}}
                        {{listType === '2'? '彩种名称':''}}
                    </th>
                    <th>总额</th>
                    <th>有效投注</th>
                    <th>盈利</th>
                    <th>奖金</th>
                    <th>返点</th>
                    <th>返点差总额</th>
                    <th>注单人数</th>
                    <th>人数</th>
                    <th>总盈亏额</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-show="list.length" v-for="item in list">
                        <td>
                            <div v-if="listType === '0'"><span class="icon" :class="item.is_agent == '1'?'icon-agent':'icon-vip'"></span>{{item.username || '*'}}</div>
                            <div v-if="listType === '1'">{{item.formatTime}}</div>
                            <div v-if="listType === '2'">{{item.game_name}}</div>
                        </td>
                        <td>{{item.children_amount_total.toString() ||'0.000'}}</td>
                        <td>{{item.children_valid_total.toString() ||'0.000'}}</td>
                        <td>{{item.children_win_amount.toString() ||'0.000'}}</td>
                        <td>{{item.children_winning_amount.toString() ||'0.000'}}</td>
                        <td>{{item.children_rebate_amount.toString() ||'0'}}%</td>
                        <td>{{item.children_rebates.toString() ||'0.000'}}</td>
                        <td>{{item.children_bill_rows.toString() ||'0'}}</td>
                        <td>{{item.user_rows.toString() ||'0'}}</td>
                        <td class="text-red" :class="listType === '0'?'pointer':''" @click="showDetailHandle(item)">{{item.team_profit ||'0.000'}}</td>
                    </tr>
                    <tr v-show="!list.length" class="no-data">
                        <td colspan="10">暂无数据</td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <Page :current="nowPage" :total="totalRows" :page-size="pageTotal" show-elevator style="font-size: 12px"
                      @on-change="setPageIndex"/>
            </div>
        </div>
        <div v-show="switchTxt === 1" class="tab-2 tab-item">
            <div class="form-group">
                <div class="item">
                    <div class="text">可用余额:</div>
                    <div class="value">{{availTransferMoney}}</div>
                </div>
                <div class="item">
                    <div class="text">用户名:</div>
                    <Select v-model="username" filterable style="width: 255px">
                        <Option v-for="item in userList" :value="item.username" :key="item.id">{{ item.username }}</Option>
                    </Select>
                </div>
                <div class="item">
                    <div class="text">转账金额:</div>
                    <InputNumber v-model="transferMoney" placeholder="输入金额" :max="9999999" :min="0" style="width: 255px"/>
                </div>
                <div class="item">
                    <div class="text">转账说明:</div>
                    <Input disabled placeholder="为下级转账" style="width: 255px"/>
                </div>
                <div class="item">
                    <div class="text">提现密码:</div>
                    <InputNumberList @change="handlePwdChange" :numberLen="6"/>
                </div>
            </div>
            <div class="btn-group">
                <button type="button" @click="withdrawHandle">立即转账</button>
            </div>
        </div>
        <detail-modal :mask="false" :displayModal="displayModal" :info="detailInfo" @closeModal="closeModal"></detail-modal>
    </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import detailModal from '../../../common/base/teamReportDetailModal/teamReportDetailModal'
  import { initTeamItem, initTeamDetail } from "../../../common/js/initData/initTeamList";
  import InputNumberList from '../../../common/base/inputNumberList/InputNumberList'

  export default {
    name: "teamReport",
    data() {
      return {
        switchTxt: 0,
        searchUsername: '',
        start_date: '',
        end_date: '',
        totalRows: 0,
        nowPage: 1,
        pageTotal: 10,
        selfInfo: '',
        list: [],
        listType: '0',
        gameType: '',
        gameTypeList: [],
        game_code: '',
        displayModal: false,
        detailInfo: '',
        dateValue: '',
        // 转账
        availTransferMoney: '',
        transferMoney: 0,
        transferDisabled: true,
        pwdList: [],
        username: '',
        userList: []
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['GET_TEAM_REPORT', 'TRANSFER_MONEY_TO_SUB_AGENT', 'GET_SUB_AGENT_LIST']),
      switchTab(type) {
        if (this.switchTxt === type) {
          return
        }
        this.switchTxt = type
      },
      getDate(date) {
        this.start_date = date[0]
        this.end_date = date[1]
      },
      closeModal() {
        this.displayModal = false
      },
      showDetailHandle(item) {
        if (this.listType !== '0') {
          return
        }
        this.detailInfo = initTeamDetail(item)
        this.displayModal = true
      },
      handleListChange() {
        this.cleatFilter()
        this.linkToPage(1)
      },
      cleatFilter() {
        this.gameType = ''
        this.searchUsername = ''
        this.dateValue = ''
        this.game_code = ''
        this.start_date = ''
        this.end_date = ''

      },
      filterHandle() {
        let data = {
          username: this.searchUsername,
          game_code: this.game_code,
          date_start: this.start_date,
          date_end: this.end_date
        }
        this.linkToPage(1, data)
      },
      getList(index = 1, filter = '') {
        this.GET_TEAM_REPORT({
          type: this.listType,
          rows: this.pageTotal,
          page: index,
          username: filter ? filter.username : '',
          game_code: filter ? filter.game_code : '',
          date_start: filter ? filter.date_start : '',
          date_end: filter ? filter.date_end : ''
        }).then(res => {
          if (res.data) {
            this.totalRows = parseInt(res.data.total_rows);
            this.list = initTeamItem(res.data.list)
          }
        })
      },
      setPageIndex(index) {
        let data = {
          username: this.searchUsername,
          game_code: this.game_code,
          date_start: this.start_date,
          date_end: this.end_date
        }
        this.linkToPage(index, data)
      },
      linkToPage(index, filter) {
        this.nowPage = index;
        this.getList(index, filter);
      },
      //转账
      handlePwdChange(val) {
        this.pwdList = val
      },
      withdrawHandle() {
        this.TRANSFER_MONEY_TO_SUB_AGENT({
          username: this.username,
          amount: this.transferMoney,
          withdraw_password: this.pwdList.join('')
        }).then(res => {
          this.availTransferMoney = res.data.balance
        })
      },
      _initPage() {
        this.$store.state.game.gameInfo.map(item => {
          this.gameTypeList.push(...item.includes.map(item1 => {
            return {
              code: item1.game_code,
              name: item1.name
            }
          }))
        });
        this.linkToPage(1);
        this.availTransferMoney = this.$store.getters.balance
        this.GET_SUB_AGENT_LIST().then(res => {
          this.userList = res.data ? res.data.users : [];
        })
      }
    },
    components: {
      InputNumberList, detailModal
    }
  }
</script>

<style scoped lang="scss">
    div.teamReport-wrapper {
        width: 100%;
        padding: 20px 28px;
        .pay-tab {
            border-bottom: 1px solid $theme-color;
            margin-bottom: 15px;
            .item {
                display: inline-block;
                width: 88px;
                height: 30px;
                cursor: pointer;
                line-height: 30px;
                text-align: center;
                font-size: $font-size-medium;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                background-color: #ebecf3;
                color: $color-black;
                &.active {
                    background-color: $theme-color;
                    color: $color-white;
                }
            }
        }
        .tab-item {
            width: 100%;
            &.tab-1 {
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
                .table {
                    width: 100%;
                    margin: 15px 0 130px;
                    text-align: center;
                    tr th, tr td {
                        border: 1px solid $border-color-gary;
                    }
                    .text-red {
                        color: $color-theme;
                    }
                    .pointer {
                        cursor: pointer;
                    }
                    thead {
                        tr {
                            height: 37px;
                            line-height: 37px;
                            background-color: #fafbff;
                            th {
                                font-size: $font-size-medium;
                                color: $color-dark;
                            }
                        }
                    }
                    tbody {
                        tr {
                            height: 37px;
                            line-height: 37px;
                            td {
                                &:first-child {
                                    text-align: left;
                                    padding-left: 20px;
                                }
                                font-size: $font-size-medium;
                                color: $color-black;
                                .icon {
                                    display: inline-block;
                                    width: 40px;
                                    height: 18px;
                                    margin-right: 10px;
                                    vertical-align: middle;
                                    &.icon-agent {
                                        background: url("../../../../public/static/images/agent-icon.png") no-repeat center center;
                                        background-size: contain;
                                    }
                                    &.icon-vip {
                                        background: url("../../../../public/static/images/vip-icon.png") no-repeat center center;
                                        background-size: contain;
                                    }
                                }
                            }
                            &.no-data {
                                @include noData()
                            }
                        }
                    }
                }
                .pagination {
                    text-align: right;
                }
            }
            &.tab-2 {
                min-height: 430px;
                padding-top: 27px;
                margin-bottom: 50px;
                .form-group {
                    width: 400px;
                    margin: 0 auto 40px;
                    .item {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-items: flex-start;
                        align-items: center;

                        margin-bottom: 12px;
                        &:first-child {
                            margin-bottom: 25px;
                        }
                        .text {
                            flex: 0 0 80px;
                            margin-right: 13px;
                            text-align: right;
                            font-size: $font-size-medium;
                            color: $color-black;
                        }
                        .value {
                            font-size: $font-size-medium-x;
                            font-weight: bold;
                            color: $color-theme;
                        }
                        .withdraw-pwd-num {
                            width: 34px;
                            height: 34px;
                            margin-right: 10px;
                        }
                    }
                }
                .btn-group {
                    text-align: center;
                    button {
                        @include button-submit-base
                    }
                }
            }
        }
    }
</style>

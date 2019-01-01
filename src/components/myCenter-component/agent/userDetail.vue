<template>
    <div class="userDetail-wrapper">
        <div class="wrapper-title">
            <router-link to="/my/agent/2" tag="span">用户列表 <i class="iconfont icon-jiantou"></i></router-link>
            {{userDetail.is_agent === "1"?'代理':'会员'}}{{userDetail.username}}
        </div>
        <div class="content">
            <div class="switch-tab-box">
                <a href="javascript:;" class="item" @click="switchTab(item.id)"
                   :class="item.id == String(activeNum).substr(0, 1)? 'active':''" v-for="item in switchList" :key="item.id"
                   v-if="userDetail.is_agent == '1'?true:item.id != 6 && item.id != 4 ? true : false" >{{item.title}}</a>
            </div>
            <div class="tab-box" v-if="userId">
                <div v-show="activeNum == 1" class="tab-item tab-1">
                    <div class="info-group">
                        <div class="text">用户名</div>
                        <div class="value-box">
                            <span class="text">{{userDetail.username}}</span>
                        </div>
                    </div>
                    <div class="info-group">
                        <div class="text">用户昵称</div>
                        <div class="value-box">
                            <span class="text">{{userDetail.nick_name}}</span>
                        </div>
                    </div>
                    <div class="info-group">
                        <div class="text">当前返点</div>
                        <div class="value-box">
                            <span class="text">{{userDetail.rebate}}%</span>
                        </div>
                    </div>
                    <div class="info-group">
                        <div class="text">可用余额</div>
                        <div class="value-box">
                            <span class="text text-red">{{userDetail.balance}}</span>
                        </div>
                    </div>
                    <div class="info-group">
                        <div class="text">最后登录时间</div>
                        <div class="value-box">
                            <span class="text">{{getTime(userDetail.last_login * 1000)}}</span>
                        </div>
                    </div>
                    <div class="info-group teamBalance" v-if="userDetail.is_agent === '1'">
                        <div class="text">团队余额</div>
                        <div class="value-box">
                            <span class="text text-red">{{userDetail.total_balance}}</span>
                        </div>
                    </div>
                </div>
                <div v-show="activeNum == 2" class="tab-item tab-2">
                    <Select class="select" v-model="game_type" style="width:170px" placeholder="选择游戏彩种"
                            @on-change="filterHandle">
                        <Option v-for="item in gameNameList" :value="item.code" :key="item.code">{{ item.name }}
                        </Option>
                    </Select>
                    <table class="table">
                        <thead>
                        <tr>
                            <th>玩法组</th>
                            <th>玩法名称</th>
                            <th>高奖金</th>
                            <th>高返点</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="gameList.length" v-for="(item, index) in gameList" :key="index">
                            <td>{{item.group_name}}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.lottery_max}}</td>
                            <td>{{item.rebate_max}}%</td>
                        </tr>
                        <tr v-if="!gameList.length" class="no-data">
                            <td colspan="4">暂无数据</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="pagination">
                        <Page :current="gameListNowPage" :total="gameListTotalRows" :page-size="gameListPageTotal"
                              show-elevator style="font-size: 12px" @on-change="gameListSetPageIndex"/>
                    </div>
                </div>
                <div v-show="activeNum == 3" class="tab-item tab-3">
                    <table class="table">
                        <thead>
                        <tr>
                            <th>日期</th>
                            <th>彩种 - 玩法名称</th>
                            <!--<th>投注内容</th>-->
                            <th>金额</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="orderList.length" v-for="item in orderList" :key="item.id">
                            <td>{{getTime(item.bet_time * 1000)}}</td>
                            <td>{{item.game_name}} - {{item.full_name}}</td>
                            <!--<td>{{item.content}}</td>-->
                            <td>{{item.amount_total}}</td>
                        </tr>
                        <tr v-if="!orderList.length" class="no-data">
                            <td colspan="4">暂无数据</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="pagination">
                        <Page :current="orderListNowPage" :total="orderListTotalRows" :page-size="orderListPageTotal"
                              show-elevator style="font-size: 12px" @on-change="orderListSetPageIndex"/>
                    </div>
                </div>
                <div v-show="activeNum == 6" class="tab-item tab-4 ">
                    <div class="contracts-title">
                        <div class="text">日工资契约列表</div>
                        <span class="add-contracts-btn" @click="showWagesContractsHandle">+ 新增契约</span>
                    </div>
                    <table class="table">
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
                        <tr v-for="item in wages_contractsList" v-show="wages_contractsList.length">
                            <td>{{item.rebate}}%</td>
                            <td>{{item.valid_member}}</td>
                            <td>{{item.valid_money}}</td>
                            <td>{{item.statusTxt}}</td>
                            <td>
                                <div class="btn-group" v-if="item.operateType" >
                                    <button class="confirm-btn" @click="setWagesContractStatusHandle(1, item.id)" type="button">接受</button>
                                    <button class="reject-btn" @click="setWagesContractStatusHandle(0, item.id)" type="button">拒绝</button>
                                </div>
                                <div class="btn-group" v-else >
                                    <button class="reject-btn" @click="setWagesContractStatusHandle(0, item.id)" type="button">撤回</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-show="!wages_contractsList.length" class="no-data">
                            <td colspan="7">暂无数据</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="pagination">
                        <Page :current="wages_contractsNowPage" :total="wages_contractsTotalRows"
                              :page-size="wages_pageSize"
                              show-elevator @on-change="wagesContractsSetPageIndex"
                              style="font-size: 12px"/>
                    </div>
                </div>
                <div v-show="activeNum == 4" class="tab-item tab-4">
                    <div class="contracts-title">
                        <div class="text">分红契约列表</div>
                        <span class="add-contracts-btn" @click="showBonusContractsHandle">+ 新增契约</span>
                    </div>
                    <table class="table">
                        <thead>
                        <tr>
                            <th>分红比例</th>
                            <th>有效人数</th>
                            <th>有效投注</th>
                            <th>契约周数</th>
                            <th>平台盈利</th>
                            <th>当前状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in bonus_contractsList" v-show="bonus_contractsList.length">
                            <td>{{item.rebate}}%</td>
                            <td>{{item.valid_member}}</td>
                            <td>{{item.valid_money}}</td>
                            <td>{{item.cycle == 0?'每日':'每月'}}</td>
                            <td>{{item.profit}}</td>
                            <td>{{item.statusTxt}}</td>
                            <td>
                                <div class="btn-group" v-if="item.operateType">
                                    <button class="confirm-btn" type="button" @click="setBonusContractStatusHandle(1, item.id)">接受</button>
                                    <button class="reject-btn" type="button" @click="setBonusContractStatusHandle(0, item.id)">拒绝</button>
                                </div>
                                <div class="btn-group" v-else >
                                    <button class="reject-btn" @click="setBonusContractStatusHandle(0, item.id)" type="button">撤回</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-show="!bonus_contractsList.length" class="no-data">
                            <td colspan="7">暂无数据</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="pagination">
                        <Page :current="bonus_contractsNowPage" :total="bonus_contractsTotalRows"
                              :page-size="bonus_pageSize"
                              show-elevator @on-change="bonusContractsSetPageIndex"
                              style="font-size: 12px"/>
                    </div>
                </div>
                <div v-show="activeNum == 5" class="tab-item tab-5">
                    <div class="mailer-box">
                        <div class="mailer-main">
                            <div class="addressee-box">
                                <div class="text">收件人 :</div>
                                <div class="addressee-name">{{userDetail.username}}</div>
                            </div>
                            <div class="theme-box">
                                <div class="text">主题 :</div>
                                <input class="theme-input" type="text" v-model="mailerTitle">
                            </div>
                            <div class="textarea-box">
                                <textarea class="textarea" v-model="mailerContent" placeholder="在此输入你要发送的信息"></textarea>
                            </div>
                        </div>
                        <div class="mailer-bottom">
                            <button type="button" class="send-btn" @click="sendMailerHandle">发送</button>
                            <a href="javascript:;" class="delect-btn iconfont icon-lajitong"
                               @click="clearMailerHandle"></a>
                        </div>
                    </div>
                </div>
                <div v-show="activeNum == 41" class="tab-item tab-6">
                    <div class="addContracts-wrapper">
                        <div class="input-group">
                            <div class="text">契约名称</div>
                            <div class="content">
                                <input class="input" v-model="bonus_contracts_name" placeholder="请输入契约名称"/>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">用户</div>
                            <div class="content">
                                <input class="input" :value="userDetail.username" readonly placeholder="请输入用户"/>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">分红比例</div>
                            <div class="content">
                                <Select v-model="bonus_contracts_rebeta" style="width:200px">
                                    <Option v-for="item in bonus_rebate_list" :value="item" :key="item">{{item}}%
                                    </Option>
                                </Select>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">有效人数</div>
                            <div class="content">
                                <input v-model="bonus_valid_member" class="input" placeholder="请输入有效人数"/>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">有效投注</div>
                            <div class="content">
                                <input v-model="bonus_valid_money" class="input" placeholder="请输入有效投注"/>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">平台盈利</div>
                            <div class="content">
                                <input v-model="profit" class="input" placeholder="请输入平台盈利"/>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">契约周期</div>
                            <div class="content">
                                <input class="input" :value="upperInfo ? upperInfo.my_dividend_contract.cycle == 0 ? '每日':'每月' : '' " readonly/>
                            </div>
                        </div>
                        <div class="submit-group">
                            <button type="button" class="submit-btn" @click="addBonusContractsHandle">添加</button>
                        </div>
                    </div>
                </div>
                <div v-show="activeNum == 61" class="tab-item tab-6">
                    <div class="addContracts-wrapper">
                        <div class="input-group">
                            <div class="text">契约名称</div>
                            <div class="content">
                                <input class="input" v-model="wages_contracts_name" placeholder="请输入契约名称"/>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">用户</div>
                            <div class="content">
                                <input class="input" :value="userDetail.username" readonly placeholder="请输入用户"/>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">分红比例</div>
                            <div class="content">
                                <Select v-model="wages_contracts_rebeta" style="width:200px">
                                    <Option v-for="item in wages_rebate_list" :value="item" :key="item">{{item}}%
                                    </Option>
                                </Select>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">有效人数</div>
                            <div class="content">
                                <input v-model="wages_valid_member" class="input" placeholder="请输入有效人数"/>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="text">有效投注</div>
                            <div class="content">
                                <input v-model="wages_valid_money" class="input" placeholder="请输入有效投注"/>
                            </div>
                        </div>
                        <div class="submit-group">
                            <button type="button" class="submit-btn" @click="addWagesContractsHandle">添加</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {Message} from 'iview'
  import { initSubContractsItem } from "../../../common/js/initData/initContracts";
  import {getYYYY_MM_HH} from "../../../common/js/date";

  export default {
    name: "userDetail",
    data() {
      return {
        activeNum: 1,
        userId: '',
        userDetail: '',
        upperInfo: '',
        switchList: [{id: 1, title: '用户详情'},
          {id: 2, title: '彩种详情'},
          {id: 3, title: '投注记录'},
          {id: 6, title: '日工资'},
          {id: 4, title: "分红"},
          {id: 5, title: '发信'}],
        // 彩种详情
        game_type: 'cqssc',
        gameNameList: [],
        gameList: [],
        gameListNowPage: 1,
        gameListTotalRows: 0,
        gameListPageTotal: 10,
        // 资金记录
        orderList: [],
        orderListNowPage: 1,
        orderListTotalRows: 0,
        orderListPageTotal: 10,
        mailerTitle: '',
        mailerContent: '',
        // 分红
        bonus_contractsList: [],
        bonus_contractsTotalRows: 0,
        bonus_contractsNowPage: 1,
        bonus_pageSize: 10,
        bonus_contracts_name: '',
        bonus_contracts_rebeta: '',
        bonus_rebate_list: [],
        bonus_valid_member: '',
        bonus_valid_money: '',
        profit: '',
        // 日工资
        wages_contractsList: [],
        wages_contractsTotalRows: 0,
        wages_contractsNowPage: 1,
        wages_pageSize: 10,
        wages_contracts_name: '',
        wages_contracts_rebeta: '',
        wages_rebate_list: [],
        wages_valid_member: '',
        wages_valid_money: '',
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['GET_SUB_AGENT_INFO', 'GET_GAME_SETTING', 'GET_BET_HISTORY', 'SEND_MESSAGE',
        'GET_CONTRACTS', 'CREATE_CONTRACTS', 'GET_AGENT_INFO', 'SET_CONTRACTS_STATUS']),
      switchTab(id) {
        if (this.activeNum === id) {
          return
        }
        this.activeNum = id
        if (id === 2) {
          this.gameListLinkToPage(1)
        }
        if (id === 3) {
          this.orderListLinkToPage(1)
        }
        if (id === 4) {
          this.bonusContractsLinkToPage(1)
        }
        if (id === 6) {
          this.wagesContractsLinkToPage(1)
        }
      },
      getTime(date) {
        return getYYYY_MM_HH(date)
      },
      // 发信
      sendMailerHandle() {
        if (!this.mailerTitle) {
          Message.error('请填写主题')
          return
        }
        if (!this.mailerContent) {
          Message.error('请填写内容')
          return
        }
        this.SEND_MESSAGE({
          type: 0,
          to_user: this.userDetail.id,
          title: this.mailerTitle,
          content: this.mailerContent
        })
      },
      clearMailerHandle() {
        this.mailerTitle = ''
        this.mailerContent = ''
      },
      // 彩种详情
      filterHandle() {
        this.gameListLinkToPage(1)
      },
      gameListSetPageIndex(index) {
        this.gameListLinkToPage(index)
      },
      gameListLinkToPage(index) {
        this.gameListNowPage = index;
        this._getGameList(index);
      },
      _getGameSelectList() {
        this.$store.state.game.gameInfo.map(item => {
          this.gameNameList.push(...item.includes.map(item1 => {
            return {
              code: item1.game_code,
              name: item1.name
            }
          }))
        });
      },
      _getGameList(index) {
        this.GET_GAME_SETTING({
          game_code: this.game_type,
          cid: this.userId,
          rows: this.gameListPageTotal,
          page: index
        }).then(res => {
          this.gameListTotalRows = res.data.total_rows
          this.gameList = res.data.games
        })
      },
      // 投注记录
      orderListSetPageIndex(index) {
        this.orderListLinkToPage(index)
      },
      orderListLinkToPage(index) {
        this.orderListNowPage = index;
        this._getOrderList(index);
      },
      _getOrderList(index) {
        this.GET_BET_HISTORY({
          cid: this.userId,
          rows: this.orderListPageTotal,
          page: index
        }).then(res => {
          if (res.data) {
            this.orderList = res.data.bills
            this.orderListTotalRows = res.data.rows
          }
        })
      },

      /*    分红    */
      // 分红新增契约入口
      showBonusContractsHandle() {
        if (this.activeNum === 41) {
          return
        }
        this.activeNum = 41
          console.log(this.bonus_rebate_list)
      },
      addBonusContractsVerify(data) {
        if (!data.title) {
          Message.error('请填写契约名称')
          return false
        }
        if (!data.rebate) {
          Message.error('请选择分红比例')
          return false
        }
        if (!data.valid_member) {
          Message.error('请设置有效人数')
          return false
        }
        if (!data.valid_money) {
          Message.error('请设置有效投注')
          return false
        }
        if (!data.profit) {
          Message.error('请设置平台盈利')
          return false
        }
        return true
      },
      // 新增契约确认
      addBonusContractsHandle() {
        let data = {
          type: 1,
          title: this.bonus_contracts_name,
          cid: this.userDetail.id,
          rebate: this.bonus_contracts_rebeta,
          valid_member: this.bonus_valid_member,
          valid_money: this.bonus_valid_money,
          profit: this.profit,
          cycle: this.upperInfo.my_dividend_contract.cycle
        }
        if (!this.addBonusContractsVerify(data)) {
          return
        }
        this.CREATE_CONTRACTS(data).then(res => {
          setTimeout(() => {
            this.activeNum = 4
            this.bonusContractsLinkToPage(1)
          }, 1000)
        })
      },
      // 分红
      bonusContractsSetPageIndex(index) {
        this.bonusContractsLinkToPage(index);
      },
      bonusContractsLinkToPage(index) {
        this.bonus_contractsNowPage = index;
        this._getBonusContractsList(index);
      },
      _getBonusContractsList(index) {
        this.GET_CONTRACTS({
          cid: this.userId,
          type: 1,
          rows: this.bonus_pageSize,
          page: this.bonus_contractsNowPage
        }).then(res => {
          this.bonus_contractsList = initSubContractsItem(res.data.contracts || [])
          this.bonus_contractsTotalRows = res.data.total_rows
        })
      },
      _getBonusRebateList() {
        let point = 0.0;

        console.log("比例: ",this.upperInfo.my_dividend_contract.rebate)
        while (point <= parseFloat(this.upperInfo.my_dividend_contract.rebate)) {
          this.bonus_rebate_list.push(point.toFixed(1))
          point += 0.1;
        }
          console.log("比例数: ",this.bonus_rebate_list.length)
      },
      // 契约状态
      setWagesContractStatusHandle(status, id) {
        this.SET_CONTRACTS_STATUS({
          id: id,
          status: status,
          type: 0
        }).then(res => {
          setTimeout(() => {
            this.wagesContractsLinkToPage(1)
          }, 1000)
        })
      },
      /*    分红    */

      /*    日工资    */
      showWagesContractsHandle() {
        if (this.activeNum === 61) {
          return
        }
        this.activeNum = 61
        console.log(this.bonus_rebate_list)
      },
      addWagesContractsVerify(data) {
        if (!data.title) {
          Message.error('请填写契约名称')
          return false
        }
        if (!data.rebate) {
          Message.error('请选择分红比例')
          return false
        }
        if (!data.valid_member) {
          Message.error('请设置有效人数')
          return false
        }
        if (!data.valid_money) {
          Message.error('请设置有效投注')
          return false
        }
        return true
      },
      // 新增契约确认
      addWagesContractsHandle() {
        let data = {
          type: 0,
          title: this.wages_contracts_name,
          cid: this.userDetail.id,
          rebate: this.wages_contracts_rebeta,
          valid_member: this.wages_valid_member,
          valid_money: this.wages_valid_money
        }
        if (!this.addWagesContractsVerify(data)) {
          return
        }
        this.CREATE_CONTRACTS(data).then(res => {
          setTimeout(() => {
            this.activeNum = 6
            this.wagesContractsLinkToPage(1)
          }, 1000)
        })
      },
      wagesContractsSetPageIndex(index) {
        this.wagesContractsLinkToPage(index);
      },
      wagesContractsLinkToPage(index) {
        this.wages_contractsNowPage = index;
        this._getWagesContractsList(index);
      },
      _getWagesRebateList() {
        let point = 0.0;
        while (point <= parseFloat(this.upperInfo.my_wage_contract.rebate)) {
          this.wages_rebate_list.push(point.toFixed(1))
          point += 0.1;
        }
      },
      _getWagesContractsList(index) {
        this.GET_CONTRACTS({
          cid: this.userId,
          type: 0,
          rows: this.wages_pageSize,
          page: this.wages_contractsNowPage
        }).then(res => {
          this.wages_contractsList = initSubContractsItem(res.data.contracts || [])
          this.wages_contractsTotalRows = res.data.total_rows
        })
      },
      // 契约状态
      setBonusContractStatusHandle(status, id) {
        this.SET_CONTRACTS_STATUS({
          id: id,
          status: status,
          type: 1
        }).then(res => {
          setTimeout(() => {
            this.bonusContractsLinkToPage(1)
          }, 1000)
        })
      },
      /*    日工资    */


      // 下级用户详情
      _getUserDetail() {
        let userId = this.$route.query.id
        this.userId = userId
        this.GET_SUB_AGENT_INFO({cid: userId}).then(res => {
          this.userDetail = res.data.detail
        })
      },
      _getAgentInfo() {
        this.GET_AGENT_INFO().then(res => {
          this.upperInfo = res.data
          this._getBonusRebateList()
          this._getWagesRebateList()
        })
      },
      _initPage() {
        this._getUserDetail()
        this._getAgentInfo()
        this._getGameSelectList()
      }
    }
  }
</script>

<style scoped lang="scss">
    .userDetail-wrapper {
        width: 100%;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        box-sizing: border-box;
        .wrapper-title {
            width: 100%;
            height: 59px;
            line-height: 59px;
            padding: 0 30px 0 20px;
            border-bottom: 1px solid $border-color-gary;
            font-size: $font-size-medium-x;
            color: $color-dark;
            span {
                margin-right: 8px;
                font-weight: bold;
                color: $color-black;
                cursor: pointer;
            }
        }
        .content {
            padding: 17px 27px 50px 20px;
            .switch-tab-box {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: flex-end;
                width: 100%;
                border-bottom: 1px solid $border-color-gary;
                .item {
                    position: relative;
                    top: 1px;
                    height: 27px;
                    margin-right: 42px;
                    border-bottom: 1px solid $border-color-gary;
                    font-size: $font-size-medium;
                    color: $color-black;
                    &.active {
                        color: $color-theme;
                        border-bottom: 2px solid $color-theme;
                    }
                }
            }
            .tab-box {
                .tab-item {
                    width: 100%;
                    .table {
                        width: 100%;
                        margin: 10px 0 130px;
                        text-align: center;
                        tr th, tr td {
                            border: 1px solid $border-color-gary;
                        }
                        .no-data {
                            @include noData()
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
                                height: 37px;
                                line-height: 37px;
                                td {
                                    font-size: $font-size-medium;
                                    color: $color-black;
                                    &:nth-last-child(1), &:nth-last-child(2) {
                                        width: 33%;
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
                    &.tab-1 {
                        .info-group {
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: flex-start;
                            align-items: center;
                            height: 43px;
                            border-bottom: 1px solid $border-color-gary;
                            > .text {
                                flex: 0 0 105px;
                                width: 105px;
                                line-height: 1.2;
                                border-right: 1px solid $border-color-gary;
                                font-size: $font-size-medium;
                                color: $color-dark;
                            }
                            .value-box {
                                margin-left: 50px;
                                padding-right: 17px;
                                flex: 1;
                                text-align: left;
                                .text {
                                    display: inline-block;
                                    text-align: right;
                                    font-size: $font-size-medium;
                                    color: $color-black;
                                    &.text-red {
                                        color: $color-theme;
                                        font-weight: bold;
                                    }
                                }
                                .menu-text {
                                    font-size: $font-size-medium;
                                    color: $color-dark;
                                    .iconfont {
                                        vertical-align: middle;
                                    }
                                }
                            }
                            &.teamBalance {
                                margin: 20px 0 70px;
                                border-top: 1px solid $border-color-gary;
                            }
                        }
                    }
                    &.tab-2 {
                        .select {
                            padding-top: 10px;
                        }
                    }
                    &.tab-5 {
                        margin: 40px 0;
                        .mailer-box {
                            width: 100%;
                            border: 1px solid $border-color-gary;
                            border-radius: 5px;
                            box-shadow: 0 4px 4px #e6e8f1;
                            box-sizing: border-box;
                            .mailer-main {
                                padding: 0 62px 0 15px;
                                .addressee-box {
                                    display: flex;
                                    flex-flow: row nowrap;
                                    justify-content: flex-start;
                                    align-items: center;
                                    height: 43px;
                                    .text {
                                        flex: 0 0 52px;
                                        text-align: right;
                                        font-size: $font-size-medium;
                                        color: $color-black;
                                    }
                                    .addressee-name {
                                        position: relative;
                                        flex: 1;
                                        height: 43px;
                                        line-height: 43px;
                                        padding-left: 20px;
                                        border-bottom: 1px solid $border-color-gary;
                                    }
                                }
                                .theme-box {
                                    display: flex;
                                    flex-flow: row nowrap;
                                    justify-content: flex-start;
                                    align-items: center;
                                    .text {
                                        flex: 0 0 52px;
                                        text-align: right;
                                        font-size: $font-size-medium;
                                        color: $color-black;
                                    }
                                    .theme-input {
                                        flex: 1;
                                        height: 43px;
                                        border: none;
                                        padding-left: 20px;
                                        border-bottom: 1px solid $border-color-gary;
                                        font-size: $font-size-medium;
                                        color: $color-black;
                                    }
                                }
                                .textarea-box {
                                    margin: 12px 0 18px;
                                    padding-left: 52px;
                                    .textarea {
                                        width: 100%;
                                        height: 190px;
                                        resize: none;
                                        font-size: $font-size-medium;
                                        color: $color-black;
                                    }
                                }
                            }
                            .mailer-bottom {
                                display: flex;
                                flex-flow: row nowrap;
                                justify-content: space-between;
                                align-items: center;
                                border-top: 1px solid $border-color-gary;
                                height: 49px;
                                padding: 0 25px 0 15px;
                                .send-btn {
                                    width: 78px;
                                    height: 34px;
                                    line-height: 34px;
                                    border: none;
                                    background: $gradient-color;
                                    font-size: $font-size-medium;
                                    color: $color-white;
                                }
                                .delect-btn {
                                    padding: 10px;
                                    color: #595b64;
                                    font-size: 26px;
                                }
                            }
                        }
                    }
                    &.tab-4 {
                        padding: 20px 0;
                        .contracts-title {
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 20px;
                            .text {
                                font-size: 14px;
                                color: $color-gary;
                            }
                            .add-contracts-btn {
                                font-size: 14px;
                                color: $color-theme;
                                cursor: pointer;
                            }
                        }
                    }
                    &.tab-6 {
                        .addContracts-wrapper {
                            padding: 0 28px;
                            .input-group {
                                display: flex;
                                flex-flow: row nowrap;
                                justify-content: space-between;
                                align-items: center;
                                width: 100%;
                                height: 45px;
                                border-bottom: 1px solid $border-color-gary;
                                .text {
                                    flex: 0 0 90px;
                                    padding-left: 2px;
                                    border-right: 2px solid $border-color-gary;
                                    font-size: $font-size-medium;
                                    color: $color-dark;
                                    .must {
                                        margin-left: 3px;
                                        color: #da1d1d;
                                    }
                                }
                                .content {
                                    flex: 1;
                                    padding: 0 20px 0 45px;
                                    &.right {
                                        text-align: right;
                                        .input {
                                            text-align: right;
                                        }
                                    }
                                    > .input {
                                        width: 100%;
                                        border: none;
                                        font-size: $font-size-medium;
                                        color: $color-black;
                                    }
                                    .ivu-select-selection {
                                        border: none;
                                    }
                                }
                            }
                            .submit-group {
                                width: 218px;
                                margin: 40px auto 0;
                                .submit-btn {
                                    margin-bottom: 20px;
                                    @include button-submit-base()
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>

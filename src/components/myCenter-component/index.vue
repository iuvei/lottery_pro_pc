<template>
    <div class="index-wrapper">
        <div class="my-card-box">
            <div class="card-top">
                <div class="userInfo">
                    <img src="../../../public/static/images/headImg-default.png" class="headImg">
                    <div class="user">
                        <div class="name">{{userInfo.username || 'xxx'}}</div>
                        <div class="balance">余额: ￥{{userInfo.balance || 'xxx'}}</div>
                    </div>
                </div>
                <router-link class="linkTo-userInfo" to="/my/info">个人信息设置 <i class="iconfont icon-jiantou"></i></router-link>
                <div class="link-group">
                    <span class="set-pwd" @click="setPwdHandle('password')">修改登录密码</span>
                    <span class="set-pwd" @click="setPwdHandle('withdrawPassword')">{{isSettingWithdrawPsd? '修改提现密码' : '设置提现密码'}}</span>
                </div>
            </div>
            <div class="card-bottom">
                <router-link to="/my/finances/recharge" tag="div" class="function-item">
                    <i class="icon icon-recharge"></i>
                    <span class="text">充值</span>
                </router-link>
                <router-link to="/my/finances/withdraw" tag="div" class="function-item">
                    <i class="icon icon-withdraw"></i>
                    <span class="text">提现</span>
                </router-link>
                <router-link to="/my/finances/transfer" tag="div" class="function-item">
                    <i class="icon icon-transfer"></i>
                    <span class="text">转账中心</span>
                </router-link>
                <router-link to="/my/finances/bankCardManage" tag="div" class="function-item">
                    <i class="icon icon-bankCard"></i>
                    <span class="text">银行卡</span>
                </router-link>
                <div class="function-item">
                    <i class="icon icon-service"></i>
                    <span class="text">客服</span>
                </div>
            </div>
        </div>
        <div class="recent-order-box">
            <div class="recent-order-title">最近5笔注单</div>
            <div class="recent-order-content">
                <div class="switch-tab">
                    <a href="javascript:;" class="switch-btn" :class="switchListId === '0'?'selected':''" @click="switchTab('0')">全部注单</a>
                    <a href="javascript:;" class="switch-btn" :class="switchListId === '1'?'selected':''" @click="switchTab('1')">未结算</a>
                    <a href="javascript:;" class="switch-btn" :class="switchListId === '2'?'selected':''" @click="switchTab('2')">已中奖</a>
                    <a href="javascript:;" class="switch-btn" :class="switchListId === '3'?'selected':''" @click="switchTab('3')">未中奖</a>
                </div>
                <div class="order-box">
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
                            <tr v-show="orderList" v-for="item in orderList" :key="item.id">
                                <td>{{item.game_name}}</td>
                                <td>{{item.round}}</td>
                                <td>{{item.game_full_name}}</td>
                                <td>{{item.content}}</td>
                                <td class="order-sum">{{item.total_amount}}</td>
                                <td>{{item.win_amount}}</td>
                                <td class="game-status" :class="item.statusCode === 1? 'text-red':'' ">{{item.statusText}}</td>
                                <td><a href="javascript:;" @click="showDetail(item)">查看</a></td>
                            </tr>
                            <tr class="no-data" v-show="!orderList">
                                <td colspan="8">暂无数据</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="more-order">
                        <router-link to="/my/order" tag="a">查看更多注单<i class="iconfont icon-jiantou"></i></router-link>
                    </div>
                </div>
            </div>
        </div>
        <pwd-modal v-if="displayModal" :isSettingWithdrawPsd="isSettingWithdrawPsd"
                   :modal-type="modalType"
                   :mask='false'
                   :displayModal='displayModal'
                   @closeModal="closeModal"
                   @passwordSubmit="passwordSubmit"
                   @withdrawPasswordSubmit="withdrawPasswordSubmit">
        </pwd-modal>
        <order-detail-modal :mask='false'
                            :displayModal='detailDisplayModal'
                            :orderDetailList = 'orderDetail'
                            @closeModal="detailCloseModal">
        </order-detail-modal>
    </div>
</template>

<script>
    import PwdModal from '../../common/base/passwordModal/pwdModal'
    import OrderDetailModal from '../../common/base/detailModal/orderDetailModal'
    import {numANDstring, number} from "../../common/js/formverify/base";
    import {initOrderItem, initOrderDetail} from "../../common/js/initData/initList";
    import { mapActions } from 'vuex';

    const ORDER_LIST_LENGTH = 5;

    export default {
        name: "index",
        data() {
            return {
                switchListId: '0',
                modalType: '',
                displayModal: false,
                userInfo: '',
                orderList: '',
                orderDetail: [],
                detailDisplayModal: false,
                isSettingWithdrawPsd: false
            }
        },
        created() {
            this._initPage();
        },
        methods: {
            ...mapActions(['MODIFY_LOGIN_PWD', 'MODIFY_WITHDRAW_PWD', 'GET_BET_HISTORY']),
            switchTab(name) {
                if (this.switchId === name) {
                    return
                }
                this.switchListId = name;
                this.getOrderList(name);
            },
            closeModal() {
                this.displayModal = false
            },
            setPwdHandle(type) {
                this.modalType = type;
                this.displayModal = true
            },
            passwordSubmit(data) {
                var _this = this
                if (numANDstring(data.oldPwd, '原密码') && numANDstring(data.newPwd, '新密码')) {
                    if (data.newPwd === data.againPwd) {
                        this.MODIFY_LOGIN_PWD({
                            password: data.oldPwd,
                            new_password: data.newPwd
                        }).then(res => {
                            this.displayModal = false
                            _this.$bus.emit("logout")
                        })
                    } else {
                        this.$Message.error('两次输入密码不一致');
                    }
                }
            },
            withdrawPasswordSubmit(data) {
                if (this.isSettingWithdrawPsd && !number(data.oldWDPwd, "提现密码")) {
                    return
                }
                if (!number(data.newWDPwd, "提现密码")) {
                    return
                }
                if (data.newWDPwd !== data.againWDPwd) {
                    this.$Message.error('两次输入密码不一致');
                    return
                }
                this.MODIFY_WITHDRAW_PWD({
                    old_password: this.isSettingWithdrawPsd ? data.oldWDPwd : '',
                    withdraw_password: data.newWDPwd,
                    re_withdraw_password: data.againWDPwd
                }).then(res => {
                    this.closeModal()
                    this.isSettingWithdrawPsd = true
                })
            },
            getOrderList(type) {
                this.GET_BET_HISTORY({
                    type: type,
                    rows: ORDER_LIST_LENGTH,
                    page: 1
                }).then(res => {
                    if (res.data) {
                        let orderList = res.data.bills;
                        let initList = orderList.map(item => {
                            return initOrderItem(item)
                        });
                        this.orderList = initList;
                    } else {
                        this.orderList = '';
                    }
                })
            },
            showDetail(data) {
                this.orderDetail = initOrderDetail(data);
                this.detailDisplayModal = true
            },
            detailCloseModal() {
                this.detailDisplayModal = false
            },
            _initPage() {
                if (!this.$store.getters.token) {
                    return
                }
                this.userInfo = this.$store.state.user.userInfo;
                this.isSettingWithdrawPsd = this.$store.state.user.userInfo.isset_withdraw_password
                this.getOrderList(this.switchListId);
            }
        },
        components: {
            OrderDetailModal,
            PwdModal
        }
    }
</script>

<style scoped lang="scss">
    .index-wrapper {
        .my-card-box {
            position: relative;
            width: 100%;
            height: 350px;
            border: 1px solid $border-color-gary;
            border-radius: 5px;
            box-shadow: 0 3px 3px #dfe2ed;
            z-index: 10;
            .card-top {
                position: relative;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 240px;
                padding: 40px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                box-sizing: border-box;
                background: url("../../../public/static/images/idCard_bg.png") no-repeat center center;
                background-size: cover;
                .userInfo {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    .headImg {
                        margin-right: 25px;
                        width: 130px;
                        height: 130px;
                        border-radius: 50%;
                    }
                    .user {
                        .name {
                            margin-bottom: 10px;
                            font-size: 26px;
                            font-weight: bold;
                            color: $color-white;
                        }
                        .balance {
                            font-size: $font-size-medium;
                            color: $color-white;
                        }
                    }
                }
                .linkTo-userInfo {
                    font-size: $font-size-medium;
                    color: $color-white;
                    .iconfont {
                        font-size: 14px;
                    }
                }
                .link-group {
                    position: absolute;
                    bottom: 13px;
                    right: 56px;
                    .set-pwd {
                        font-size: $font-size-small;
                        color: $color-white;
                        cursor: pointer;
                        &:first-child {
                            margin-right: 15px;
                        }
                    }
                }
            }
            .card-bottom {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 110px;
                padding: 20px 100px;
                .function-item {
                    cursor: pointer;
                    &:hover .icon{
                        animation: pulse 1s;
                    }
                    .icon {
                        display: inline-block;
                        width: 36px;
                        height: 32px;
                        vertical-align: middle;
                        &.icon-recharge {
                            background: url("../../../public/static/images/recharge-icon.png") no-repeat left center;
                            background-size: contain;
                        }
                        &.icon-withdraw {
                            background: url("../../../public/static/images/withdraw-icon.png") no-repeat left center;
                            background-size: contain;
                        }
                        &.icon-transfer {
                            background: url("../../../public/static/images/transfer-icon.png") no-repeat left center;
                            background-size: contain;
                        }
                        &.icon-bankCard {
                            background: url("../../../public/static/images/bankCard-icon.png") no-repeat left center;
                            background-size: contain;
                        }
                        &.icon-service {
                            background: url("../../../public/static/images/service-icon.png") no-repeat left center;
                            background-size: contain;
                        }
                    }
                    .text {
                        margin-left: 10px;
                        font-size: $font-size-medium;
                        color: $color-black;
                        vertical-align: middle;
                    }
                }
            }
        }
        .recent-order-box {
            .recent-order-title {
                padding: 20px 0  18px;
                font-size: $font-size-medium;
                font-weight: bold;
                color: $color-black;
                background-color: #fafbff;
            }
            .recent-order-content {
                width: 100%;
                padding: 0 28px;
                border: 1px solid $border-color-gary;
                border-radius: 5px;
                box-sizing: border-box;
                .switch-tab {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    height: 59px;
                    border-bottom: 1px solid $border-color-gary;
                    .switch-btn {
                        height: 59px;
                        line-height: 59px;
                        margin-right: 58px;
                        border-bottom: 1px solid transparent;
                        font-size: $font-size-medium-x;
                        font-weight: bold;
                        color: $color-black;
                        &:hover {
                            color: $color-theme;
                        }
                        &.selected {
                            border-bottom: 2px solid $color-theme;
                            color: $color-theme;
                        }
                    }
                }
                .order-box {
                    margin-top: 6px;
                    .order-table {
                        width: 100%;
                        margin-bottom: 42px;
                        text-align: center;
                        .no-data {
                            @include noData()
                        }
                        thead tr, tbody tr:last-child {
                            border-bottom: 1px solid $border-color-gary;
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
                                &.order-sum, .winning {
                                    color: $color-theme;
                                }
                                &.game-status {
                                    &.text-red {
                                        color: $color-theme;
                                    }
                                }
                                a {
                                    color: #3a8ff0;
                                }
                            }
                        }
                    }
                    .more-order {
                        padding-bottom: 27px;
                        text-align: right;
                        a {
                            position: relative;
                            font-size: $font-size-medium;
                            color: $color-black;
                            &:hover {
                                color: $color-theme;
                            }
                            .iconfont {
                                margin-left: 5px;
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
    }
    @keyframes pulse {
        0% {
            transform: scaleX(1)
        }

        50% {
            transform: scale3d(1.08,1.08,1.08)
        }

        to {
            transform: scaleX(1)
        }
    }
</style>

<template>
    <div class="recharge-wrapper">
        <div class="pay-tab">
            <span class="item online" @click="lineSwitch('online')" v-show="rechargeList.online.length" :class="switchTxt === 'online'? 'active' :''">在线支付</span>
            <span class="item offline" @click="lineSwitch('offline')" v-show="rechargeList.offline.length" :class="switchTxt === 'offline'? 'active' :''">线下支付</span>
        </div>
        <div class="content">
            <div class="pay-group">
                <div class="pay-title">充值方式</div>
                <div class="pay-type" v-cloak>
                    <div class='item' v-show="switchTxt === 'online'" v-for="(item, index) in rechargeList.online" @click="payTab(item,index)" :title="item.code" :class="payType === index? 'selected' : ''">
                        <img class="onlinePayLogo" :src="require(`../../../../static/images/${item.code}.png`)" alt="">
                    </div>
                    <!--<div v-show="switchTxt === 'offline'" v-for="(item, index) in rechargeList.offline">
                        <img class="onlinePayLogo" :src="require(`../../../../static/images/${item.code}.png`)" alt="">
                    </div>-->
                </div>
            </div>
            <div class="online" v-if="switchTxt === 'online'">
                <div class="pay-group">
                    <div class="pay-title">充值金额</div>
                    <div class="money-group">
                        <input  v-model="setMoneyInput" type="text" class="setMoney" placeholder="请输入充值金额"
                               @input="setMoneyInputHandle" maxlength="7">
                        <button v-for="item in buttonList" class="money-btn"
                                :class="item.id == buttonState.id? 'changed':'' " type="button" :key="item.id"
                                @click="setMoneyHandle(item)">￥{{item.value}}
                        </button>
                    </div>
                    <div class="tips">单笔下限{{amountLimit.min}}，单笔上限{{amountLimit.max}}</div>
                </div>
                <div class="submit-group">
                    <div class="total">
                        充值金额：<span class="value">{{altogether}} 元</span>
                    </div>
                    <button type="button" class="submit-btn" @click="confirmHandle">确认充值</button>
                    <div class="tips">若充值失败，请更换其他通道充值</div>
                </div>
            </div>
            <div class="offline" v-if="switchTxt === 'offline'">
                <div class="form-wrapper">
                    <div class="form-left form-group-box">
                        <div class="form-title">收款方式</div>
                        <div class="form-group-list">
                            <div class="form-item">
                                <div class="text">收款方:</div>
                                <Input class="input" readonly v-model="receive_person" placeholder="请输入收款方姓名"/>
                            </div>
                            <div class="form-item">
                                <div class="text">账号:</div>
                                <Input class="input" readonly v-model="receive_account" placeholder="请输入收款方账号"/>
                            </div>
                            <div class="form-item">
                                <div class="text">银行:</div>
                                <Input class="input" readonly v-model="receive_pwd" placeholder="请输入收款方银行"/>
                            </div>
                        </div>
                    </div>
                    <div class="pay-QR">
                        <qr-code v-show="qrcode" :text="qrcode" :size="120"></qr-code>
                    </div>
                    <div class="form-right form-group-box">
                        <div class="form-title">付款账户</div>
                        <div class="form-group-list">
                            <div class="form-item">
                                <div class="text">昵称:</div>
                                <Input class="input" v-model="send_name" placeholder="请输入付款方昵称"/>
                            </div>
                            <div class="form-item">
                                <div class="text">金额:</div>
                                <InputNumber class="input" v-model="send_money" placeholder="请输入金额" :max="9999999" :min="0"/>
                            </div>
                            <div class="form-item">
                                <div class="text">商户单号:</div>
                                <Input class="input" v-model="send_order" placeholder="请输入付款方银行"/>
                            </div>
                            <div class="form-item">
                                <div class="text">汇款日期:</div>
                                <DatePicker :editable="false" :value="send_date" @on-change="changeDate" type="date" placeholder="请选择汇款日期"
                                            style="width: 168px"></DatePicker>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="submit-box">
                    <div class="total">充值金额: <b class="num">{{send_money || '0'}} 元</b></div>
                    <button class="submit-btn">提交</button>
                    <div class="tips">若充值失败, 请更换其他通道充值</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: "recharge",
    data() {
      return {
        switchTxt: 'online',
        payType: 0,
        setMoneyInput: '',
        buttonState: '',
        buttonList: [{id: 0, value: 51}, {id: 1, value: 102}, {id: 2, value: 303}, {id: 3, value: 505}, {
          id: 4,
          value: 801
        }, {id: 5, value: 1002}, {id: 6, value: 2003}, {id: 7, value: 3004}],
        receive_person: '',
        receive_account: '',
        receive_pwd: '',
        send_name: '',
        send_money: 0,
        send_order: '',
        send_date: new Date(),
        rechargeList: {},
        qrcode: "",
        amountLimit:{
            min: "10",
            max: "100",
        }
      }
    },
    methods: {
      ...mapActions(['GET_RECHARGE_CHANNEL_LIST', 'GET_RECHARGE_LIST']),
      lineSwitch(name) {
        this.switchTxt = name
          let item = {}
          if(name == "online"){
              item.category_id = this.rechargeList.online[0].category_id
          }else{
              item.category_id = this.rechargeList.offline[0].category_id
          }
        this.getRechargeChannelList(item)
      },
      payTab(item, type) {
        this.payType = type
        this.getRechargeChannelList(item)
      },
      setMoneyInputHandle(e) {
        this.setMoneyInput = e.target.value.replace(/[^\d]/g, '');
        this.buttonState = ''
      },
      setMoneyHandle(item) {
        this.setMoneyInput = item.value;
        this.buttonState = item
      },
      confirmHandle() {

      },
      changeDate(date) {
        this.send_date = date
      },
      getRechargeChannelList(channel){
          this.GET_RECHARGE_CHANNEL_LIST({
              category_id: channel.category_id,
              type: this.switchTxt === 'online'?"0":"1"
          }).then(res => {
                this.receive_person = res.data[0].account_name
                this.receive_account = res.data[0].account
                this.receive_pwd = res.data[0].address
                this.qrcode = res.data[0].qrcode_url
                this.amountLimit.max = res.data[0].max
                this.amountLimit.min = res.data[0].min
          })
          .catch(err => {
              this.verifyCodeShouldReload = true
          })
      },
      getRechargeList(){
          this.GET_RECHARGE_LIST({
          }).then(res => {
              this.rechargeList = res.data
              this.getRechargeChannelList(res.data.online[0])
          })
          .catch(err => {
              this.verifyCodeShouldReload = true
          })
      }
    },
    computed: {
      altogether() {
        if (this.setMoneyInput) {
          return this.setMoneyInput
        } else if (this.buttonState) {
          return this.buttonState.value
        } else {
          return '0'
        }
      }
    },
    created() {
        this.getRechargeList();
    }
  }
</script>

<style scoped lang="scss">
    .recharge-wrapper {
        width: 100%;
        padding: 20px 29px 134px;
        .pay-tab {
            border-bottom: 1px solid $theme-color;
            margin-bottom: 22px;
            .item {
                display: inline-block;
                width: 88px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-size: $font-size-medium;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                background-color: #ebecf3;
                color: $color-black;
                cursor: pointer;
                &.active {
                    background-color: $theme-color;
                    color: $color-white;
                }
            }
        }
        .content {
            .pay-group {
                margin-bottom: 22px;
                .pay-title {
                    margin-bottom: 13px;
                    font-size: $font-size-medium;
                    color: $color-dark;
                }
                .pay-type {
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: flex-start;
                    align-items: flex-start;
                    .item {
                        position: relative;
                        width: 208px;
                        height: 64px;
                        border: 1px solid $border-color-gary;
                        margin-right: 19px;
                        box-sizing: border-box;
                        &.wechat {
                            background: url("/static/images/wechat.png") no-repeat center center;
                            background-size: contain;
                        }
                        &.zhifubao {
                            background: url("/static/images/zhifubao.png") no-repeat center center;
                            background-size: contain;
                        }
                        &.jingdong {
                            background: url("/static/images/jingdong.png") no-repeat center center;
                            background-size: contain;
                        }
                        &.kuaijie {
                            background: url("/static/images/quick_pay.png") no-repeat center center;
                            background-size: contain;
                        }
                        &.selected {
                            border: 1px solid $color-theme;
                            &:after {
                                content: '';
                                position: absolute;
                                bottom: -1px;
                                right: -1px;
                                width: 26px;
                                height: 26px;
                                background: url("/static/images/pay_selected.png") no-repeat right bottom;
                                background-size: contain;
                            }
                        }
                        &:nth-child(4n) {
                            margin-right: 0;
                        }
                    }
                }
                .money-group {
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: flex-start;
                    align-items: flex-start;
                    .setMoney {
                        width: 202px;
                        height: 34px;
                        padding: 0 15px 0 20px;
                        margin-right: 8px;
                        line-height: 34px;
                        border-radius: 3px;
                        border: 1px solid $border-color-gary;
                        offline: none;
                        font-size: $font-size-small-s;
                        color: $color-black;
                    }
                    .money-btn {
                        width: 78px;
                        height: 34px;
                        line-height: 34px;
                        margin: 0 8px 12px 0;
                        text-align: center;
                        font-size: $font-size-small-s;
                        color: $color-black;
                        &.changed {
                            border: 1px solid $color-theme;
                            color: $color-black;
                        }
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }
                .tips {
                    font-size: $font-size-small;
                    color: $color-theme;
                }
            }
            .submit-group {
                width: 218px;
                margin: 30px auto 0;
                .total {
                    margin-bottom: 15px;
                    font-size: $font-size-medium;
                    color: $color-black;
                    .value {
                        color: $color-theme;
                        font-weight: bold;
                    }
                }
                .submit-btn {
                    margin-bottom: 22px;
                    @include button-submit-base
                }
                .tips {
                    font-size: $font-size-small;
                    color: $color-dark;
                }
            }
            .offline {
                .form-wrapper {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 12px;
                    .form-group-box {
                        &.form-right .form-group-list .form-item {
                            .text {
                                flex: 0 0 75px;
                            }
                        }
                        .form-title {
                            margin-bottom: 13px;
                            font-size: $font-size-medium;
                            color: $color-dark;
                        }
                        .form-group-list {
                            .form-item {
                                display: flex;
                                flex-flow: row nowrap;
                                justify-content: flex-start;
                                align-items: center;
                                margin-bottom: 8px;
                                &:last-child {
                                    margin-bottom: 0;
                                }
                                .text {
                                    flex: 0 0 55px;
                                    margin-right: 20px;
                                    text-align: right;
                                    font-size: $font-size-medium;
                                    color: $color-black;
                                }
                                .input {
                                    width: 168px;
                                    font-size: $font-size-small;
                                    color: $color-black;
                                }
                            }
                        }
                    }
                    .pay-QR {
                        width: 120px;
                        height: 120px;
                        margin: 28px 15px 0 15px;
                        .QR {
                            width: 120px;
                            height: 120px;
                            border: 1px solid $border-color-gary;
                        }
                    }
                }
                .submit-box {
                    width: 218px;
                    margin: 0 auto 15px;
                    .total {
                        margin-bottom: 15px;
                        font-size: $font-size-medium;
                        color: $color-black;
                        .num {
                            color: $color-theme;
                            font-weight: bold;
                        }
                    }
                    .submit-btn {
                        margin-bottom: 23px;
                        @include button-submit-base
                    }
                    .tips {
                        font-size: $font-size-small;
                        color: $color-gary;
                    }
                }
            }
        }
    }
</style>

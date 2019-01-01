<template>
    <div class="withdraw-wrapper">
        <div class="account-balance">
            <div class="text">账户余额</div>
            <div class="value">
                <span class="unit">￥</span>
                <span class="num">{{userInfo.balance}}</span>
            </div>
        </div>
        <div class="other-balances-group">
            <div class="item">
                <span class="text">真人余额</span>
                <span class="value">
                    <span class="unit">￥</span>
                    <span class="number">20000.00</span>
                </span>
            </div>
            <div class="item">
                <span class="text">电子余额</span>
                <span class="value">
                    <span class="unit">￥</span>
                    <span class="number">20000.00</span>
                </span>
            </div>
            <div class="item">
                <span class="text">棋牌余额</span>
                <span class="value">
                    <span class="unit">￥</span>
                    <span class="number">20000.00</span>
                </span>
            </div>
            <div class="item">
                <span class="text">捕鱼余额</span>
                <span class="value">
                    <span class="unit">￥</span>
                    <span class="number">20000.00</span>
                </span>
            </div>
            <div class="item">
                <span class="text">占位余额</span>
                <span class="value">
                    <span class="unit">￥</span>
                    <span class="number">20000.00</span>
                </span>
            </div>
        </div>
        <div class="form-group">
            <div class="item">
                <div class="text">提现账户:</div>
                <div class="value">{{userInfo.real_name || '*'}}</div>
            </div>
            <div class="item">
                <div class="text">选择银行卡:</div>
                <Select v-model="bankCard" style="width: 255px">
                    <Option v-for="item in cardList" :value="item.card_id" :key="item.card_id">{{ item.bank_account }}
                    </Option>
                </Select>
            </div>
            <div class="item">
                <div class="text">提现金额:</div>
                <InputNumber v-model="price" placeholder="输入金额" :max="9999999" :min="0" style="width: 255px"/>
            </div>
            <div class="item">
                <div class="text">提现密码:</div>
                <InputNumberList @change="handlePwdChange" :numberLen="6"/>
            </div>
        </div>
        <div class="btn-group">
            <button type="button" @click="withdrawHandle">立即提现</button>
        </div>
    </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import InputNumberList from '../../../common/base/inputNumberList/InputNumberList'

  export default {
    name: "withdraw",
    data() {
      return {
        userInfo: '',
        bankCard: '',
        cardList: [],
        price: 0,
        passwordList: []
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['GET_USER_BANK_LIST', 'WITHDRAW_REQ']),
      handlePwdChange(val) {
        this.passwordList = val;
      },
      withdrawHandle() {
        this.WITHDRAW_REQ({
          card_id: this.bankCard,
          amount: this.price,
          withdraw_password: this.passwordList.join('')
        }).then(res => {
          this.bankCard = ''
          this.price = ''
          this.passwordList = []
        })
      },
      _initPage() {
        this.GET_USER_BANK_LIST().then(res => {
          this.cardList = res.data
        });
        this.userInfo = this.$store.state.user.userInfo;
      }
    },
    components: {
      InputNumberList
    }
  }
</script>

<style scoped lang="scss">
    .withdraw-wrapper {
        width: 100%;
        min-height: 500px;
        padding: 14px 28px 20px;
        .account-balance {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            height: 26px;
            padding-left: 11px;
            margin-bottom: 18px;
            .text {
                margin-right: 12px;
                font-size: $font-size-medium;
                color: $color-black;
            }
            .value {
                margin-right: 15px;
                font-size: $font-size-medium-x;
                font-weight: bold;
                color: $color-theme;
                .unit {
                    font-size: $font-size-small-s;
                    font-weight: normal;
                    vertical-align: middle;
                }
            }
            .transfer-btn {
                width: 68px;
                height: 26px;
                line-height: 26px;
                border-radius: 15px;
                border: 1px solid $theme-color;
                text-align: center;
                font-size: $font-size-small;
                color: $theme-color;
                background-color: #ffffff;
                transition: all .3s linear;
                &:hover {
                    border: 1px solid transparent;
                    color: $color-white;
                    background-color: $theme-color;
                }
            }
        }
        .other-balances-group {
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            align-items: center;
            padding-bottom: 15px;
            margin-bottom: 20px;
            border-bottom: 1px solid $border-color-gary;
            .item {
                max-width: 20%;
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-items: center;
                padding: 0 16px;
                border-right: 1px solid $border-color-gary;
                box-sizing: border-box;
                .text {
                    margin-right: 8px;
                    font-size: $font-size-small;
                    color: $color-dark;
                }
                .value {
                    color: $color-theme;
                    .unit {
                        font-size: $font-size-small-s;
                    }
                    .number {
                        font-size: $font-size-medium;
                    }
                }
                &:first-child {
                    padding-left: 11px;
                    justify-content: flex-start;
                }
                &:last-child {
                    border-right: none;
                }
            }
        }
        .form-group {
            width: 400px;
            margin: 0 auto 40px;
            .item {
                display: flex;
                flex-flow: row nowrap;
                justify-items: flex-start;
                align-items: center;
                margin-bottom: 12px;
                .text {
                    flex: 0 0 80px;
                    margin-right: 13px;
                    text-align: right;
                    font-size: $font-size-medium;
                    color: $color-black;
                }
                .value {
                    font-size: $font-size-medium;
                    color: $color-gary;
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
</style>

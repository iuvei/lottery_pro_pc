<template>
    <div class="transfer-wrapper">
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
                <div class="text">转出:</div>
                <Select v-model="transferIn_value" @on-change="getTransferInHandle" style="width: 220px">
                    <Option v-for="item in transferInList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </div>
            <div class="item">
                <div class="text">转入:</div>
                <Select v-model="transferOut_value" @on-change="getTransferOutHandle" style="width: 220px">
                    <Option v-for="item in transferOutList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </div>
            <div class="item">
                <div class="text">转账金额:</div>
                <InputNumber v-model="transferMoney" placeholder="输入金额" :max="9999999" :min="0" style="width: 220px"/>
            </div>
        </div>
        <div class="btn-group">
            <button type="button" class="submit-btn">确定转换</button>
            <button type="button" class="revert-btn">一键归集</button>
        </div>
    </div>
</template>

<script>
  export default {
    name: "transfer",
    data() {
      return {
        transferIn_value: '',
        transferOut_value: '',
        transferBaseList: ['彩票', '体育', '视讯', '捕鱼', '老虎机'],
        transferInList: [],
        transferOutList: [],
        transferMoney: 0,
        userInfo: ''
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      getTransferInHandle(data) {
        let list = this.transferBaseList
        if (data === '彩票') {
          this.transferOutList = list.filter(item => {
            return item !== '彩票'
          })
        } else {
          this.transferOutList = ['彩票']
        }
      },
      getTransferOutHandle(data) {
        let list = this.transferBaseList
        if (data === '彩票') {
          this.transferInList = list.filter(item => {
            return item !== '彩票'
          })
        } else {
          this.transferInList = ['彩票']
        }

      },
      _initPage() {
        this.userInfo = this.$store.state.user.userInfo;
        this.transferInList = [...this.transferBaseList]
        this.transferOutList = [...this.transferBaseList]
      }
    }
  }
</script>

<style scoped lang="scss">
    .transfer-wrapper {
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
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            .submit-btn {
                margin-bottom: 20px;
                @include button-submit-base
            }
            .revert-btn {
                @include button-submit-base;
                border: 1px solid $color-theme;
                background: $color-white;
                color: $color-theme;
                box-shadow: none;
                &:hover {
                    background: $color-white;
                }
            }
        }
    }
</style>

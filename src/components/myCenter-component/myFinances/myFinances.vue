<template>
    <div class="myFinances-wrapper">
         <div class="pay-type-box">
             <router-link class="item active" to="/my/finances/recharge">充值</router-link>
             <router-link class="item" to="/my/finances/withdraw">提现</router-link>
             <router-link class="item" to="/my/finances/transfer">转账中心</router-link>
             <router-link class="item" to="/my/finances/bankCardManage">银行卡</router-link>
         </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "myFinances"
    }
</script>

<style scoped lang="scss">
    .myFinances-wrapper {
        width: 100%;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        box-sizing: border-box;
        .pay-type-box {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: flex-end;
            width: 100%;
            height: 59px;
            padding: 0 28px;
            border-bottom: 1px solid $border-color-gary;
            .item {
                position: relative;
                top: 1px;
                height: 37px;
                margin-right: 68px;
                border-bottom: 1px solid $border-color-gary;
                font-size: 16px;
                font-weight: bold;
                color: $color-black;
                &.router-link-active {
                    color: $color-theme;
                    border-bottom: 2px solid $color-theme;
                }
            }
        }
    }
</style>

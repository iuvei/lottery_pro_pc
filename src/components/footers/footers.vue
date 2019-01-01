<template>
    <div class="footer">
        <div class="container">
            <div class="footer-top">
                <div class="module-group wanyou">
                    <div class="logo"></div>
                    <div class="promise"></div>
                </div>
                <div class="module-group">
                    <div class="module-title">
                        <span class="icon icon-account"></span>
                        <span class="text">账户相关</span>
                    </div>
                    <ul class="list">
                        <li class="item"><router-link to="/help/normal?id=391303315525891" tag="a">如何注册账号</router-link></li>
                        <li class="item"><router-link to="/help/normal?id=391303324864771" tag="a">如何找回登录密码</router-link></li>
                        <li class="item"><router-link to="" tag="a">如何修改真实姓名</router-link></li>
                    </ul>
                </div>
                <div class="module-group">
                    <div class="module-title">
                        <span class="icon icon-recharge"></span>
                        <span class="text">充值购彩</span>
                    </div>
                    <ul class="list">
                        <li class="item"><router-link to="/help/normal?id=391303399716867" tag="a">如何进行充值</router-link></li>
                        <li class="item"><router-link to="" tag="a">如何购买彩票</router-link></li>
                        <li class="item"><router-link to="/help/normal?id=391303420399107" tag="a">如何查询购彩记录</router-link></li>
                        <li class="item"><router-link to="" tag="a">充值没到账怎么办</router-link></li>
                    </ul>
                </div>
                <div class="module-group">
                    <div class="module-title">
                        <span class="icon icon-exchange"></span>
                        <span class="text">兑换提款</span>
                    </div>
                    <ul class="list">
                        <li class="item"><router-link to="/help/normal?id=391303469185283" tag="a" >如何进行提款</router-link></li>
                        <li class="item"><router-link to="/help/normal?id=391303476686083" tag="a" >提款是否收手续费</router-link></li>
                        <li class="item"><router-link to="/help/normal?id=391303530409731" tag="a" >提款不成功怎么办</router-link></li>
                    </ul>
                </div>
                <div class="module-group">
                    <div class="module-title">
                        <span class="icon icon-customer-service"></span>
                        <span class="text">在线客服</span>
                    </div>
                    <ul class="list kefu-online">
                        <li class="item"><a href="#">QQ在线客服</a></li>
                        <li class="item">在线咨询时间: 7*24小时</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="copyright">2009-2018 CPW彩票 | 彩票网站： www.CPW.com | ALL Rights Reserved 免费客服热线：4006-888-206 (7x24小时)</div>
                <div class="tips">CPW郑重提示： 彩票有风险，投注需谨慎！不向未满18周岁的未成年出售彩票</div>
                <!--<div class="supervise-group">-->
                    <!--<div class="item"></div>-->
                    <!--<div class="item"></div>-->
                    <!--<div class="item"></div>-->
                    <!--<div class="item"></div>-->
                <!--</div>-->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "footers"
    }
</script>

<style scoped lang="scss">
    .footer {
        width: 100%;
        border-top: 2px solid $theme-color;
        background-color: #ffffff;
        .footer-top {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: stretch;
            padding-bottom: 25px;
            border-bottom: 1px solid $border-color-gary;
            .module-group {
                width: 20%;
                padding-top: 36px;
                box-sizing: border-box;
                text-align: center;
                .module-title {
                    width: 100%;
                    margin-bottom: 22px;
                    .icon {
                        display: inline-block;
                        width: 22px;
                        height: 22px;
                        margin-right: 11px;
                        vertical-align: middle;
                        &.icon-account {
                            background: url("/static/images/account.png") no-repeat center center;
                            background-size: contain;
                        }
                        &.icon-recharge {
                            background: url("/static/images/recharge.png") no-repeat center center;
                            background-size: contain;
                        }
                        &.icon-exchange {
                            background: url("/static/images/exchange.png") no-repeat center center;
                            background-size: contain;
                        }
                        &.icon-customer-service {
                            background: url("/static/images/customer-service.png") no-repeat center center;
                            background-size: contain;
                        }
                    }
                    .text {
                        font-size: $font-size-medium-x;
                        color: $color-dark;
                        vertical-align: middle;
                    }
                }
                .list {
                    width: 100%;
                    padding: 8px 0;
                    border-left: 1px solid $border-color-gary;
                    &.kefu-online {
                        .item:first-child {
                            margin-bottom: 62px;
                        }
                        .item:last-child {
                            padding-bottom: 11px;
                        }
                    }
                    .item {
                        margin-bottom: 15px;
                        font-size: $font-size-medium;
                        color: $color-gary;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        a {
                            font-size: $font-size-medium;
                            color: $color-gary;
                            &:hover {
                                color: $color-black;
                            }
                        }
                    }
                }
                &.wanyou {
                    padding-top: 30px;
                    .logo {
                        width: 141px;
                        height: 29px;
                        margin: 0 auto 20px;
                        background: url("/static/images/footer-logo.png") no-repeat center center;
                        background-size: contain;
                    }
                    .promise {
                        width: 104px;
                        height: 120px;
                        margin: 0 auto;
                        background: url("/static/images/promise.png") no-repeat center center;
                        background-size: contain;
                    }
                }
            }
        }
        .footer-bottom {
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
            font-size: $font-size-small;
            color: $color-dark;
            .copyright {
                margin-bottom: 12px;
            }
            .tips {
                margin-bottom: 20px;
            }
            .supervise-group {

            }
        }
    }
</style>

<template>
    <div>
        <div class="activity-wrapper" ref="wrapper">
            <div class="container">
                <div class="activity-group">
                    <div class="activity-content">
                        <div class="title">新颖彩种</div>
                        <div class="text">加入万游彩票，荣升VIP会员，尊享全网最高权限，即刻起享受您的专属特权，从现在开始撒hi哈斯等哈说多了</div>
                        <div class="other">
                            <span class="time">活动时间：全年时间</span>
                            <span class="findDetail">查看详情</span>
                        </div>
                        <!--<span class="new-active">最新优惠</span>-->
                    </div>
                    <div class="activity-adv"></div>
                </div>
                <div class="activity-group">
                    <div class="activity-content">
                        <div class="title">新颖彩种</div>
                        <div class="text">加入万游彩票，荣升VIP会员，尊享全网最高权限，即刻起享受您的专属特权，从现在开始撒hi哈斯等哈说多了</div>
                        <div class="other">
                            <span class="time">活动时间：全年时间</span>
                            <span class="findDetail">查看详情</span>
                        </div>
                        <!--<span class="new-active">最新优惠</span>-->
                    </div>
                    <div class="activity-adv"></div>
                </div>
                <div class="activity-group">
                    <div class="activity-content">
                        <div class="title">新颖彩种</div>
                        <div class="text">加入万游彩票，荣升VIP会员，尊享全网最高权限，即刻起享受您的专属特权，从现在开始撒hi哈斯等哈说多了</div>
                        <div class="other">
                            <span class="time">活动时间：全年时间</span>
                            <span class="findDetail">查看详情</span>
                        </div>
                        <!--<span class="new-active">最新优惠</span>-->
                    </div>
                    <div class="activity-adv"></div>
                </div>
            </div>
        </div>
        <footers></footers>
    </div>
</template>

<script>
    import Footers from '../components/footers/footers'
    import {getContentHeight} from "../common/js/common";

    export default {
        name: "activity",
        data() {
            return {

            }
        },
        created() {
            this._initPage()
        },
        methods: {
            _initPage() {
                this.$nextTick(() => {
                    let contentHeight = getContentHeight()
                    this.$refs.wrapper.style.minHeight = contentHeight + 'px'
                })
            }
        },
        components: {
            Footers
        }
    }
</script>

<style scoped lang="scss">
    .activity-wrapper {
        padding: 20px 0 40px;
        .activity-group {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            height: 200px;
            margin-bottom: 20px;
            box-shadow: 0 3px 3px #dfe2ed;
            border-radius: 5px;
            background-color: #ffffff;
            animation: fadeInLeft .8s;
            &:last-child {
                margin-bottom: 0;
            }
            .activity-content {
                position: relative;
                flex: 0 0 310px;
                width: 310px;
                padding: 25px 15px 15px;
                box-sizing: border-box;
                .title {
                    margin-bottom: 18px;
                    text-align: center;
                    font-size: 26px;
                    font-weight: bold;
                    color: $color-theme;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .text {
                    line-height: 1.8;
                    margin-bottom: 10px;
                    font-size: $font-size-medium;
                    color: $color-dark;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                }
                .other {
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: space-between;
                    align-items: center;
                    .time {
                        flex: 1;
                        margin-right: 10px;
                        font-size: $font-size-medium-x;
                        color: $color-black;
                    }
                    .findDetail {
                        flex: 0 0 85px;
                        width: 85px;
                        height: 28px;
                        line-height: 28px;
                        border-radius: 3px;
                        text-align: center;
                        font-size: $font-size-medium;
                        color: $color-white;
                        background-color: $color-theme;
                        cursor: pointer;
                    }
                }
                .new-active {
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
            .activity-adv {
                flex: 1;
                height: 100%;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                background-color: #999999;
            }
        }
    }

    @keyframes fadeInLeft {
        0% {
            opacity: 0;
            transform: translate3d(-100%,0,0)
        }

        to {
            opacity: 1;
            transform: none
        }
    }
</style>

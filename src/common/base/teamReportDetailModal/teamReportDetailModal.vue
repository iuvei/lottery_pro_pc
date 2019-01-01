<template>
    <div v-show="displayModal">
        <div class="detail-wrapper">
            <div class="detail-title">
                <span class="text">报表详情 - 代理 {{info.user}}</span>
                <span @click="closeModalHandle" class="iconfont icon-buoumaotubiao20"></span>
            </div>
            <div class="content">
                <div class="list-title">团队报表</div>
                <ul class="list team-list">
                    <li class="item" v-for="(item,index) in info.teamList" :key="index">
                        <div class="text">{{item.title}}</div>
                        <div class="value " :class="index === 0?'text-red':''">{{item.value}}</div>
                    </li>
                </ul>
                <div class="divide-line"></div>
                <div class="list-title">个人报表</div>
                <ul class="list self-list">
                    <li class="item" v-for="(item,index) in info.selfList" :key="index">
                        <div class="text">{{item.title}}</div>
                        <div class="value " :class="index === 0?'text-red':''">{{item.value}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="mask" v-show="mask"></div>
    </div>
</template>

<script>
  export default {
    name: "teamReportDetailModal",
    props: {
      mask: {
        type: Boolean,
        default: true
      },
      displayModal: {
        type: Boolean,
        default: false
      },
      info: {}
    },
    methods: {
      closeModalHandle() {
        this.$emit('closeModal');
      },
    }
  }
</script>

<style scoped lang="scss">
    .detail-wrapper {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 8px;
        background-color: #ffffff;
        box-shadow: 0 0 14px #A4A6BC;
        z-index: 9999;
        width: 365px;
        height: 520px;
        overflow-y: auto;
        .text-red {
            color: $color-theme;
        }
        .detail-title {
            width: 100%;
            height: 44px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            padding: 0 11px 0 20px;
            background-color: #edeff5;
            .text {
                font-size: $font-size-medium;
                font-weight: bold;
                color: $color-dark;
            }
            .iconfont {
                padding: 5px;
                font-size: 16px;
                cursor: pointer;
            }
        }
        .content {
            width: 100%;
            padding: 12px 20px;
            .list-title {
                margin-bottom: 16px;
                font-size: $font-size-medium-x;
                font-weight: bold;
                color: $color-black;
            }
            .list {
                .item {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 17px;
                    font-size: $font-size-medium;
                    .text {
                        flex: 0 0 100px;
                        margin-right: 10px;
                        color: $color-dark;
                    }
                    .value {
                        flex: 1;
                        padding-right: 5px;
                        text-align: right;
                        color: $color-black;
                        &.text-red {
                            color: $color-theme;
                        }
                    }
                }
            }
            .divide-line {
                width: 100%;
                height: 1px;
                margin-bottom: 22px;
                background-color: $border-color-gary;
            }
        }
    }

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
</style>

<template>
    <div v-show="displayModal">
        <div class="detail-wrapper">
            <div class="detail-group group">
                <div class="group-title">
                    <span class="text">注单明细</span>
                    <span @click="closeModalHandle" class="iconfont icon-buoumaotubiao20"></span>
                </div>
                <div class="content">
                    <table class="table">
                        <tr v-for="(item, index) in orderDetailList" :key="index">
                            <td class="title">{{item.title}}</td>
                            <td class="value"><div class="text" :class="index === 11 || index === 13 ? 'text-red':''">{{item.value}}</div></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="mask" v-show="mask"></div>
    </div>
</template>

<script>
    export default {
        name: "detailModal",
        props: {
            mask: {
                type: Boolean,
                default: true
            },
            displayModal: {
                type: Boolean,
                default: false
            },
            orderDetailList: {
                type: Array,
                default: function () {
                    return []
                }
            }
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
        .text-red {
            color: $color-theme;
        }
        .group {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 0 0 14px #A4A6BC;
            z-index: 9999;
            .group-title {
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
            &.detail-group {
                width: 448px;
                .content {
                    width: 100%;
                    padding: 20px;
                    .table {
                        width: 100%;
                        tr th,  tr td { border:1px solid $border-color-gary; }
                        tr {
                            height: 37px;
                            line-height: 37px;
                            .title {
                                width: 115px;
                                padding: 0 20px;
                                font-size: $font-size-medium;
                                color: $color-dark;
                                background-color: #fafbff;
                            }
                            .value {
                                padding: 0 20px;
                                text-align: right;
                                .text {
                                    line-height: 1.3;
                                    padding: 10px 0;
                                    font-size: $font-size-medium;
                                    color: $color-black;
                                    word-break: break-all;
                                    &.text-red {
                                        color: $color-theme;
                                    }
                                }
                            }
                        }
                    }
                }
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

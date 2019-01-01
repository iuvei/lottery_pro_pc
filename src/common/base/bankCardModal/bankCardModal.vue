<template>
    <div v-show="displayModal">
        <div class="bankCard-wrapper">
            <div class="addBankCard-group group">
                <div class="group-title">
                    <span class="text">添加银行卡</span>
                    <span @click="closeModalHandle" class="iconfont icon-buoumaotubiao20"></span>
                </div>
                <div class="content">
                    <div class="input-group">
                        <div class="text">选择银行</div>
                        <div class="value">
                            <Select v-model="bankName" placrholder="点击选择银行">
                                <Option v-for="item in bankList" :value="`${item.code}`" :key="item.code">{{item.name}}</Option>
                            </Select>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="text">卡号</div>
                        <div class="value">
                            <Input v-model="bankCardNum" placeholder="输入卡号" :maxlength="20"/>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="text">确认卡号</div>
                        <div class="value">
                            <Input v-model="bankCardNumAgain" placeholder="确认输入卡号" :maxlength="20"/>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="text">开户行</div>
                        <div class="value">
                            <Input v-model="bankAddress" placeholder="请输入银行卡对应开户行" :maxlength="50"/>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="add-btn" @click="bankCardSubmit">确认添加</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="mask" v-show="mask"></div>
    </div>
</template>

<script>
    export default {
        name: "bankCardModal",
        props: {
            mask: {
                type: Boolean,
                default: true
            },
            displayModal: {
                type: Boolean,
                default: false
            },
            bankList: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                bankName: '',  //  /*  选中的银行
                bankCardNum: '',   //      银行卡号
                bankCardNumAgain: '',  //  确认银行卡
                bankAddress: '',   //       开户行  */
            }
        },
        created() {
        },
        methods: {
            closeModalHandle() {
                this.bankName = ''
                this.bankCardNum = ''
                this.bankCardNumAgain = ''
                this.bankAddress = ''
                this.$emit('closeModal');
            },
            bankCardSubmit() {
                let data = {
                    bankName: this.bankName,
                    bankCardNum: this.bankCardNum,
                    bankCardNumAgain: this.bankCardNumAgain,
                    bankAddress: this.bankAddress
                };
                this.$emit('bankCardSubmit', data)
            }
        }
    }
</script>

<style scoped lang="scss">
    .bankCard-wrapper {
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
            &.addBankCard-group {
                width: 480px;
                .content {
                    width: 100%;
                    padding: 26px 20px 34px;
                    .input-group {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: flex-start;
                        align-items: center;
                        width: 285px;
                        margin: 0 auto 10px;
                        .text {
                            flex: 70px;
                            margin-right: 15px;
                            text-align: right;
                            font-size: $font-size-medium;
                            color: $color-dark;
                        }
                        .value {
                            flex: 0 0 200px;
                            font-size: $font-size-medium;
                        }
                    }
                    .btn-group {
                        padding-top: 10px;
                        text-align: center;
                        .add-btn {
                            width: 128px;
                            height: 40px;
                            line-height: 40px;
                            border: none;
                            border-radius: 3px;
                            text-align: center;
                            font-size: $font-size-medium;
                            color: $color-white;
                            background-color: $theme-color;
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

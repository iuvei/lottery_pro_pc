<template>
    <div v-if="displayModal">
        <div class="password-wrapper">
            <div class="password-group group" v-if="modalType === 'password'">
                <div class="group-title">
                    <span class="text">设置密码</span>
                    <span @click="closeModalHandle" class="iconfont icon-buoumaotubiao20"></span>
                </div>
                <div class="content">
                    <div class="input-group">
                        <div class="text">当前密码</div>
                        <div class="value">
                            <Input v-model="oldPwd" placeholder="输入原密码" type="password"/>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="text">新密码</div>
                        <div class="value">
                            <Input v-model="newPwd" placeholder="输入新密码" type="password"/>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="text">确认密码</div>
                        <div class="value">
                            <Input v-model="againPwd" placeholder="重新输入新密码" type="password"/>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="add-btn btn" @click="passwordSubmit">确认修改</button>
                        <button type="button" class="cancel-btn btn" @click="closeModalHandle">取消</button>
                    </div>
                </div>
            </div>
            <div class="password-group group" v-if="modalType === 'withdrawPassword'">
                <div class="group-title">
                    <span class="text">设置提现密码</span>
                    <span @click="closeModalHandle" class="iconfont icon-buoumaotubiao20"></span>
                </div>
                <div class="content">
                    <div class="input-group" v-if="isSettingWithdrawPsd">
                        <div class="text">当前提现密码</div>
                        <div class="value">
                            <Input v-model="oldWDPwd" placeholder="输入原密码" type="password"/>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="text">新提现密码</div>
                        <div class="value">
                            <Input v-model="newWDPwd" placeholder="输入新密码" type="password"/>
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="text">确认提现密码</div>
                        <div class="value">
                            <Input v-model="againWDPwd" placeholder="重新输入新密码" type="password"/>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="add-btn btn" @click="withdrawPasswordSubmit">确认添加</button>
                        <button type="button" class="cancel-btn btn" @click="closeModalHandle">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="mask" v-show="mask"></div>
    </div>
</template>

<script>
  export default {
    name: "pwdModal",
    props: {
      mask: {
        type: Boolean,
        default: true
      },
      modalType: {
        type: String,
        default: ''
      },
      displayModal: {
        type: Boolean,
        default: false
      },
      isSettingWithdrawPsd: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        oldPwd: '',       //   /*  旧密码
        newPwd: '',       //       新密码
        againPwd: '',     //       确认密码  */
        oldWDPwd: '',     //       旧提现密码
        newWDPwd: '',     //       新提现密码
        againWDPwd: ''   //       确认提现密码  */
      }
    },
    methods: {
      closeModalHandle() {
        this.oldPwd = '';
        this.newPwd = '';
        this.againPwd = '';
        this.oldWDPwd = '';
        this.newWDPwd = '';
        this.againWDPwd = '';
        this.$emit('closeModal');
      },
      passwordSubmit() {
        let data = {
          oldPwd: this.oldPwd,
          newPwd: this.newPwd,
          againPwd: this.againPwd
        };
        this.$emit('passwordSubmit', data)
      },
      withdrawPasswordSubmit() {
        let data = {}
        if (this.isSettingWithdrawPsd) {
          data = {
            oldWDPwd: this.oldWDPwd,
            newWDPwd: this.newWDPwd,
            againWDPwd: this.againWDPwd
          };
        } else {
          data = {
            newWDPwd: this.newWDPwd,
            againWDPwd: this.againWDPwd
          };
        }
        this.$emit('withdrawPasswordSubmit', data)
      },
    },
    created() {
      this.oldPwd = '';
      this.newPwd = '';
      this.againPwd = '';
      this.oldWDPwd = '';
      this.newWDPwd = '';
      this.againWDPwd = '';
    },
  }
</script>

<style scoped lang="scss">
    .password-wrapper {
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
            &.password-group {
                width: 480px;
                .content {
                    width: 100%;
                    padding: 26px 20px 34px;
                    margin: 0 auto;
                    .input-group {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;
                        align-items: center;
                        /*width: 290px;*/
                        margin: 0 auto 10px;
                        .text {
                            flex: 0 0 100px;
                            margin-right: 25px;
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
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        padding-top: 10px;
                        text-align: center;
                        .btn {
                            width: 128px;
                            height: 40px;
                            line-height: 40px;
                            border-radius: 3px;
                            box-sizing: border-box;
                            text-align: center;
                            font-size: $font-size-medium;
                            &.add-btn {
                                border: none;
                                color: $color-white;
                                background-color: $theme-color;
                                &:hover {
                                    background-color: #f71b2de3;
                                }
                            }
                            &.cancel-btn {
                                margin-left: 20px;
                                border: 1px solid $border-color-gary;
                                color: $color-dark;
                                background-color: $color-white;
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
    }
</style>

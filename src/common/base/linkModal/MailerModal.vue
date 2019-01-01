<template>
    <div v-show="displayModal">
        <div class="mailer-wrapper">
            <div class="mailer-group group">
                <div class="group-title">
                    <span class="text">写信</span>
                    <span @click="closeModalHandle" class="iconfont icon-buoumaotubiao20"></span>
                </div>
                <div class="mailer-box">
                    <div class="mailer-main">
                        <div class="addressee-box">
                            <div class="text">收件人 :</div>
                            <div class="addressee-list">
                                {{linkName}}
                                <span v-if="isShowAddLinkBtn" class="iconfont icon-jiahao" @click="addLinker"></span>
                            </div>
                        </div>
                        <div class="theme-box">
                            <div class="text">主题 :</div>
                            <div class="value" v-if="defaultTitle">{{defaultTitle}}</div>
                            <input v-else class="theme-input" type="text" v-model="title">
                        </div>
                        <div class="textarea-box">
                            <textarea class="textarea" placeholder="在此输入你要发送的信息" v-model="content"></textarea>
                        </div>
                    </div>
                    <div class="mailer-bottom">
                        <button type="button" class="send-btn" @click="sendSubmitHandle">发送</button>
                        <a href="javascript:;" class="delect-btn iconfont icon-lajitong" @click="clearContentHandle"></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="mask" v-show="mask"></div>
    </div>
</template>

<script>
  export default {
    name: "MailerModal",
    props: {
      mask: {
        type: Boolean,
        default: true
      },
      displayModal: {
        type: Boolean,
        default: false
      },
      defaultTitle: {
        type: String,
        default: ''
      },
      linkName: {
        type: String,
        default: ''
      },
      linkId: {},
      isShowAddLinkBtn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        title: '',
        content: ''
      }
    },
    methods: {
      closeModalHandle() {
        this.title = ''
        this.content = ''
        this.$emit('closeModal');
      },
      addLinker() {
        this.$emit('addLinker')
      },
      sendSubmitHandle() {
        let data = {
          user: this.linkId,
          title: this.defaultTitle ? this.defaultTitle : this.title,
          content: this.content
        }
        this.$emit('sendSubmit', data)
      },
      clearContentHandle() {
        this.title= ''
        this.content= ''
      }
    }
  }
</script>

<style scoped lang="scss">
    .mailer-wrapper {
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
            &.mailer-group {
                width: 880px;
                .mailer-box {
                    width: 820px;
                    border: 1px solid $border-color-gary;
                    border-radius: 5px;
                    margin: 30px;
                    box-shadow: 0 4px 4px #e6e8f1;
                    box-sizing: border-box;
                    .mailer-main {
                        padding: 0 62px 0 15px;
                        .addressee-box {
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: flex-start;
                            align-items: center;
                            height: 43px;
                            .text {
                                flex: 0 0 52px;
                                text-align: right;
                                font-size: $font-size-medium;
                                color: $color-black;
                            }
                            .addressee-list {
                                position: relative;
                                flex: 1;
                                height: 43px;
                                line-height: 43px;
                                padding-left: 20px;
                                border-bottom: 1px solid $border-color-gary;
                                font-weight: bold;
                                .iconfont {
                                    position: absolute;
                                    top: 50%;
                                    right: 0;
                                    transform: translateY(-50%);
                                    padding: 5px 0 5px 5px;
                                    font-size: $font-size-large;
                                    cursor: pointer;
                                }
                            }
                        }
                        .theme-box {
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: flex-start;
                            align-items: center;
                            .text {
                                flex: 0 0 52px;
                                text-align: right;
                                font-size: $font-size-medium;
                                color: $color-black;
                            }
                            .value {
                                flex: 1;
                                height: 43px;
                                line-height: 43px;
                                padding-left: 20px;
                                border-bottom: 1px solid $border-color-gary;
                                font-size: $font-size-medium;
                                color: $color-black;
                            }
                            .theme-input {
                                flex: 1;
                                height: 43px;
                                border: none;
                                padding-left: 20px;
                                border-bottom: 1px solid $border-color-gary;
                                font-size: $font-size-medium;
                                color: $color-black;
                            }
                        }
                        .textarea-box {
                            margin: 12px 0 18px;
                            padding-left: 52px;
                            .textarea {
                                width: 100%;
                                height: 190px;
                                resize: none;
                                font-size: $font-size-medium;
                                color: $color-black;
                            }
                        }
                    }
                    .mailer-bottom {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        align-items: center;
                        border-top: 1px solid $border-color-gary;
                        height: 49px;
                        padding: 0 25px 0 15px;
                        .send-btn {
                            width: 78px;
                            height: 34px;
                            line-height: 34px;
                            border: none;
                            background: $gradient-color;
                            font-size: $font-size-medium;
                            color: $color-white;
                        }
                        .delect-btn {
                            padding: 10px;
                            color: #595b64;
                            font-size: 26px;
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

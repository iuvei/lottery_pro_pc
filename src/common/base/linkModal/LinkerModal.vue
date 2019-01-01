<template>
    <div v-show="displayModal">
        <div class="contact-wrapper">
            <div class="contact-group group">
                <div class="group-title">
                    <span class="text">选择联系人</span>
                    <span @click="closeModalHandle" class="iconfont icon-buoumaotubiao20"></span>
                </div>
                <div class="content">
                    <div class="contact-box">
                        <div class="contact-top">
                            <Checkbox class="checkbox-btn" :value="checkAll" @click.prevent.native="handleCheckAll"> 全员
                            </Checkbox>
                            <Select v-model="filterType" style="width:200px" @on-change="selectedItemHanle">
                                <Option value="all">全部</Option>
                                <Option value="0">会员</Option>
                                <Option value="1">代理</Option>
                            </Select>
                        </div>
                        <div class="contact-content">
                            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                <div class="contact-item" v-for="item in linkList" :key="item.id">
                                    <Checkbox :label="`${item.id}&&${item.username}`" class="checkbox-btn"> {{item.username}}</Checkbox>
                                </div>
                            </CheckboxGroup>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="confirm-btn" type="button" @click="confirmHandle">确定</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="mask" v-show="mask"></div>
    </div>
</template>

<script>
  export default {
    name: "LinkerModal",
    props: {
      mask: {
        type: Boolean,
        default: true
      },
      displayModal: {
        type: Boolean,
        default: false
      },
      linkList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    created() {
      this.userNameList = this.linkList.map(item => {
        return item.username
      })
    },
    data() {
      return {
        checkAll: false,
        checkAllGroup: [],
        filterType: 'all',
        userNameList: []
      }
    },
    methods: {
      closeModalHandle() {
        this.$emit('closeModal');
      },
      selectedItemHanle(value) {
        this.checkAll = false
        this.checkAllGroup = []
        this.$emit('filterListHandle', value);
      },
      /* 全选和单选 */
      handleCheckAll () {
        this.checkAll = !this.checkAll
        if (this.checkAll) {
          this.checkAllGroup = this.linkList.map(item => {
            return `${item.id}&&${item.username}`
          })
        } else {
          this.checkAllGroup = [];
        }
      },
      checkAllGroupChange (data) {
        if (data.length === this.linkList.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      },
      confirmHandle() {
        let userList = []
        let idList = []
        this.checkAllGroup.forEach(item => {
          let value = item.split("&&")
          idList.push(value[0])
          userList.push(value[1])
        })
        this.$emit('confirmLinkHandle', {
          userList: userList,
          idList: idList
        });
      }
    }
  }
</script>

<style lang="scss">
    .contact-wrapper {
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
            &.contact-group {
                width: 680px;
                .content {
                    padding-bottom: 20px;
                    .contact-box {
                        width: 100%;
                        .contact-top {
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: space-between;
                            align-items: center;
                            width: 100%;
                            height: 54px;
                            padding: 0 20px;
                            border-bottom: 1px solid $border-color-gary;
                        }
                        .contact-content {
                            padding: 0 20px;
                            .contact-item {
                                width: 100%;
                                height: 44px;
                                line-height: 44px;
                                border-bottom: 1px solid $border-color-gary;
                                .checkBox-btn {
                                    >span {
                                        &:last-child {
                                            display: none;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .btn-group {
                        margin-top: 30px;
                        text-align: right;
                        .confirm-btn {
                            width: 80px;
                            height: 35px;
                            line-height: 35px;
                            border: none;
                            border-radius: 5px;
                            text-align: center;
                            font-size: $font-size-large;
                            color: #ffffff;
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

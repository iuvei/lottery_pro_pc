<template>
    <div class="pay-wrapper">
        <div class="wrapper-title">
            <span class="text">{{data.typeName}}</span>
        </div>
        <div class="content">
            <div class="msg-group" v-if="data.list.length" v-for="item in data.list" :key="item.id"
                 :class="showContentId === item.id ? 'selected':''">
                <div class="msg-title" @click="showContentHandle(item.id)">{{item.question}}</div>
                <div class="msg-content">
                    <div v-html="item.answer"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import normalList from '../../common/config/help/pay'

  export default {
    name: "pay",
    data() {
      return {
        showContentId: '',
        data: ''
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      showContentHandle(id) {
        this.showContentId = id
      },
      _initPage() {
        this.data = normalList
      }
    },
  }
</script>

<style scoped lang="scss">
    .pay-wrapper {
        width: 100%;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        box-sizing: border-box;
        .wrapper-title {
            width: 100%;
            height: 59px;
            padding: 0 28px;
            border-bottom: 1px solid $border-color-gary;
            .text {
                position: relative;
                top: 1px;
                display: inline-block;
                height: 100%;
                line-height: 59px;
                border-bottom: 2px solid $color-theme;
                font-size: $font-size-medium-x;
                font-weight: bold;
                color: $color-theme;
            }
        }
        .content {
            width: 100%;
            padding: 22px 30px;
            .msg-group {
                margin-bottom: 5px;
                &.selected {
                    .msg-title {
                        color: $color-theme;
                    }
                    .msg-content {
                        /*height: 92px;*/
                        display: block;
                    }
                }
                .msg-title {
                    line-height: 1.5;
                    margin-bottom: 8px;
                    font-size: $font-size-medium;
                    color: $color-black;
                    cursor: pointer;
                    &:hover {
                        color: $color-theme;
                    }
                }
                .msg-content {
                    display: none;
                    /*height: 0;*/
                    /*transition: all .3s linear;*/
                    /*overflow: hidden;*/
                    >div {
                        padding: 10px;
                        line-height: 2;
                        font-size: $font-size-small;
                        color: $color-dark;
                        background-color: #fafbff;
                        table {
                            width: 500px!important;
                            tr, td {
                                border: 1px solid $border-color-gary;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

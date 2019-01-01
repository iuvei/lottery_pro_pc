<template>
    <div class="mailer-list-message-wrapper">
        <div class="wrapper-title">
            <router-link to="/my/mailerlist" tag="span">站内信 <i class="iconfont icon-jiantou"></i></router-link>
            来自 {{fromName}} 的消息
        </div>
        <div class="content">
            <div class="news-group" v-for="item in messageList" :key="item.id">
                <div class="news-top">
                    <span class="text" v-if="item.from_username == selfName">发给 <span class="text-red">{{item.to_username}}</span> 消息</span>
                    <span class="text" v-else>来自 <span class="text-red">{{item.from_username}}</span> 消息</span>
                    <span class="date">{{item.create_time}}</span>
                </div>
                <div class="news-title">主题：{{item.title}}</div>
                <div class="news-content">
                    {{item.content}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: "mailer-list-message",
    data() {
      return {
        messageList: [],
        fromName: '',
        selfName: ''
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['FIND_MESSAGE']),
      _initPage(){
        this.FIND_MESSAGE({
          type: this.$route.query.type,
          id: this.$route.query.id
        }).then(res => {
          this.messageList = res.data.list
          this.selfName = this.$store.state.user.userInfo.username
          this.fromName = res.data.list[0].from_username
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .mailer-list-message-wrapper {
        width: 100%;
        min-height: 400px;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        box-sizing: border-box;
        .wrapper-title {
            width: 100%;
            height: 59px;
            line-height: 59px;
            padding: 0 30px 0 28px;
            border-bottom: 1px solid $border-color-gary;
            font-size: $font-size-medium-x;
            color: $color-dark;
            span {
                margin-right: 8px;
                font-weight: bold;
                color: $color-black;
                cursor: pointer;
            }
        }
        .content {
            width: 100%;
            padding: 0 28px 45px 28px;
            .news-group {
                padding: 14px 0 32px;
                border-bottom: 1px solid $border-color-gary;
                cursor: pointer;
                .news-top {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    .text {
                        flex: 1;
                        font-size: $font-size-medium-x;
                        font-weight: bold;
                        color: $color-black;
                        .text-red {
                            color: $color-theme;
                        }
                    }
                    .date {
                        flex: 0 0 150px;
                        text-align: right;
                        font-size: $font-size-medium;
                        color: $color-dark;
                    }
                }
                .news-title {
                    margin-bottom: 10px;
                    font-size: $font-size-medium;
                    color: $color-black;
                }
                .news-content {
                    /*height: 52px;*/
                    line-height: 2;
                    font-size: $font-size-medium;
                    color: $color-dark;
                    /*display: -webkit-box;*/
                    /*-webkit-box-orient: vertical;*/
                    /*-webkit-line-clamp: 2;*/
                    /*overflow: hidden;*/
                }
            }
        }
    }
</style>

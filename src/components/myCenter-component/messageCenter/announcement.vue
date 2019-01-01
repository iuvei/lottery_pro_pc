<template>
    <div class="announcement-wrapper">
        <div class="wrapper-title">
            <span class="text">系统公告</span>
        </div>
        <div class="content">
            <div class="news-group" v-if="messageList.length" v-for="item in messageList" :key="item.create_time">
                <div class="news-top">
                    <span class="text">{{item.title}}</span>
                    <span class="date">{{item.create_time}}</span>
                </div>
                <div class="news-content" v-html="item.note"></div>
            </div>
            <div class="no-data" v-if="!messageList.length">
                <div class="iconfont icon-zanwushuju"></div>
                <div class="text">暂无消息</div>
            </div>
            <!--<div class="pagination">-->
                <!--<Page :total="100" show-elevator style="font-size: 12px"/>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        name: "announcement",
        data() {
            return {
                messageList: []
            }
        },
        created() {
            this._initPage()
        },
        methods: {
            ...mapActions(['GET_NOTICE_LIST']),
            _initPage() {
                this.GET_NOTICE_LIST().then(res => {
                    this.messageList = res.data
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .announcement-wrapper {
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
            min-height: 400px;
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
                    }
                    .date {
                        flex: 0 0 150px;
                        text-align: right;
                        font-size: $font-size-medium;
                        color: $color-dark;
                    }
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
            .pagination {
                margin-top: 50px;
                text-align: right;
            }
            .no-data {
                padding-top: 50px;
                text-align: center;
                color: $color-gary;
                .iconfont {
                    margin-bottom: 10px;
                    font-size: 24px;
                }
                .text {
                    font-size: $font-size-medium-x;
                }
            }
        }
    }
</style>

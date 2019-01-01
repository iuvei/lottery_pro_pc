<template>
    <div class="mailer-list-wrapper">
        <div class="wrapper-title">
            <span class="text">站内信</span>
            <div class="btn-group">
                <button type="button" class="receive-btn btn-item" :class="mailerListStatus === 0?'selected':''" @click="showMailerListTab(0)">收件箱</button>
                <button type="button" class="mySend-btn btn-item" :class="mailerListStatus === 1?'selected':''" @click="showMailerListTab(1)">已发邮箱</button>
                <button type="button" class="send-btn btn" @click="showMailerModal('send')"><i class="iconfont icon-jiahao1"></i>发邮箱</button>
            </div>
        </div>
        <div class="content">
            <div class="function-menu">
                <div class="left-menu">
                    <Checkbox :value="checkAll" class="selectAll" @click.prevent.native="handleCheckAll"></Checkbox>
                    <span class="iconfont icon-refresh" @click="refreshBtn"></span>
                    <span class="iconfont icon-duanxinyidu" @click="readMessageHandle"></span>
                    <span class="iconfont icon-lajitong" @click="deleteMessageHandle"></span>
                    <Input size="small" search @on-search="filterTitleHandle" v-model="searchTitle" placeholder="请输入主题搜索" style="width: 150px;margin-right: 10px"/>
                    <DatePicker size="small" format="yyyy-MM-dd" @on-change="filterDateHandle" v-model="dateValue" type="daterange" placement="bottom-end" placeholder="请选择日期" style="width: 170px"></DatePicker>
                </div>
                <div class="right-menu">
                    <span class="text">第 {{nowPage}}-{{totalPage}} 行, 共 {{totalPage}} 行 </span>
                    <i class="iconfont icon-icon_arrow_left" @click="prevPageHandle"></i>
                    <i class="iconfont icon-icon_arrow_right" @click="nextPageHandle"></i>
                </div>
            </div>
            <div class="news-box">
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <router-link :to="`/my/mailermsg?id=${item.id}&type=${mailerListStatus}`" tag="div" @click.stop class="news-group" v-for="(item, index) in messageList" :key="index">
                        <div class="news-top">
                            <span @click.stop class="text-box">
                                <Checkbox :label="item.id" class="selectItem">
                                    <div class="text">{{mailerListStatus?'发给':'来自'}} <i v-if="item.is_readed == '0'" class="iconfont icon-yuandian"></i> <b class="text-red">{{mailerListStatus?item.to_username:item.from_username}}</b> 的消息</div>
                                </Checkbox>
                            </span>
                            <span class="date">{{item.create_time}}</span>
                        </div>
                        <div class="news-content">
                            {{item.content}}
                        </div>
                        <div class="toast-box" v-if="!item.is_mass">
                            <button type="button" class="reply-btn" @click.stop="showMailerModal('reply', item)">回信</button>
                        </div>
                    </router-link>
                </CheckboxGroup>
            </div>
        </div>
        <mailer-modal :mask='true' :displayModal='mailerDisplayModal' @closeModal="mailerCloseModal"
                      @addLinker="addLinker" :linkName="linkName" :default-title="defaultTitle" :linkId="linkId" :isShowAddLinkBtn="isShowAddLinkBtn" @sendSubmit="sendSubmitHandle"></mailer-modal>
        <linker-modal :mask='false'
                      :displayModal='contactDisplayModal'
                      :linkList="filterLinkList"
                      @filterListHandle="filterListHandle"
                      @confirmLinkHandle="confirmLinkHandle"
                      @closeModal="contactCloseModal">

        </linker-modal>
    </div>
</template>

<script>
  import LinkerModal from '../../../common/base/linkModal/LinkerModal'
  import MailerModal from '../../../common/base/linkModal/MailerModal'
  import { getYYYY_MM_HH } from "../../../common/js/date";
  import { Message } from 'iview'
  import { mapActions } from 'vuex'

  export default {
    name: "mailer-list",
    data() {
      return {
        mailerDisplayModal: false,
        contactDisplayModal: false,
        isShowAddLinkBtn: false,
        messageList: [],
        messageIdList: [],
        lowerList: [],
        filterLinkList: [],
        mailerListStatus: 0,
        totalPage: 1,
        nowPage: 1,
        pageSize: 10,
        checkAllGroup: [],
        selectedMessageData: '',
        defaultTitle: '',
        linkName: '',
        linkId: 0,
        checkAll: false,
        flag: '',
        // 筛选
        searchTitle: '',
        dateValue: ''
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['GET_RECEIVE_MESSAGE_LIST', 'GET_SEND_MESSAGE_LIST', 'GET_ALL_LOWER', 'REPLY_MESSAGE', 'DELECT_MESSAGE', 'SEND_MESSAGE', 'READ_MESSAGE']),
      refreshBtn() {
        this.linkToPage(1)
        this.checkAllGroup = [];
        this.checkAll = false
        this.dateValue = ''
        this.searchTitle = ''
      },
      /* 切换收发件箱 */
      showMailerListTab(id) {
        if (this.mailerListStatus === id) {
          return
        }
        this.mailerListStatus = id
        this.refreshBtn()
      },
      /* 全选和单选 */
      handleCheckAll () {
        this.checkAll = !this.checkAll
        if (this.checkAll) {
          this.checkAllGroup = this.messageIdList;
        } else {
          this.checkAllGroup = [];
        }
      },
      checkAllGroupChange (data) {
        if (data.length === this.messageIdList.length) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      },
      // 筛选
      filterTitleHandle(value) {
        this.linkToPage(1, {
          title: value,
          date_start: this.dateValue ? this.dateValue[0] : '',
          date_end: this.dateValue ? this.dateValue[1] : ''
        })
      },
      filterDateHandle(date) {
        this.linkToPage(1, {
          title: this.searchTitle,
          date_start: date[0],
          date_end: date[1]
        })
      },
      /* 筛选联系人 */
      filterListHandle(type = 'all') {
        if (type === 'all') {
          this.filterLinkList = this.lowerList
        } else {
          this.filterLinkList = this.lowerList.filter(item => {
            return item.is_agent == type
          })
        }
      },
      /* 选中联系人 */
      confirmLinkHandle(data) {
        this.linkName = data.userList.join(',')
        this.linkId = data.idList.join(',')
        this.contactDisplayModal = false
      },
      /* 关闭modal */
      mailerCloseModal() {
        this.mailerDisplayModal = false;
      },
      contactCloseModal() {
        this.contactDisplayModal = false
      },
      /* 显示modal */
      showMailerModal(flag, data) {
        this.isShowAddLinkBtn = data ? false : true
        this.flag = flag
        if (flag === 'send') {
          this.linkName = ''
          this.defaultTitle = ''
        } else {
          this.selectedMessageData = data
          this.linkName = this.mailerListStatus === 0 ? data.from_username : data.to_username
          this.linkId = this.mailerListStatus === 0 ? data.from_uid : data.to_uid
          this.defaultTitle = data.title
        }
        this.mailerDisplayModal = true
      },
      addLinker() {
        this.contactDisplayModal = true
      },
      /* 删除消息 */
      deleteMessageHandle() {
        if (!this.checkAllGroup.length) {
          Message.error('请至少选择一条消息')
          return
        }
        this.DELECT_MESSAGE({
          type: this.mailerListStatus,
          ids: this.checkAllGroup.join(',')
        }).then(res => {
          setTimeout(() => {
            this.refreshBtn()
          }, 1000)
        })
      },
      /* 已读消息 */
      readMessageHandle() {
        if (!this.checkAllGroup.length) {
          Message.error('请至少选择一条消息')
          return
        }
        this.READ_MESSAGE({
          ids: this.checkAllGroup.join(',')
        }).then(res => {
          setTimeout(() => {
            this.refreshBtn()
          }, 1000)
        })
      },
      /* 发送消息 */
      sendSubmitHandle(data) {
        if (!data.user) {
          Message.error('请选择联系人')
          return
        }
        if (!data.title) {
          Message.error('请填写主题')
          return
        }
        if (!data.content) {
          Message.error('请填写内容')
          return
        }
        if (this.flag === 'send') {
          this.SEND_MESSAGE({
            type: 0,
            to_user: data.user,
            title: data.title,
            content: data.content
          }).then(res => {
            setTimeout(() => {
              this.mailerCloseModal()
              this.contactCloseModal()
              this.refreshBtn()
            }, 1000)
          })
        } else {
          this.REPLY_MESSAGE({
            replied_id: this.selectedMessageData.id,
            type: this.selectedMessageData.type == 2? 2 : 1,
            to_user: data.user,
            title: data.title,
            content: data.content
          }).then(res => {
            setTimeout(() => {
              this.mailerCloseModal()
              this.contactCloseModal()
              this.refreshBtn()
            }, 1000)
          })
        }
      },
      // 上一页下一页
      prevPageHandle() {
        let nowPage = this.nowPage
        if (nowPage === 1) {
          Message.error('当前是第一页')
          return
        }
        this.linkToPage(nowPage - 1, {
          title: this.searchTitle,
          date_start: this.dateValue[0],
          date_end: this.dateValue[1]
        })
      },
      nextPageHandle() {
        let nowPage = this.nowPage
        if (nowPage === this.totalPage) {
          Message.error('当前是最后一页')
          return
        }
        this.linkToPage(nowPage + 1, {
          title: this.searchTitle,
          date_start: this.dateValue[0],
          date_end: this.dateValue[1]
        })
      },
      // 获取下级会员
      _getLower() {
        this.GET_ALL_LOWER().then(res => {
          this.lowerList = res.data
          this.filterListHandle()
        })
      },
      getMessageList(filter = {}) {
        if (this.mailerListStatus === 0) {
          this.GET_RECEIVE_MESSAGE_LIST({
            page: this.nowPage,
            rows: this.pageSize,
            title: filter.title ? filter.title : '',
            date_start: filter.date_start ? getYYYY_MM_HH(filter.date_start) : '',
            date_end: filter.date_end ? getYYYY_MM_HH(filter.date_end) : ''
          }).then(res => {
            let totalRows = parseInt(res.data.total_rows)
            let pageSize = parseInt(this.pageSize)
            this.totalPage = Math.ceil(totalRows / pageSize)
            this.messageList = res.data.list
            this.messageIdList = res.data.list.map(item => {
              return item.id
            })
          }).catch(e => {
            this.messageList = []
          })
        } else {
          this.GET_SEND_MESSAGE_LIST({
            page: this.nowPage,
            rows: this.pageSize,
            title: filter.title ? filter.title : '',
            date_start: filter.date_start ? getYYYY_MM_HH(filter.date_start) : '',
            date_end: filter.date_end ? getYYYY_MM_HH(filter.date_end) : ''
          }).then(res => {
            let totalRows = parseInt(res.data.total_rows)
            let pageSize = parseInt(this.pageSize)
            this.totalPage = Math.ceil(totalRows / pageSize)
            this.messageList = res.data.list
            this.messageIdList = res.data.list.map(item => {
              return item.id
            })
          }).catch(e => {
            this.messageList = []
          })
        }
      },
      linkToPage(page, data) {
        this.nowPage = page
        this.getMessageList(data)
      },
      _initPage() {
        this._getLower()
        this.linkToPage(1)
      }
    },
    components: {
      LinkerModal, MailerModal
    }
  }
</script>

<style  lang="scss">
    .mailer-list-wrapper {
        width: 100%;
        min-height: 400px;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        box-sizing: border-box;
        .wrapper-title {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
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
            .btn-group {
                .btn-item {
                    width: 88px;
                    height: 34px;
                    line-height: 34px;
                    box-sizing: border-box;
                    text-align: center;
                    font-size: $font-size-medium;
                    border: 1px solid $theme-color;
                    color: $theme-color;
                    background-color: $color-white;
                    vertical-align: middle;
                    transition: all .3s linear;
                    &.receive-btn {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }
                    &.mySend-btn {
                        border-left: 0;
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                    }
                    &:hover, &.selected {
                        border: 1px solid transparent;
                        color: $color-white;
                        background-color: $theme-color;
                    }
                }
                .btn {
                    width: 88px;
                    height: 34px;
                    line-height: 34px;
                    box-sizing: border-box;
                    text-align: center;
                    font-size: $font-size-medium;
                    vertical-align: middle;
                    margin-left: 10px;
                    border: 1px solid $theme-color;
                    color: $theme-color;
                    background-color: $color-white;
                }
            }
        }
        .content {
            width: 100%;
            padding: 0 28px 30px 26px;
            .function-menu {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                height: 40px;
                border-bottom: 1px solid $border-color-gary;
                .left-menu {
                    .selectAll {
                        margin-right: 18px;
                    }
                    .iconfont {
                        margin-right: 18px;
                        padding: 5px;
                        font-size: $font-size-large;
                        vertical-align: middle;
                        color: $color-dark;
                        cursor: pointer;
                        &:hover {
                            color: $color-black;
                        }
                    }
                }
                .right-menu {
                    .text {
                        margin-right: 20px;
                        font-size: $font-size-small;
                        color: $color-dark;
                        vertical-align: middle;
                    }
                    .iconfont {
                        font-size: $font-size-small;
                        vertical-align: middle;
                        color: $color-dark;
                        cursor: pointer;
                        &:hover {
                            color: $color-black;
                        }
                        &.icon-icon_arrow_left {
                            margin-right: 32px;
                        }
                    }
                }
            }
            .news-box {
                .news-group {
                    position: relative;
                    padding: 14px 0 25px;
                    border-bottom: 1px solid $border-color-gary;
                    cursor: pointer;
                    &:hover .toast-box {
                        opacity: 1;
                    }
                    .news-top {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                        .text-box {
                            .selectItem {
                                margin-right: 10px;
                                vertical-align: middle;
                                >span {
                                    &:last-child {
                                        display: none;
                                    }
                                }
                                .text {
                                    display: inline-block;
                                    margin-left: 10px;
                                    font-size: $font-size-medium-x;
                                    font-weight: bold;
                                    color: $color-black;
                                    vertical-align: middle;
                                    .iconfont {
                                        color: red;
                                    }
                                }
                            }
                            .text-red {
                                margin: 0 8px;
                                font-weight: bold;
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
                    .toast-box {
                        opacity: 0;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;
                        align-items: center;
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 140px;
                        height: 100%;
                        background: linear-gradient(to right, rgba(255, 255, 255, .6), rgba(255, 255, 255, 1));
                        .reply-btn {
                            width: 88px;
                            height: 34px;
                            line-height: 34px;
                            border: 1px solid $theme-color;
                            box-sizing: border-box;
                            text-align: center;
                            font-size: $font-size-medium;
                            color: $theme-color;
                            background-color: $color-white;
                            transition: all .3s linear;
                            &:hover {
                                border: 1px solid transparent;
                                color: $color-white;
                                background-color: $theme-color;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

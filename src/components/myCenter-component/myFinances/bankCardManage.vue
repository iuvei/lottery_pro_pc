<template>
    <div class="bankCardManage-wrapper">
        <div class="bankCard-group">
            <div class="bankCard-item" v-for="(item, index) in cardList">
                <div class="card-header">
                    <div class="card-type">
                        <img class="icon" :src="`/static/images/bank/${item.code}-icon@3x.png`" alt="">
                        <span class="text">{{item.name}}</span>
                    </div>
                    <div class="card-number">
                        尾号: {{(item.bank_account).substr(-4, 4)}}
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-person">持卡人姓名: {{realName || '*'}}</div>
                    <div class="operate">
                        <span class="text" @click="relieveBankHandle(item.card_id, index)">删除</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="addition-card" @click="displayBankCardModal" v-if="cardList.length < 3">
            <div class="icon-add"></div>
            <div class="text">添加银行卡</div>
        </div>
        <Modal v-model="relieveBankModal"
               title="解除绑定银行卡"
               @on-ok="relieveConfirm">
            确认是否解除此银行卡
        </Modal>
        <bank-card-modal :mask='false'
                         :bankList="bankList"
                         :displayModal='bankCardDisplayModal'
                         @closeModal="closeModal"
                         @bankCardSubmit="bankCardSubmit">
        </bank-card-modal>
    </div>
</template>

<script>
  import BankCardModal from '../../../common/base/bankCardModal/bankCardModal'
  import {addBankCardVerity} from "../../../common/js/formverify/addBankCrak";
  import {mapActions} from 'vuex'

  export default {
    name: "bankCardManage",
    data() {
      return {
        bankCardDisplayModal: false,
        cardList: [],
        bankList: [],
        nowCardId: '',
        relieveBankModal: false,
        realName: ''
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['GET_USER_BANK_LIST', 'GET_AVAIL_BANKLIST', 'ADD_BANK_CARD', 'UNBIND_BANK']),
      closeModal() {
        this.bankCardDisplayModal = false
      },
      displayBankCardModal() {
        this.bankCardDisplayModal = true
      },
      bankCardSubmit(data) {
        // let bankInfo = data.bankName.split('+')
        // let bankCardNum = String(data.bankCardNum)
        if (addBankCardVerity(data)) {
          this.ADD_BANK_CARD({
            code: data.bankName,
            card_number: data.bankCardNum,
            bank_address: data.bankAddress
          }).then(res => {
            // this.cardList.push({
            //   card_id: bankCardNum,
            //   code: bankInfo[0],
            //   name: bankInfo[1],
            //   bank_account: bankCardNum.substring(bankCardNum.length, bankCardNum.length - 4)
            // })
            // this.bankCardDisplayModal = false
            setTimeout(() => {
              location.reload()
            }, 1000)
          });
        }
      },
      relieveBankHandle(id) {
        this.nowCardId = id;
        this.relieveBankModal = true
      },
      relieveConfirm() {
        this.UNBIND_BANK({card_id: this.nowCardId}).then(res => {
          setTimeout(() => {
            location.reload()
          }, 1000)
        })
      },
      _initPage() {
        this.realName = this.$store.state.user.userInfo.real_name
        this.GET_USER_BANK_LIST().then(res => {
          this.cardList = res.data
        });
        this.GET_AVAIL_BANKLIST().then(res => {
          this.bankList = res.data
        });
      }
    },
    components: {
      BankCardModal
    }
  }
</script>

<style scoped lang="scss">
    .bankCardManage-wrapper {
        width: 100%;
        min-height: 550px;
        padding: 20px 26px;
        .bankCard-group {
            display: inline-block;
            .bankCard-item {
                display: inline-block;
                width: 260px;
                height: 130px;
                border: 1px solid $border-color-gary;
                box-sizing: border-box;
                margin: 0 55px 15px 0;
                vertical-align: top;
                &:hover {
                    border: 1px solid $theme-color;
                    .operate {
                        display: block !important;
                    }
                }
                &:nth-child(3n) {
                    margin-right: 0;
                }
                .card-header {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 44px;
                    padding: 10px;
                    background-color: #eff0f6;
                    .card-type {
                        .icon {
                            display: inline-block;
                            width: 28px;
                            height: 28px;
                            margin-right: 12px;
                            vertical-align: middle;
                        }
                        .text {
                            font-size: $font-size-medium;
                            color: $color-black;
                            vertical-align: middle;
                        }
                    }
                    .card-number {
                        font-size: $font-size-small;
                        color: $color-gary;
                    }
                }
                .card-content {
                    width: 100%;
                    height: 84px;
                    padding: 23px 10px 10px;
                    .card-person {
                        margin-bottom: 20px;
                        font-size: $font-size-small;
                        color: $color-dark;
                    }
                    .operate {
                        display: none;
                        text-align: right;
                        .text {
                            font-size: $font-size-small;
                            color: $color-theme;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .addition-card {
            display: inline-flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            width: 260px;
            height: 130px;
            border: 1px dashed $border-color-gary;
            vertical-align: top;
            cursor: pointer;
            .icon-add {
                width: 36px;
                height: 36px;
                background: url("../../../../public/static/images/add.png") no-repeat center center;
                background-size: contain;
            }
            .text {
                margin-top: 14px;
                font-size: $font-size-small;
                color: $color-gary;
            }
        }
    }
</style>

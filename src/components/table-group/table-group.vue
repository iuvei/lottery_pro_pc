<template>
    <div class="table-group-wrapper">
        <div class="switch-tab">
            <a href="javascript:;" class="switch-btn" :class="switchId === '0'?'selected':''" @click="switchTab('0')">全部注单</a>
            <a href="javascript:;" class="switch-btn" :class="switchId === '1'?'selected':''" @click="switchTab('1')">未结算</a>
            <a href="javascript:;" class="switch-btn" :class="switchId === '2'?'selected':''" @click="switchTab('2')">已中奖</a>
            <a href="javascript:;" class="switch-btn" :class="switchId === '3'?'selected':''" @click="switchTab('3')">未中奖</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "table-group"
    }
</script>

<style scoped lang="scss">
    .table-group-wrapper {
        width: 100%;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        box-sizing: border-box;
        .switch-tab {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            height: 59px;
            padding: 28px;
            border-bottom: 2px solid $border-color-gary;
            .switch-btn {
                height: 59px;
                line-height: 59px;
                margin-right: 58px;
                border-bottom: 2px solid transparent;
                font-size: $font-size-medium-x;
                font-weight: bold;
                color: $color-black;
                &.selected {
                    border-bottom: 2px solid $color-theme;
                    color: $color-theme;
                }
            }
        }
    }
</style>

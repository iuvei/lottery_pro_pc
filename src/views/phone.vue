<template>
    <div>
        <div class="phone-wrapper" ref="wrapper">
            手机购彩
        </div>
        <footers></footers>
    </div>
</template>

<script>
    import {getContentHeight} from "../common/js/common";
    import Footers from '../components/footers/footers'

    export default {
        name: "phone",
        created() {
            this._initPage()
        },
        methods: {
            _initPage() {
                this.$nextTick(() => {
                    let contentHeight = getContentHeight()
                    this.$refs.wrapper.style.minHeight = contentHeight + 'px'
                })
            }
        },
        components: {
            Footers
        }
    }
</script>

<style scoped>

</style>
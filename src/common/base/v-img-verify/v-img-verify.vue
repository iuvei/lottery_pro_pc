<template>
    <div class="img-verify" @click="loadVerifyImg">
        <img :src="verifySrc" alt="" v-if="verifyShow" @load="handleLoad">
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        props: ['shouldReload'],
        data() {
            return {
                verifySrc: '',
                verifyShow: true
            }
        },
        created() {
            this.loadVerifyImg()
        },
        methods: {
            ...mapActions(['GET_VERIFY_DATA']),
            loadVerifyImg() {
                this.GET_VERIFY_DATA().then(res => {
                    this.verifyShow = false
                    this.verifySrc = `data:image/png;base64, ${res.data.img}`
                    this.$emit('getVerifyToken',res.data.key)
                    setTimeout(() => {
                        this.verifyShow = true
                        this.$emit('setReload', false)
                    }, 10)
                })
            },
            handleLoad() {
                // console.log(document.cookie)
            }
        },
        watch: {
            shouldReload: function(val) {
                if (val) {
                    this.loadVerifyImg()
                }
            }
        }
    }
</script>
<style scoped>
    .img-verify img {
        width: 100%;
        height: 100%;
    }
</style>

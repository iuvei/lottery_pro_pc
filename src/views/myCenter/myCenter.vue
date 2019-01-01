<template>
    <div class="myCenter">
        <div class="container">
            <div class="content">
                <myCenter-aside :active-index="activeIndex" v-if="asideMenuList" :menuList="asideMenuList"></myCenter-aside>
                <div class="content-right">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <footers></footers>
    </div>
</template>

<script>
  import asideMenuList from '../../common/config/centerAsideMenu'
  import Footers from '../../components/footers/footers';
  import MyCenterAside from '../../components/AsideMenu/AsideMenu'

  export default {
    name: "myCenter",
    data() {
      return {
        activeIndex: '',
        asideMenuList: asideMenuList,
      }
    },
    created() {
      this.setActiveIndex()
      this._initPage()
    },
    methods: {
      setActiveIndex() {
        let href = location.pathname.split('/')
        if (href.length && href[2] === 'finances') {
          this.activeIndex = 1
        }
        if (href.length && href[2] === 'agent') {
          this.activeIndex = 4
        }
        if (href.length && href[2] === 'announcement') {
          this.activeIndex = 5
        }
        if (href.length && href[2] === 'mailerlist') {
          this.activeIndex = 5
        }
      },
      _initPage() {
        let is_agent = this.$store.state.user.userInfo.is_agent
        if (!this.$store.getters.token || is_agent == '0') {
          let list = []
          this.asideMenuList.map((item) => {
            if (item.name !== '代理中心') {
              list.push(item)
            }
          })
          this.asideMenuList = list
        }
      }
    },
    components: {
      Footers,
      MyCenterAside
    }
  }
</script>

<style scoped lang="scss">
    .myCenter {
        .content {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 20px 0;
            .content-right {
                flex: 1;
                background-color: $color-white;
            }
        }
    }
</style>

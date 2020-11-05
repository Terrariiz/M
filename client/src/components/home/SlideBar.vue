<template>
  <div class="nav_main" v-if="this.permission  === 'user'">
	  <Stdnav></Stdnav>
  </div>
  <div class="nav_main" v-else-if="this.permission  === 'admin'">
    <Adminnav></Adminnav>
  </div>
  <div class="nav_main" v-else-if="this.permission === ''">
    <defaultNav></defaultNav>
  </div>
</template>

<script>
const Adminnav    = () => import('../profile/Navbar')
const Stdnav      = () => import('../student/profile/student_nav')
const defaultNav  = () => import('@/components/home/Defult_nav')
export default {
  name: 'SlideBar',
  components:{
    Adminnav,Stdnav,defaultNav
  },
  data () {
    return {
      permission: "",
    }
  },

  async created (){
    const token = window.localStorage.getItem('tsic_token')
    const token_std = window.localStorage.getItem('tsic_std_token')
    if(token || token_std){
      if (token) {
        this.permission = "admin";
      }else if (token_std) {
        this.permission = "user";
      }
    }else if ( token && token_std ){
      localStorage.removeItem('tsic_std_token');
      localStorage.removeItem('tsic_token');
      this.$router.push('/home');
      window.alert("please sign in ");
    }
	},
}
</script>

==
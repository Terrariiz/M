<template>
  <v-app>
    <div class="home">
    <SlideBar></SlideBar>
    <div class="card_main_content">
      <div class="container mt-top">
        <Contentbg></Contentbg>
      </div>
    </div>
  </div>
  </v-app>
</template>

<script>
import SlideBar from '@/components/home/SlideBar'
import Contentbg from './Content_bg'

export default {
  name: 'home',
  components: {
    SlideBar,Contentbg
  }
};
</script>

<style scoped>
.mt-top{
  margin-top: 7rem;
}
</style>

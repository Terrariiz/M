<template>
  <div class="bg">
    <header class="main_content">
        <section class="content_title">
            <h1>welcome to fsci kmutt</h1>
            <hr style="width:30%">
            <p class="sub-title"><strong>Online Thesis Collection System</strong></p>
            <router-link class="button" to="home">Enter Website</router-link>
        </section>
    </header>
  </div>
</template>

<script>
export default {
  name: 'index',
}
</script>

<style scoped>
.bg{
    background-image: url(../../assets/images/kmutt_contact.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    width: 100%;
    height: 100vh;
}
.main_content {
    display: table;
    width: 100%;
    position: absolute;
    top: 35%;
}
.content_title {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
.content_title h1 {
    font-weight: bold;
    color: #f3c683;
    text-transform: uppercase;
    font-size: 40px;
    line-height: 50px;
    margin-top: 20px;
}
hr {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border: 0;
    border-top: 1px solid rgb(209, 209, 209);
    display: block;
    margin: auto;
}
.sub-title {
    margin: 20px auto;
    font-size: 24px;
    line-height: 23px;
    text-transform: uppercase;
}
.button {
    display: inline-block;
    padding: 15px 20px;
    color: #cafaea;
    border: 1px solid #cafaea;
    border-radius: 3px;
    font-weight: 700;
    line-height: normal;
    text-decoration: none;
    text-align: center;
    text-transform: uppercase;
    margin: 20px 0px 30px 0px;
}
</style>

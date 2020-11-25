<template>
    <div class="sign_in">
        <SlideBar></SlideBar>
        <div class="signin_content">
            <div class="container-login100">
                <div class="wrap-login100">
                    <div class="login100-pic js-tilt" data-tilt="" style="will-change: transform; transform: perspective(300px) rotateX(0deg) rotateY(0deg);">
                        <img src="@/assets/images/kmutt_logo.png" alt="IMG">
                    </div>

                    <form class="login100-form validate-form">
                        <span class="login100-form-title">
                            <h1>Staff Login</h1>
                            <hr>
                            <p>ONLINE THESIS COLLECTION SYSTEM</p>
                        </span>

                        <div class="wrap-input100 validate-input">
                            <v-text-field
                                class="input100"
                                v-model="username"
                                v-validate="'required|max:20'"
                                :counter="20"
                                :error-messages="errors.collect('username')"
                                label="username"
                                data-vv-name="username"
                                required
                            ></v-text-field>
                            <span class="focus-input100"></span>
                            <span class="symbol-input100">
                                <i class="fa fa-envelope" aria-hidden="true"></i>
                            </span>
                        </div>

                        <div class="wrap-input100 validate-input">
                            <v-text-field
                                class="input100"
                                v-model="password"
                                :append-icon="show1 ? 'visibility' : 'visibility_off'"
                                :type="show1 ? 'text' : 'password'"
                                v-validate="'required'"
                                :error-messages="errors.collect('password')"
                                label="password"
                                data-vv-name="password"
                                v-on:keyup.enter="sign_in"
                                required
                                @click:append="show1 = !show1"
                            ></v-text-field>
                            <span class="focus-input100"></span>
                            <span class="symbol-input100">
                                <i class="fa fa-lock" aria-hidden="true"></i>
                            </span>
                        </div>

                        <div class="container-login100-form-btn">
                           <div class="row">
                                <v-btn class="mr-4 btn login100-form-btn" v-on:keyup.enter="sign_in" v-on:click="sign_in()">Sign in</v-btn>
                                <v-btn class="btn login100-form-btn" @click="clear">clear</v-btn>
                            </div>
                        </div>
                    </form>
                </div>
		        </div>
        </div>
    </div>
</template>
 
<script>
const SlideBar = () => import('@/components/home/SlideBar')
import authHeader from '../../autheader/headers'

export default {
    $_veeValidate: {
      validator: 'new',
    },
    name: 'signin',
    components: {
        SlideBar
    },
    data: () =>({
        show1: false,
        username: '',
        password: '',
        dictionary: {
            attributes: {
                password: 'input password',
                // custom attributes
            },
            custom: {
                username: {
                    required: () => 'Name can not be empty',
                    max: 'The name field may not be greater than 30 characters',
                    // custom messages
                }
            }
        }
    }),

    async beforeCreate() {
      const token = localStorage.getItem("tsic_std_token")
      if(token){
          window.alert("please sing out and sign in again!!")
          this.$router.push("/student_profile")
      }
    },

    async created (){
        const token = window.localStorage.getItem('tsic_token')
			if (token) {
				try{
					const res = await this.axios.request({
						method: 'get',
						url: 'http://localhost:5000/staffs/verify',
						headers: authHeader() 
					})
					.then(res => {
                        if(res.data.success){
                            this.$router.push('/profile')
                        }else{
                            localStorage.removeItem('tsic_token')
                        }
					})
				}catch(err){
                    console.log(err)
                    localStorage.removeItem('tsic_token')
				}
			}
    },
    
    mounted () {
      this.$validator.localize('en', this.dictionary)
    },

    methods: {
        async sign_in () {
          this.$loading(true)

            if( !this.username || !this.password){
                this.valid = false
            }

            if( this.username > 30){
                this.valid = false
            }

            if( !this.valid ){
                this.$loading(false)
                this.$validator.validateAll()
            }else{
                const formData = {
                    username: this.username,
                    password: this.password,
                };
                const encodeForm = (data) => {
                    return Object.keys(data)
                    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
                }

                try {
                    return await this.axios.post(
                        'http://localhost:5000/staffs/signin',
                        encodeForm(formData),
                        { headers: 
                            { 
                                'Content-type': 'application/x-www-form-urlencoded'
                            }})
                            .then(res => {
                                this.$loading(false)
                                if(res.data.success){
                                    localStorage.setItem('tsic_token' , res.data.data.token)
                                    this.$router.push('/profile')
                                }else{
                                    window.alert(res.data.message)
                                    this.username = ''
                                    this.password = ''
                                }
                            })
                            .catch(err => {
                                this.$loading(false);
                                console.log(err)
                            })
                }catch (error) {
                    this.$loading(false)
                    console.error(error)
                }
            }
            this.valid = true;
        },

        clear () {
            this.username = ''
            this.password = ''
            this.$validator.reset()
        }
    },
}
</script>

<style scoped>
 * {
	margin: 0px; 
	padding: 0px; 
	box-sizing: border-box;
}

body, html {
	height: 100%;
}

/*---------------------------------------------*/
a {
	font-size: 14px;
	line-height: 1.7;
	color: #666666;
	margin: 0px;
	transition: all 0.4s;
	-webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
}

a:focus {
	outline: none !important;
}

a:hover {
	text-decoration: none;
  color: #57b846;
}

/*---------------------------------------------*/
h1,h2,h3,h4,h5,h6 {
	margin: 0px;
}

p {
	font-size: 14px;
	line-height: 1.7;
	color: #666666;
	margin: 0px;
}

i{
    font-size: 18px;
    color: #ff8b1e
}

ul, li {
	margin: 0px;
	list-style-type: none;
}

h1{
    font-weight: bolder;
    font-size: 35px;
    margin-bottom: 5px;
}


/*---------------------------------------------*/
input {
	outline: none;
	border: none;
}

textarea {
  outline: none;
  border: none;
}

textarea:focus, input:focus {
  border-color: transparent !important;
}

input:focus::-webkit-input-placeholder { color:transparent; }
input:focus:-moz-placeholder { color:transparent; }
input:focus::-moz-placeholder { color:transparent; }
input:focus:-ms-input-placeholder { color:transparent; }

textarea:focus::-webkit-input-placeholder { color:transparent; }
textarea:focus:-moz-placeholder { color:transparent; }
textarea:focus::-moz-placeholder { color:transparent; }
textarea:focus:-ms-input-placeholder { color:transparent; }

input::-webkit-input-placeholder { color: #999999; }
input:-moz-placeholder { color: #999999; }
input::-moz-placeholder { color: #999999; }
input:-ms-input-placeholder { color: #999999; }

textarea::-webkit-input-placeholder { color: #999999; }
textarea:-moz-placeholder { color: #999999; }
textarea::-moz-placeholder { color: #999999; }
textarea:-ms-input-placeholder { color: #999999; }

/*---------------------------------------------*/
button {
	outline: none !important;
	border: none;
	background: transparent;
}

button:hover {
	cursor: pointer;
}

iframe {
	border: none !important;
}


/*//////////////////////////////////////////////////////////////////
[ Utility ]*/
.txt1 {
  font-size: 13px;
  line-height: 1.5;
  color: #999999;
}

.txt2 {
  font-size: 13px;
  line-height: 1.5;
  color: #666666;
}


/*//////////////////////////////////////////////////////////////////
[ login ]*/

.limiter {
  width: 100%;
  margin: 0 auto;
}

.container-login100 {
  width: 100%;
  height: -webkit-fill-available;
  max-height: 92vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #5ad67d;
}

.wrap-login100 {
  width: 960px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 130px 100px 40px 100px;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 5px 8px 6px 0 rgba(0,0,0,.12);
  -webkit-box-shadow: 0 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 5px 8px 6px 0 rgba(0,0,0,.12);
}

/*------------------------------------------------------------------
[  ]*/
.login100-pic {
  width: 316px;
}

.login100-pic img {
    width: 100%;
    max-width: 200px;
    height: auto;
}


/*------------------------------------------------------------------
[  ]*/
.login100-form {
  width: 310px;
}

.login100-form-title {
  font-size: 30px;
  color: #ff8b1e;
  line-height: 1.2;
  text-align: center;
  font-weight: bolder;
  width: 100%;
  display: block;
  padding-bottom: 54px;
}


/*---------------------------------------------*/
.wrap-input100 {
  position: relative;
  width: 100%;
  z-index: 1;
  margin-bottom: 30px;
}

.input100 {
  font-size: 15px;
  line-height: 1.5;
  color: #666666;
  display: block;
  width: 100%;
  background: #ffffff;
  height: 50px;
  border-radius: 25px;
  padding: 10px 30px 0 68px;
}


/*------------------------------------------------------------------
[ Focus ]*/
.focus-input100 {
  display: block;
  position: absolute;
  border-radius: 25px;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 0px 0px;
  color: rgba(87,184,70, 0.8);
}

.input100:focus + .focus-input100 {
  -webkit-animation: anim-shadow 0.5s ease-in-out forwards;
  animation: anim-shadow 0.5s ease-in-out forwards;
}

@-webkit-keyframes anim-shadow {
  to {
    box-shadow: 0px 0px 70px 25px;
    opacity: 0;
  }
}

@keyframes anim-shadow {
  to {
    box-shadow: 0px 0px 70px 25px;
    opacity: 0;
  }
}

.symbol-input100 {
  font-size: 15px;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  position: absolute;
  border-radius: 25px;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-left: 35px;
  pointer-events: none;
  color: #666666;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.input100:focus + .focus-input100 + .symbol-input100 {
  color: #57b846;
  padding-left: 28px;
}

/*------------------------------------------------------------------
[ Button ]*/
.container-login100-form-btn {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 20px;
  margin: auto;
    display: grid;
}

.login100-form-btn {
  margin: 10px 0px 20px 0px;
  font-size: 13px;
  line-height: 1.5;
  color: rgb(0, 0, 0);
  text-transform: uppercase;
  height: 50px;
  border-radius: 25px;
  background-color: #57b846;
  background: #57b846;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 25px;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.login100-form-btn:hover {
  background: #333333;
}



/*------------------------------------------------------------------
[ Responsive ]*/



@media (max-width: 992px) {
  .wrap-login100 {
    padding: 177px 90px 33px 85px;
  }

  .login100-pic {
    width: 35%;
  }

  .login100-form {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .wrap-login100 {
    padding: 100px 80px 33px 80px;
  }

  .login100-pic {
    display: none;
  }

  .login100-form {
    width: 100%;
    padding: 30px;
  }
}

@media (max-width: 576px) {
  .wrap-login100 {
    padding: 100px 15px 33px 15px;
  }
}


/*------------------------------------------------------------------
[ Alert validate ]*/

.validate-input {
  position: relative;
}

.alert-validate::before {
  content: attr(data-validate);
  position: absolute;
  max-width: 70%;
  background-color: white;
  border: 1px solid #c80000;
  border-radius: 13px;
  padding: 4px 25px 4px 10px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 8px;
  pointer-events: none;
  color: #c80000;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;

  visibility: hidden;
  opacity: 0;

  -webkit-transition: opacity 0.4s;
  -o-transition: opacity 0.4s;
  -moz-transition: opacity 0.4s;
  transition: opacity 0.4s;
}

.alert-validate::after {
  content: "\f06a";
  font-family: FontAwesome;
  display: block;
  position: absolute;
  color: #c80000;
  font-size: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 13px;
}

.alert-validate:hover:before {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 992px) {
  .alert-validate::before {
    visibility: visible;
    opacity: 1;
  }
}
</style>
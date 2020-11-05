<template>
    <div class="register_profile">
        <div class="header_nav">
			<Navbar></Navbar>
		</div>
        <div class="content">
            <div class="section full-height">
				<div class="absolute-center">
					<div class="section">
						<div class="container">
                            <div class="header_title">
                                <div class="card">
                                    <h5>Register Staff</h5>
                                </div>
                            </div>
                                 <form>
                                    <div class="form-row">

                                        <div class="form-group col-md-6">
                                            <v-text-field
                                            v-model="username"
                                            v-validate="'required|max:20'"
                                            :counter="20"
                                            :error-messages="errors.collect('username')"
                                            label="username"
                                            data-vv-name="username"
                                            required
                                            ></v-text-field>
                                        </div>

                                        <div class="form-group col-md-6">
                                            <v-text-field
                                            v-model="password"
                                            v-validate="'required|max:15'"
                                            :counter="15"
                                            :error-messages="errors.collect('password')"
                                            label="password"
                                            data-vv-name="password"
                                            type="password"
                                            required
                                            ></v-text-field>
                                        </div>

                                        <div class="form-group col-md-6">
                                            <v-text-field
                                            v-model="f_name"
                                            v-validate="'required|max:20'"
                                            :counter="20"
                                            :error-messages="errors.collect('f_name')"
                                            label="first name"
                                            data-vv-name="f_name"
                                            required
                                            ></v-text-field>
                                        </div>

                                        <div class="form-group col-md-6">
                                            <v-text-field
                                            v-model="l_name"
                                            v-validate="'required|max:20'"
                                            :counter="20"
                                            :error-messages="errors.collect('l_name')"
                                            label="last name"
                                            data-vv-name="l_name"
                                            required
                                            ></v-text-field>
                                        </div>

                                        <div class="form-group col-md-6">
                                            <v-text-field
                                            v-model="email"
                                            v-validate="'required|email'"
                                            :error-messages="errors.collect('email')"
                                            label="E-mail"
                                            data-vv-name="email"
                                            required
                                            ></v-text-field>
                                        </div>

                                        <div class="form-group col-md-6">
                                            <v-text-field
                                            v-model="position"
                                            v-validate="'required|max:20'"
                                            :counter="20"
                                            :error-messages="errors.collect('position')"
                                            label="position"
                                            data-vv-name="position"
                                            required
                                            ></v-text-field>
                                        </div>
                                    </div>    
                                   <v-btn class="mr-4" v-on:keyup.enter="register_user" v-on:click="register_user()">Confirm</v-btn>
                                </form>
						</div>
					</div>
				</div>
            </div>                   
        </div>
    </div>
</template>

<script>
const Navbar = () => import('@/components/profile/Navbar')
import authHeader from '../../autheader/headers'

export default {
     $_veeValidate: {
      validator: 'new',
    },
    name: 'register_user_profile',
    components:{
        Navbar
    },
    data () {
        return{
            username:'',
            password:'',
            email: '',
            f_name:'',
            l_name:'',
            position:'',
            valid: true,
            dictionary: {
                attributes: {
                email: 'E-mail Address',
                // custom attributes
                },
                custom: {
                    username: {
                        required: () => 'Name can not be empty',
                        max: 'The name field may not be greater than 10 characters',
                        // custom messages
                    },
                    f_name: {
                        required: () => 'Name can not be empty',
                        max: 'The name field may not be greater than 10 characters',
                        // custom messages
                    },
                    l_name: {
                        required: () => 'Name can not be empty',
                        max: 'The name field may not be greater than 10 characters',
                        // custom messages
                    },
                    password: {
                        required: () => 'password can not be empty',
                        max: 'The name field may not be greater than 10 characters',
                        // custom messages
                    },
                    position: {
                        required: () => 'Name can not be empty',
                        max: 'The name field may not be greater than 10 characters',
                        // custom messages
                    },
                },
            },
        }
    },
    mounted () {
      this.$validator.localize('en', this.dictionary)
    },

    methods: {
        async register_user () {
            const formData = {
                username    : this.username,
                password    : this.password,
                fname       : this.f_name,
                lname       : this.l_name,
                email       : this.email,
                position    : this.position
            };

            const encodeForm = (data) => {
                return Object.keys(data)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            }

            if(!this.username || !this.f_name || !this.l_name || !this.email  || !this.password || !this.position){
                this.valid = false;
            }

            if(this.username.length > 20){
                this.valid = false;
            }

            if(this.f_name.length > 20){
                this.valid = false;
            }

            if(this.l_name.length > 20){
                this.valid = false;
            }

             if(this.password.length > 15){
                this.valid = false;
            }

            if(!this.valid){
                this.$validator.validateAll()
            }else{
                try {
                    return await this.axios.post(
                        'http://localhost:5000/staffs/',
                        encodeForm(formData),
                        { headers: authHeader()
                        })
                        .then(res => {
                            window.alert("success,Register finish!!")
                            this.$router.push('/home/user_profile')
                        })
                        .catch(err => {
                            window.alert("False,Can't Register!")
                            window.alert(err.data.message)
                            // this.$router.go(this.$router.currentRoute)
                        })
                    }catch (error) {
                        console.error(error)
                    }
            }
            this.valid = true;
        },
    }
}
</script>

<style scoped>
	.section {
		position: relative;
		width: 100%;
		display: block;
	}

	.full-height {
		height: 100vh;
	}

	.absolute-center {
		position: absolute;
		top: 40%;
		left: 0;
		width: 100%;
		margin-top: 50px;
		transform: translateY(-50%);
		z-index: 20;
	}

    .header_title{
        padding: 20px;
        display: block;
        position: relative;
        text-align: center;
    }
    .header_title h5{
        font-weight: bolder;
    }

    .header_title .card{
        padding: 20px;
        border: 0px solid transparent;
        box-shadow: 4px 4px 7px 1px #00000040;
    }
</style>
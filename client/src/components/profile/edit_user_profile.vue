<template>
    <div class="edit_profile">
        <div class="nav">
			<Navbar></Navbar>
		</div>
        <div class="content">
            <div class="section full-height">
				<div class="absolute-center">
					<div class="section">
						<div class="container">
                            <div class="header_title">
                                <div class="card">
                                    <div class="row">
                                        <div class="col-6">
                                        <h5>Staff ID</h5>
                                        <h3>{{ queryuser.staff_id }}</h3>
                                        </div>
                                         <div class="col-6">
                                        <h5>Username</h5>
                                        <h3>{{ queryuser.username }}</h3>
                                         </div>
                                    </div>
                                </div>
                            </div>
                                 <form>
                                    <div class="form-row">

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
                                            v-model="old_password"
                                            v-validate="'required|max:15'"
                                            :counter="15"
                                            :error-messages="errors.collect('old_password')"
                                            label="old password"
                                            data-vv-name="old_password"
                                            type="password"
                                            required
                                            ></v-text-field>
                                        </div>

                                        <div class="form-group col-md-6">
                                            <v-text-field
                                            v-model="new_password"
                                            v-validate="'max:15'"
                                            :counter="15"
                                            :error-messages="errors.collect('new_password')"
                                            label="new password"
                                            data-vv-name="new_password"
                                            type="password"
                                            required
                                            ></v-text-field>
                                        </div>
            
                                        <div class="form-group col-md-6">
                                            <v-text-field
                                            v-model="confirm_password"
                                            v-validate="'max:15'"
                                            :counter="15"
                                            :error-messages="errors.collect('confirm_password')"
                                            label="confirm password"
                                            data-vv-name="confirm_password"
                                            type="password"
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

                                        <div class="form-group col-md-12">
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
                                   <v-btn class="mr-4" v-on:keyup.enter="edit_user" v-on:click="edit_user()">Confirm</v-btn>
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
    name: 'edit_user_profile',
    components:{
        Navbar
    },
    data () {
        return{
            queryuser: [],
            email: '',
            f_name:'',
            l_name:'',
            position:'',
            old_password:'',
            new_password:'',
            confirm_password:'',
            valid: true,
            dictionary: {
                attributes: {
                email: 'E-mail Address',
                // custom attributes
                },
                custom: {
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
                    old_password: {
                        required: () => 'password can not be empty',
                        max: 'The name field may not be greater than 10 characters',
                        // custom messages
                    },
                    new_password: {
                        max: 'The name field may not be greater than 10 characters',
                        match: 'password is not match'
                    },
                    confirm_password: {
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

    async created () {
        try{
            const res = await this.axios.request({
                method: 'get',
                url: 'http://localhost:5000/staffs/',
                headers: authHeader() 
            }).then(res => {
                this.queryuser = res.data.data
                this.username  = this.queryuser.username
                this.f_name    = this.queryuser.first_name
                this.l_name    = this.queryuser.last_name
                this.email     = this.queryuser.email
                this.position  = this.queryuser.position
            })
        }catch(err){
            console.log(err)
        }
    },

    mounted () {
      this.$validator.localize('en', this.dictionary)
    },

    methods: {
        async edit_user () {
            const formData = {
                staff_id    : this.queryuser.staff_id,
                fname       : this.f_name,
                lname       : this.l_name,
                email       : this.email,
                old_password: this.old_password,
                new_password: this.new_password,
                position    : this.position
            };

            const encodeForm = (data) => {
                return Object.keys(data)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            }

            if(!this.f_name || !this.l_name || !this.email  || !this.old_password || !this.position){
                this.valid = false;
            }

            if(this.f_name.length > 20){
                this.valid = false;
            }

            if(this.l_name.length > 20){
                this.valid = false;
            }

             if(this.new_password){
                if( this.new_password !== this.confirm_password){
                    window.alert('confirm password is not match!!')
                    this.confirm_password = '';
                    this.new_password = '';
                    this.valid = false;
                }
            }

            if(!this.valid){
                this.$validator.validateAll()
            }else{
                //this.$router.go(this.$router.currentRoute)
                try {
                    return await this.axios.put(
                        'http://localhost:5000/staffs/',
                        encodeForm(formData),
                        { headers: authHeader()
                        })
                        .then(res => {
                            window.alert("success,update your profile!!")
                            this.$router.push('/home/user_profile')
                        })
                        .catch(err => {
                            window.alert("False,Can't update your profile!!")
                            window.alert("Password incorrect!")
                            this.$router.go(this.$router.currentRoute)
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
		top: 50%;
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
        border: 0px solid transparent;
        box-shadow: 4px 4px 7px 1px #00000040;
    }
</style>
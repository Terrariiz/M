<template>
    <div class="user_profile">
		<div class="nav">
			<Navbar></Navbar>
		</div>
		<div class="content">
			<div class="section full-height">
				<div class="absolute-center">
					<div class="section">
						<div class="container">
							<div class="row">
                                <div class="col-12">
                                    <div class="card ">
                                        <div class="row">
                                            <div class="col-5">
                                                <div class="user_profile_img">
                                                    <img src="" alt="profile_user_img">
                                                </div>
                                            </div>
                                            <div class="col-7">
                                                <h1>WELCOME TO</h1>
                                                <h3>online tsic system</h3>
                                                <div class="pro_name">
                                                    <h1>{{ queryuser.username  }}.</h1>
                                                </div>
                                            </div>
                                        </div>
                                        <hr>
                                    </div>

                                     <div class="card">
                                        <h1>My Profile</h1>
                                        <hr>
                                        <table class="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <th scope="row">Student ID :</th>
                                                <td>{{queryuser.student_id}}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Email :</th>
                                                <td>{{queryuser.email}}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">First Name :</th>
                                                <td>{{queryuser.first_name}}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Last Name :</th>
                                                <td>{{queryuser.last_name}}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">curriculum ID :</th>
                                                <td>{{queryuser.curriculum_id}}</td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>		
						</div>		
					</div>
				</div>
			</div>
		</div>
    </div>
</template>

<script>
const Navbar = () => import('@/components/student/profile/student_nav')
import authHeader from '../../../autheader/header_std'

export default {
    name: 'user_profile',
    components:{
        Navbar
    },
    data () {
        return {
            queryuser: []
        }
    },
    async created () {
        try{
            const res = await this.axios.request({
                method: 'get',
                url: 'http://localhost:5000/users/',
                headers: authHeader() 
            }).then(res => {
                this.queryuser = res.data.data
            })
        }catch(err){
            console.log(err)
        }
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
    
    .center{
        text-align: center;
    }
    .pro_name h1{
        font-weight: bolder;
    }

    .detail h2{
        font-weight: bolder;
    }

    .card{
        padding: 20px;
        margin: 15px;
        border: 0px;
        border-radius: 3px;
        box-shadow: 4px 6px 13px 0px #00000078;
    }

    .h100{
        height: 100%;
    }

    .table th,tr,td{
        font-size: 18px;
    }
    
    .card_a{
        display: block;
    }
</style>
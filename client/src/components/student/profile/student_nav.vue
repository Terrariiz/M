<template>
  <div class="navbar_sf">
        <div class="navigation-wrap bg-light start-header start-style">
            <div class="container">
                <div class="row">
                    <div class="col-12">
						<nav class="navbar navbar-expand-md navbar-light">
							<a class="navbar-brand" href="/home" ><img src="../../../assets/images/kmutt.png" alt="sci_kmutt"></a>
							<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
								<span class="navbar-toggler-icon"></span>
							</button>
							<div class="collapse navbar-collapse" id="navbarSupportedContent">
								<ul class="navbar-nav ml-auto py-4 py-md-0">
									<li class="nav-item pl-4 pl-md-0 ml-0 ml-md-5">
										<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Activity</a>
										<div class="dropdown-menu">
											<router-link class="dropdown-item" to="/student/submitThesic">Submit Tsic</router-link>
										</div>
									</li>

									<li class="pl-md-0 ml-0 ml-md-5">
										<v-btn dark Depressed color="light-green darken-1" style="margin-left: 10px;" @click="sign_out()">Sign out</v-btn>
									</li>
								</ul>
							</div>
						</nav>
                    </div>
                </div>
            </div>
        </div>
  </div>		
</template>

<script>
import authHeader from '../../../autheader/header_std'
export default {
   name: 'student_nav',
  data () {
    return {
	}
  },
  
  async created (){
        const token = window.localStorage.getItem('tsic_std_token')
		try{
			const res = await this.axios.request({
				method: 'get',
				url: 'http://localhost:5000/users/verify',
				headers: authHeader() 
			})
			.then(function (res){
				if(res.data.success === false){
					localStorage.removeItem('tsic_std_token')	
					this.$router.push('/student_signin')		
				}
			})
			.catch(function(err){
				localStorage.removeItem('tsic_std_token')
				this.$router.push('/student_signin')
				console.error(err)
			})	
		}catch(err){
			console.error(err)
		}
	},
	
	methods: {
		async sign_out () {
			// this.$store.commit('add_permission','')
			localStorage.removeItem('tsic_std_token')
			await this.$router.push('/student_signin')
		}
	},
}
</script>

<style scoped>
	/* #Navigation
	================================================== */
	.btn{
		box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
		-webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
	}

	.btn-green{
		color: #ffffff;
		background-color: #8bc34a;
		border-color: #8bc34a
	}

	.btn-green:active{
		color: #ffffff;
		background-color: #000000;
		border-color: #000000
	}


	.start-header {
		opacity: 1;
		transform: translateY(0);
		/* box-shadow: 0 10px 30px 0 rgba(138, 155, 165, 0.15); */
		-webkit-transition : all 0.3s ease-out;
		transition : all 0.3s ease-out;
	}
	.start-header.scroll-on {
		box-shadow: 0 5px 10px 0 rgba(138, 155, 165, 0.15);
		padding: 5px 0;
		-webkit-transition : all 0.3s ease-out;
		transition : all 0.3s ease-out;
	}
	.start-header.scroll-on .navbar-brand img{
		height: 50px;
		-webkit-transition : all 0.3s ease-out;
		transition : all 0.3s ease-out;
	}
	.navigation-wrap{
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 1000;
		-webkit-transition : all 0.3s ease-out;
		transition : all 0.3s ease-out;
	}
	.navbar{
		padding: 0;
	}
	.navbar-brand img{
		height: 80px;
		width: auto;
		display: block;
		-webkit-transition : all 0.3s ease-out;
		transition : all 0.3s ease-out;
	}
	.navbar-toggler {
		float: right;
		border: none;
		padding-right: 0;
	}
	.navbar-toggler:active,
	.navbar-toggler:focus {
		outline: none;
	}
	.navbar-light .navbar-toggler-icon {
		width: 24px;
		height: 17px;
		background-image: none;
		position: relative;
		border-bottom: 1px solid #000;
		transition: all 300ms linear;
	}
	.navbar-light .navbar-toggler-icon:after, 
	.navbar-light .navbar-toggler-icon:before{
		width: 24px;
		position: absolute;
		height: 1px;
		background-color: #000;
		top: 0;
		left: 0;
		content: '';
		z-index: 2;
		transition: all 300ms linear;
	}
	.navbar-light .navbar-toggler-icon:after{
		top: 8px;
	}
	.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon:after {
		transform: rotate(45deg);
	}
	.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon:before {
		transform: translateY(8px) rotate(-45deg);
	}
	.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon {
		border-color: transparent;
	}
	.nav-link{
		color: #212121 !important;
		font-weight: 500;
		transition: all 200ms linear;
	}
	.nav-item:hover .nav-link{
		color: #8bc34a !important;
	}
	.nav-item.active .nav-link{
		color: rgb(0, 0, 0) !important;
	}
	.nav-link {
		position: relative;
		padding: 5px 0 !important;
		display: inline-block;
		font-size: 20px;
	}
	.nav-item:after{
		position: absolute;
		bottom: -5px;
		left: 0;
		width: 100%;
		height: 2px;
		content: '';
		background-color: #8bc34a;
		opacity: 0;
		transition: all 200ms linear;
	}
	.nav-item:hover:after{
		bottom: 0;
		opacity: 1;
	}
	.nav-item.active:hover:after{
		opacity: 0;
	}
	.nav-item{
		position: relative;
		transition: all 200ms linear;
	}

	/* #Primary style
	================================================== */

	.bg-light {
		background-color: #fff !important;
		transition: all 200ms linear;
	}

	.over-hide {
		overflow: hidden;
	}

	h1{
		font-size: 48px;
		line-height: 1.2;
		font-weight: 700;
		color: #212112;
		text-align: center;
	}
	p{
		text-align: center;
		margin: 0;
		padding-top: 10px;
		opacity: 1;
		transform: translate(0);
		transition: all 300ms linear;
		transition-delay: 1700ms;
	}
	body.navbar_sf p{
		opacity: 0;
		transform: translateY(40px);
		transition-delay: 1700ms;
	}
	h1 span{
		display: inline-block;
		transition: all 300ms linear;
		opacity: 1;
		transform: translate(0);
	}
	#switch,
	#circle {
		cursor: pointer;
		-webkit-transition: all 300ms linear;
		transition: all 300ms linear; 
	} 
	#switch {
		width: 60px;
		height: 8px;
		border: 2px solid #8bc34a;
		border-radius: 27px;
		background: #000;
		position: relative;
		display: block;
		margin: 0 auto;
		text-align: center;
		opacity: 1;
		transform: translate(0);
		transition: all 300ms linear;
		transition-delay: 1900ms;
	}
	body.navbar_sf #switch{
		opacity: 0;
		transform: translateY(40px);
		transition-delay: 1900ms;
	}
	#circle {
		position: absolute;
		top: -11px;
		left: -13px;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: #000;
	}
	.switched {
		border-color: #000 !important;
		background: #8bc34a !important;
	}
	.switched #circle {
		left: 43px;
		box-shadow: 0 4px 4px rgba(26,53,71,0.25), 0 0 0 1px rgba(26,53,71,0.07);
		background: #fff;
	}
	.nav-item .dropdown-menu {
		transform: translate3d(0, 10px, 0);
		visibility: hidden;
		opacity: 0;
		max-height: 0;
		display: block;
		padding: 0;
		margin: 0;
		transition: all 200ms linear;
	}
	.nav-item.show .dropdown-menu {
		opacity: 1;
		visibility: visible;
		max-height: 999px;
		transform: translate3d(0, 0px, 0);
	}
	.dropdown-menu {
		padding: 10px!important;
		margin: 0;
		font-size: 13px;
		letter-spacing: 1px;
		color: #212121;
		background-color: #fcfaff;
		border: none;
		border-radius: 3px;
		box-shadow: 0 5px 10px 0 rgba(138, 155, 165, 0.15);
		transition: all 200ms linear;
	}
	.dropdown-toggle::after {
		display: none;
	}

	.dropdown-item {
		padding: 3px 15px;
		color: #212121;
		border-radius: 2px;
		transition: all 200ms linear;
		font-size: 16px;
	}
	.dropdown-item:hover, 
	.dropdown-item:focus {
		color: #fff;
		background-color: #8bc34aea;
	}

/* #Media
================================================== */

@media (max-width: 767px) { 
	h1{
		font-size: 38px;
	}
	.nav-item:after{
		display: none;
	}
	.nav-item::before {
		position: absolute;
		display: block;
		top: 15px;
		left: 0;
		width: 11px;
		height: 1px;
		content: "";
		border: none;
		background-color: #000;
		vertical-align: 0;
	}
	.dropdown-toggle::after {
		position: absolute;
		display: block;
		top: 10px;
		left: -23px;
		width: 1px;
		height: 11px;
		content: "";
		border: none;
		background-color: #000;
		vertical-align: 0;
		transition: all 200ms linear;
	}
	.dropdown-toggle[aria-expanded="true"]::after{
		transform: rotate(90deg);
		opacity: 0;
	}
	.dropdown-menu {
		padding: 0 !important;
		background-color: transparent;
		box-shadow: none;
		transition: all 200ms linear;
	}
	.dropdown-toggle[aria-expanded="true"] + .dropdown-menu {
		margin-top: 10px !important;
		margin-bottom: 20px !important;
	}
}


</style>
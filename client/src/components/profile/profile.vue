<template>
	<div class="profile">
		<div class="header_nav">
			<Navbar></Navbar>
		</div>
		<div class="content">
			<div class="section full-height">
				<div class="absolute-center">
					<div class="section">
						<div class="container">
							<div class="row">
								<div class="col-12">
									<h1>welcome</h1>
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
const Navbar = () => import('@/components/profile/Navbar')
export default {
	name: 'profile',
	components:{
		Navbar
	},
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
		margin-top: 40px;
		transform: translateY(-50%);
		z-index: 20;
	}
</style>
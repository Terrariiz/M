<template>
  <div class="lecturer">
    <v-app>
      <div class="nav_header">
          <Navbar></Navbar>
      </div>
        <div class="content">
            <div class="section full-height">
				<div class="absolute-center">
					<div class="section">
						<div class="container">
                            <div class="tb_lc">
                                <v-card-title>
                                    Adviser
                                <v-spacer></v-spacer>
                                <v-dialog v-model="dialog" max-width="800">
                                <template v-slot:activator="{ on }">
                                    <v-btn color="primary" dark class="mr-5" v-on="on" prepend-icon="mdi-clipboard-text-multiple-outline">Insert Adviser</v-btn>
                                </template>
                                <v-card>
                                    <v-form  ref="form_input_lecturer" v-model="valid">
                                        <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                        </v-card-title>

                                        <v-card-text>
                                            <v-container>
                                                <v-row v-if="editedIndex === -1">
                                                    <v-col  cols="12" sm="6" md="6">
                                                        <v-select
                                                            v-model="editedItem.selectType"
                                                            :items="lecturer_type"
                                                            item-text="name"
                                                            item-value="value"
                                                            label="Select Type"
                                                            prepend-icon="mdi-clipboard-text-multiple-outline" 
                                                            single-line
                                                        >
                                                        </v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field 
                                                            v-model="editedItem.first_name" 
                                                            :rules="nameRules" 
                                                            :counter="50" 
                                                            label="firstname" 
                                                            prepend-icon="mdi-clipboard-text-multiple-outline" 
                                                            required>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field 
                                                            v-model="editedItem.last_name" 
                                                            :rules="nameRules" 
                                                            :counter="50" 
                                                            label="lastname" 
                                                            prepend-icon="mdi-clipboard-text-multiple-outline" 
                                                            required>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field 
                                                            v-model="editedItem.POSITION" 
                                                            :rules="nameRules" 
                                                            :counter="50" 
                                                            label="position"  
                                                            prepend-icon="mdi-clipboard-text-multiple-outline" 
                                                            required>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col v-if="editedItem.selectType === 1"  cols="12" sm="6" md="6">
                                                        <v-text-field 
                                                            v-model="editedItem.department"  
                                                            :rules="nameRules"
                                                            :counter="50" 
                                                            label="department"  
                                                            prepend-icon="mdi-clipboard-text-multiple-outline">
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col v-if="editedItem.selectType === 1" cols="12" sm="6" md="6">
                                                        <v-text-field 
                                                            v-model="editedItem.faculty"  
                                                            :rules="nameRules"
                                                            :counter="50" 
                                                            label="faculty"  
                                                            prepend-icon="mdi-clipboard-text-multiple-outline" 
                                                            required>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col v-if="editedItem.selectType === 1"  cols="12" sm="6" md="6">
                                                        <v-text-field 
                                                            v-model="editedItem.university" 
                                                            :rules="nameRules" 
                                                            :counter="50" 
                                                            label="position"  
                                                            prepend-icon="mdi-clipboard-text-multiple-outline" 
                                                            required>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row v-if="editedIndex > -1">
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.first_name" :rules="nameRules" :counter="50" label="firstname" prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.last_name" :rules="nameRules" :counter="50" label="lastname" prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.POSITION" :rules="nameRules" :counter="50" label="position"  prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                    </v-col>
                                                    <v-col v-if="editedItem.department || editedItem.faculty || editedItem.university"   cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.department" :rules="nameRules" :counter="50" label="department"  prepend-icon="mdi-clipboard-text-multiple-outline" ></v-text-field>
                                                    </v-col>
                                                    <v-col v-if="editedItem.department || editedItem.faculty || editedItem.university"  cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.faculty" :rules="nameRules" :counter="50" label="faculty"  prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                    </v-col>
                                                    <v-col v-if="editedItem.department || editedItem.faculty || editedItem.university"  cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedItem.university" :rules="nameRules" :counter="50" label="university"  prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>

                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                        <v-btn :disabled="!valid" color="blue darken-1" text @click="save">Save</v-btn>
                                        </v-card-actions>
                                    </v-form>
                                </v-card>
                                </v-dialog>
                                <v-text-field
                                    v-model="search"
                                    append-icon="search"
                                    label="Search"
                                    single-line
                                    hide-details
                                ></v-text-field>
                                
                                </v-card-title>
                                <v-data-table
                                 v-bind:headers="headers_table"
                                :items="query_lecturer"
                                :items-per-page="10"
                                :search="search"
                                >
                                <template v-slot:item.action="{ item }">
                                    <v-icon
                                        small
                                        @click="editItem(item)"
                                    >
                                        edit
                                    </v-icon>
                                    <v-icon
                                        small
                                        @click="cf_delete_lecturer(item)"
                                    >
                                        delete
                                    </v-icon>
                                    </template>
        
                                </v-data-table>
                            </div>
						</div>
					</div>
				</div>
            </div>
        </div>
    </v-app>
  </div>
</template>

<script>

const Navbar = () => import('@/components/profile/Navbar')
import authHeader from '../../autheader/headers'


export default {
    name:'internal_lecturer',
    components:{
        Navbar
    },
    data (){
        return{
            valid: true,
            dialog: false,
            adviserType : '',
            search: '',
            headers_table: [
                { text: 'Adviser id'   ,value: 'adviser_id' },
                { text: 'Lecturer id'   ,value: 'lecturer_id' },
                { text: 'Firstname'    ,value: 'first_name' },
                { text: 'Lastname'     ,value: 'last_name' },
                { text: 'Position'      ,value: 'POSITION' },
                { text: 'Department'    ,value: 'department' },
                { text: 'Faculty'       ,value: 'faculty' },
                { text: 'University'    ,value: 'university' },
                { text: 'Action'        ,value: 'action', sortable: false}
            ],
            lecturer_type: [
                { name: 'Internal Lecturer', value: 0 },
                { name:'External Lecturer',  value: 1 },
            ],
            editedIndex: -1,
            editedItem: {
                first_name: '',
                last_name: '',
                POSITION: '',
                department : '',
                faculty : '',
                university : '',
                selectType: ''
            },
            defaultItem: {
                first_name: '',
                last_name: '',
                POSITION: '',
                department : '',
                faculty : '',
                university : '',
                selectType: ''
            },
            query_lecturer:[],
            nameRules: [
                v => !!v || 'input is required',
                v => v.length <= 50 || 'input must be less than 50 characters',
            ],
        }
    },

    async created() {
        this.intialAdviser();
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Insert Lecturer' : 'Edit  Lecturer'
      },
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
    },
    
    methods: {
        async intialAdviser () {
            try{
                const res = await this.axios.request({
                    method: 'get',
                    url: 'http://localhost:5000/search/advisers?list=true',
                    headers: authHeader()
                }).then(res =>{
                    this.query_lecturer = res.data.data
                }).catch(res =>{
                    console.error(res)
                })
            }catch(err){
                console.error(err)
            }
        },

        editItem (item) {
            this.editedIndex = this.query_lecturer.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        close () {
            this.dialog = false
            setTimeout(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
                }, 300)
        },

        async save () {
            console.log("save" ,this.editedItem.selectType )
            if (this.editedIndex > -1) {
                await this.edit_lecturer()
            } else {
                if (this.editedItem.selectType === 0){
                    await this.insert_internal_lecturer()
                }else{
                    await this.insert_external_lecturer()
                }
            }
        },

        async insert_internal_lecturer () {
            const formData = {
                fname      : this.editedItem.first_name,
                lname      : this.editedItem.last_name,
                position   : this.editedItem.POSITION,
            };

            console.log(formData)

            const encodeForm = (data) => {
                return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            };

            try{
                return await this.axios.post(
                    'http://localhost:5000/lecturer/internal', encodeForm(formData),
                    { headers: authHeader()})
                        .then(res => {
                            let type = 0
                            this.addAdivser( type , res.data.data.lecturer_id)
                        })
                        .catch(err => {
                            this.$swal({
                                toast: true,
                                position: 'bottom-end',
                                icon: 'error',
                                title: 'add lecturer false',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                        })
            }catch(err){
                console.error(err)
            }
        },

        async insert_external_lecturer () {
            const formData = {
                fname           : this.editedItem.first_name,
                lname           : this.editedItem.last_name,
                position        : this.editedItem.POSITION,
                department      : this.editedItem.department,
                faculty         : this.editedItem.faculty,
                university      : this.editedItem.university
            };

            const encodeForm = (data) => {
                return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            };

            try{
                return await this.axios.post(
                    'http://localhost:5000/lecturer/external', 
                    encodeForm(formData),
                    { headers: authHeader()
                    })
                    .then(res => {
                    let type = 1
                    this.addAdivser( type , res.data.data.lecturer_id)
                    })
                    .catch(err => {
                        this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'error',
                            title: 'add lecturer false',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
            }catch(err){
                console.error(err)
            }
        },
        
        async addAdivser(type , id){
            const lecturer_type = type;
            const lecturer_id = id;
            try {
                this.axios({
                    method: 'post',
                    url: `http://localhost:5000/lecturer/adviser/${lecturer_type}/${lecturer_id}`,
                    headers : authHeader()
                }).then(res => {
                        this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'success',
                            title: 'add lecturer success',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                    });
                    this.intialAdviser();
                    this.dialog = false;
                    })
                    .catch(err => {
                        this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'error',
                            title: 'add lecturer false',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
            } catch (error) {
                console.error(error)
            }
        },
        
        async edit_lecturer () {
            const formData = {
                lecturer_id    : this.editedItem.lecturer_id,
                fname          : this.editedItem.first_name,
                lname          : this.editedItem.last_name,
                position       : this.editedItem.POSITION,
                department      : this.editedItem.department,
                faculty         : this.editedItem.faculty,
                university      : this.editedItem.university
            };

            let lecturer_url = '';

            const encodeForm = (data) => {
                return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            };

            if (!this.editedItem.department && !this.editedItem.faculty && !this.editedItem.university){
                lecturer_url = "http://localhost:5000/lecturer/internal";
            }else{
                lecturer_url = "http://localhost:5000/lecturer/external";
            }

            try{
                const res = await this.axios.put( lecturer_url, encodeForm(formData),{ headers: authHeader()})
                        .then(res => {
                            this.$swal({
                                toast: true,
                                position: 'bottom-end',
                                icon: 'success',
                                title: 'edit lecturer success',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            this.intialAdviser();
                            this.dialog = false;
                        })
                        .catch(err => {
                            this.$swal({
                                toast: true,
                                position: 'bottom-end',
                                icon: 'error',
                                title: 'edit lecturer false',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                        })
                }catch(err){
                    console.error(err)
                }
        }, 
        
        cf_delete_lecturer (item) {
          this.$swal({
            title: 'Are you sure?',
            text: `Do you want to delete adviser id ${item.adviser_id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    this.DeleteAdviser(item)
                }
            })
        },

        async DeleteAdviser(item){
            try {
                const res = await this.axios.request({
                method: 'delete',
                url: `http://localhost:5000/lecturer/adviser/${item.adviser_id}`,
                headers: authHeader()
                }).then(res =>{
                    this.Delete_lecturer(item)
                }).catch(res =>{
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'error',
                        title: 'delete adviser false',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
            } catch (error) {
                console.error(error)
            }
        },

        async Delete_lecturer(item) {
            let lecturer_url = '';

            if (!item.department && !item.faculty && !item.university){
                lecturer_url = `http://localhost:5000/lecturer/internal/${item.lecturer_id}`;
            }else{
                lecturer_url = `http://localhost:5000/lecturer/external/${item.lecturer_id}`;
            }

            console.log(lecturer_url)

            try{
                const res = await this.axios.request({
                method: 'delete',
                url: lecturer_url,
                headers: authHeader()
                }).then(res =>{
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'success',
                        title: 'delete lecturer success',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.intialAdviser();
                }).catch(res =>{
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'error',
                        title: 'delete lecturer false',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
            }catch(err){
                console.error(err)
            }
        },
    },
}
</script>

<style scoped>

    .btn{
        height: 36px;
        color:rgb(247, 81, 81);
    }

    .btn-dark{
        color: white;
        background-color: #9C27B0;
        border-color: #9C27B0;
    }

    .btn_class_card{
        position: relative;
        float: right;
        width: auto;
        margin: 10px;
        display: block;
    }

	.section {
		position: absolute;
		width: 100%;
		display: block;
	}

	.full-height {
		height: 100vh;
	}

	.absolute-center {
		position: absolute;
		top: 35%;
		left: 0;
		width: 100%;
		transform: translateY(-50%);
		z-index: 20;
	}

    .header_title{
        display: block;
        position: relative;
        text-align: center;
    }

    .header_title h3{
        font-weight: bolder;
        font-size: 35px;
    }

    .header_title .card{
        padding: 20px;
        border: 0px solid transparent;
        box-shadow: 4px 4px 7px 1px #00000040;
    }

    table{
        width:100%;
       
    }
    
    .tbl-header{
        background-color: rgba(255,255,255,0.3);
    }

</style>
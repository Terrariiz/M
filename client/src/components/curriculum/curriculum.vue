<template>
  <div class="curriculum">
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
                                        Curriculum
                                    <v-spacer></v-spacer>
                                    <v-dialog v-model="dialog" max-width="700">
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="primary" dark class="mr-5" v-on="on" prepend-icon="mdi-clipboard-text-multiple-outline">Insert curriculum</v-btn>
                                    </template>
                                    <v-card>
                                        <v-form  ref="form_input_course" v-model="valid">
                                            <v-card-title>
                                            <span class="headline">{{ formTitle }}</span>
                                            </v-card-title>

                                            <v-card-text>
                                                <v-container>
                                                    <v-row>
                                                        <v-col cols="12" sm="6" md="6">
                                                            <v-text-field v-model="editedItem.name" :rules="nameRules" :counter="50" label="name" prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="6">
                                                            <v-text-field v-model="editedItem.degree"  label="degree"  prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
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
                                    :items="curriculum"
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
                                            @click="cf_delete_curriculum(item.curriculum_id)"
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
    name:'course',
    components:{
        Navbar
    },
    data (){
        return{
            curriculum  : [],
            valid: true,
            dialog: false,
            search: '',
            headers_table: [
                { text: 'curriculum_id' ,value: 'curriculum_id' },
                { text: 'Name'          ,value: 'name' },
                { text: 'Degree'        ,value: 'degree' },
                { text: 'Action'        ,value: 'action', sortable: false}
            ],
            editedIndex: -1,
            editedItem: {
                curriculum_id   : '',
                name            : '',
                degree          : '',
            },
            defaultItem: {
                curriculum_id   : '',
                name            : '',
                degree          : '',
            },
            nameRules: [
                v => !!v || 'input is required',
                v => v.length <= 50 || 'input must be less than 50 characters',
            ],
        }
    },

    async created() {
        this.intialCuriculum();
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Insert curriculum' : 'Edit curriculum'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    
    methods: {

        async intialCuriculum (){
            try{
                const res = await this.axios.request({
                    method: 'get',
                    url: `http://localhost:5000/search/curriculum?list=true`,
                    headers: authHeader()
                }).then(res =>{
                    this.curriculum = res.data.data
                }).catch(res =>{
                    console.error(res)
                })
            }catch(err){
                console.error(err)
            }
        },

        close () {
            this.dialog = false
            setTimeout(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            }, 300)
        },

        editItem (item) {
            this.editedIndex = this.curriculum.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        async save () {
            if (this.editedIndex > -1) {
                console.log(this.editedItem)
                await this.edit_curriculum()
            } else {
                await this.insert_curriculum()
            }
        },

        async insert_curriculum () {
            const formData = {
                name      : this.editedItem.name,
                degree    : this.editedItem.degree,
            };

            const encodeForm = (data) => {
                return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            };

            try{
                return await this.axios.post(
                        'http://localhost:5000/curriculum/', 
                        encodeForm(formData),
                        { headers: authHeader()
                        })
                        .then(res => {
                            this.$swal({
                                toast: true,
                                position: 'bottom-end',
                                icon: 'success',
                                title: 'insert curiculum success',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            this.intialCuriculum();
                            this.dialog = false;
                        })
                        .catch(err => {
                            this.$swal({
                                toast: true,
                                position: 'bottom-end',
                                icon: 'error',
                                title: 'insert curiculum false',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                        })
            }catch(err){
                console.error(err)
            }
        },

        async edit_curriculum () {
                const formData = {
                    id        : this.editedItem.curriculum_id,
                    name      : this.editedItem.name,
                    degree      : this.editedItem.degree,
                };

                const encodeForm = (data) => {
                    return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
                };

                let id = this.editedItem.curriculum_id
                let url  = `http://localhost:5000/curriculum/${id}`

                try{
                    return await this.axios.put(
                                url, 
                                encodeForm(formData),
                                { headers: authHeader()}
                    ).then(res => {
                        this.$swal({
                                toast: true,
                                position: 'bottom-end',
                                icon: 'success',
                                title: 'edit curiculum success',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                        });
                        this.intialCuriculum();
                        this.dialog = false;
                    }).catch(err => {
                       this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'error',
                            title: 'insert curiculum false',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                }catch(err){
                    
                }
        },

        cf_delete_curriculum: function (id) {
            this.$swal({
                title: 'Are you sure?',
                text: `Do you want to delete adviser id ${id}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    this.Delete_curriculum(id)
                }
            })
        },

        Delete_curriculum: async function(id) {
            try{
                const res = await this.axios.request({
                method: 'delete',
                url: `http://localhost:5000/curriculum/${id}`,
                headers: authHeader()
                }).then(res =>{
                    this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'success',
                            title: 'delete curiculum success',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                    });
                    this.intialCuriculum();
                    this.dialog = false;
                }).catch(res =>{
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'error',
                        title: 'delete curiculum false',
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
</style>
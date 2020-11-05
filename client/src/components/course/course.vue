<template>
  <div class="course">
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
                                        Course
                                    <v-spacer></v-spacer>
                                    <v-dialog v-model="dialog" max-width="700">
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="primary" dark class="mr-5" v-on="on" prepend-icon="mdi-clipboard-text-multiple-outline">Insert Course</v-btn>
                                    </template>
                                    <v-card>
                                        <v-form  ref="form_input_course" v-model="valid">
                                            <v-card-title>
                                            <span class="headline">{{ formTitle }}</span>
                                            </v-card-title>

                                            <v-card-text>
                                                <v-container>
                                                    <v-row>
                                                        <v-col  v-if="editedIndex === -1" cols="12" sm="6" md="4">
                                                            <v-text-field v-model="editedItem.course_id" :rules="nameRules" :counter="50" label="course_id" prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="4">
                                                            <v-text-field v-model="editedItem.name" :rules="nameRules" :counter="50" label="name" prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="4">
                                                            <v-text-field v-model="editedItem.year"  label="year"  prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="4">
                                                            <v-text-field v-model="editedItem.department" :rules="nameRules" :counter="50" label="department"  prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" sm="6" md="4">
                                                            <v-text-field v-model="editedItem.credit"  label="credit"  prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
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
                                    :items="query_course"
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
                                            @click="cf_delete_course(item.course_id)"
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
            valid: true,
            dialog: false,
            search: '',
            headers_table: [
                { text: 'course_id'     ,value: 'course_id' },
                { text: 'Name'          ,value: 'name' },
                { text: 'Year'          ,value: 'year' },
                { text: 'Department'    ,value: 'department' },
                { text: 'Credit'        ,value: 'credit' },
                { text: 'action'        ,value: 'action', sortable: false}
            ],
            editedIndex: -1,
            editedItem: {
                course_id   : "",
                name        : '',
                year        : '',
                department  : '',
                credit      : ''
            },
            defaultItem: {
                course_id   : "",
                name        : '',
                year        : '',
                department  : '',
                credit      : '',
            },
            query_course  : [],
            nameRules: [
                v => !!v || 'input is required',
                v => v.length <= 50 || 'input must be less than 50 characters',
            ],
        }
    },

    async created() {
        this.intialCourse();
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Insert Course' : 'Edit Course'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    
    methods: {
        async intialCourse (){
            try{
            const res = await this.axios.request({
                method: 'get',
                url: `http://localhost:5000/search/courses?list=true`,
                    headers: authHeader()
                }).then(res =>{
                    this.query_course = res.data.data
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
            this.editedIndex = this.query_course.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        async save () {
            if (this.editedIndex > -1) {
                await this.edit_course()
            } else {
                await this.insert_course()
            }
        },

        async insert_course () {
            const formData = {
                courseId  : this.editedItem.course_id,
                name      : this.editedItem.name,
                year      : this.editedItem.year,
                department: this.editedItem.department,
                credit    : this.editedItem.credit,
            };

            const encodeForm = (data) => {
                return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            };

            try{
                return await this.axios.post(
                    'http://localhost:5000/course/', 
                    encodeForm(formData),
                    { headers: authHeader()})
                    .then(res => {
                        this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'success',
                            title: 'Insert course success',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        this.dialog = false;
                        this.intialCourse();
                    })
                    .catch(err => {
                        this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'error',
                            title: 'Insert course false',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        this.dialog = false;
                    })
            }catch(err){
                console.error(err)
            }
        },

        async edit_course () {
                const formData = {
                    id        : this.editedItem.course_id,
                    name      : this.editedItem.name,
                    year      : this.editedItem.year,
                    department: this.editedItem.department,
                    credit    : this.editedItem.credit,
                };

                console.log(formData)

                const encodeForm = (data) => {
                    return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
                };

                let id = this.editedItem.course_id
                let url  = `http://localhost:5000/course/${id}`

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
                            title: 'Edit course success',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        this.intialCourse();
                        this.dialog = false;
                    }).catch(err => {
                       this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'error',
                            title: 'Edit course false',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                }catch(err){
                    
                }
        },

        cf_delete_course: function (ids) {
            this.$swal({
            title: 'Are you sure?',
            text: `Do you want to delete adviser id ${ids}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    this.delete_course(ids)
                }
            })
        },

        delete_course: async function(ids) {
            try{
                const res = await this.axios.request({
                method: 'delete',
                url: `http://localhost:5000/course/${ids}`,
                headers: authHeader()
                }).then(res =>{
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'success',
                        title: 'delete course success',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.intialCourse();
                }).catch(res =>{
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'error',
                        title: 'delete course false',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.intialCourse();
                })
            }catch(err){
                console.error(err)
            }
        },
    },
}
</script>

<style scoped>
    .btn_class_card{
            margin: 10px;
            position: relative;
            float: right;
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
</style>
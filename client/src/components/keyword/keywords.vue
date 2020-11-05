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
                                        Keywords
                                    <v-spacer></v-spacer>
                                    <v-dialog v-model="dialog" max-width="500">
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="primary" dark class="mr-5" v-on="on" prepend-icon="mdi-clipboard-text-multiple-outline">Insert Keywords</v-btn>
                                    </template>
                                    <v-card>
                                        <v-form  ref="form_input_course" v-model="valid">
                                            <v-card-title>
                                            <span class="headline">{{ formTitle }}</span>
                                            </v-card-title>

                                            <v-card-text>
                                                <v-container>
                                                    <v-row>
                                                        <v-col cols="12" >
                                                            <v-text-field v-model="editedItem.keyword" :rules="nameRules" :counter="50" label="keyword name" prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
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
                                    :items="query_keyword"
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
                                            @click="cf_delete_course(item.keyword_id)"
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
    name:'keyword',
    components:{
        Navbar
    },
    data (){
        return{
            valid: true,
            dialog: false,
            search: '',
            headers_table: [
                { text: 'Keyword id'     ,value: 'keyword_id' },
                { text: 'Keyword name'   ,value: 'keyword' },
                { text: 'action'        ,value: 'action', sortable: false}
            ],
            editedIndex: -1,
            editedItem: {
                keyword_id   : '',
                keyword      : '',
            },
            defaultItem: {
                keyword_id   : '',
                keyword      : '',
            },
            query_keyword  : [],
            nameRules: [
                v => !!v || 'input is required',
                v => v.length <= 50 || 'input must be less than 50 characters',
            ],
        }
    },

    async created() {
        this.intialKeyword();
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Insert Keyword' : 'Edit Keyword'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    
    methods: {
        async intialKeyword (){
            try{
            return await this.axios.request({
                method: 'get',
                url: `http://localhost:5000/search/keyword?list=true`,
                    headers: authHeader()
                }).then(res =>{
                    this.query_keyword = res.data.data
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
            this.editedIndex = this.query_keyword.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        async save () {
            if (this.editedIndex > -1) {
                await this.edit_keyword()
            } else {
                await this.insert_keyword()
            }
        },

        async insert_keyword () {
            const formData = {
                keyword  : this.editedItem.keyword,
            };
            
            try{
                return await this.axios.request({
                method: 'post',
                url: `http://localhost:5000/keyword/${formData.keyword}`,
                headers: authHeader()
                }).then(res => {
                        this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'success',
                            title: 'Insert keyword success',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        this.dialog = false;
                        this.intialKeyword();
                    })
                    .catch(err => {
                        this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'error',
                            title: 'Insert keyword false',
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

        async edit_keyword () {
            const formData = {
                keyword  : this.editedItem.keyword,
            };

            let id = this.editedItem.keyword_id

            try{
                return await this.axios.request({
                    method: 'put',
                    url: `http://localhost:5000/keyword/${id}/${formData.keyword}`,
                    headers: authHeader()
                }).then(res => {
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'success',
                        title: 'Edit keyword success',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.intialKeyword();
                    this.dialog = false;
                }).catch(err => {
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'error',
                        title: 'Edit keyword false',
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
            text: `Do you want to delete keyword id ${ids}`,
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
                url: `http://localhost:5000/keyword/${ids}`,
                headers: authHeader()
                }).then(res =>{
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'success',
                        title: 'delete keyword success',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.intialKeyword();
                }).catch(res =>{
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'error',
                        title: 'delete keyword false',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.intialKeyword();
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
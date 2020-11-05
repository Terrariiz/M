<template>
  <div class="documents">
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
                                        Documents
                                    <v-spacer></v-spacer>
                                    <v-dialog v-model="dialog" max-width="700">
                                    <v-card>
                                        <v-form  ref="form_input_course" v-model="valid">
                                            <v-card-title>
                                            <span class="headline">Edit Document</span>
                                            </v-card-title>

                                            <v-card-text>
                                                <v-container>
                                                    <v-row>
                                                        <v-col cols="12" sm="12" >
                                                            <v-text-field disabled v-model="editedItem.document_id" label="document id" prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                        </v-col>
                                                        
                                                        <v-col cols="12" sm="6" md="6">
                                                            <v-text-field v-model="editedItem.name"  label="name" prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                        </v-col>

                                                        <v-col cols="12" sm="6" md="6">
                                                            <v-text-field v-model="editedItem.abstract"  label="degree"  prepend-icon="mdi-clipboard-text-multiple-outline" required></v-text-field>
                                                        </v-col>

                                                        <!-- <v-col cols="12" sm="6" md="6">
                                                            <v-select 
                                                            v-model="editedItem.adviser_id"
                                                            :items="data_adviser"
                                                            :menu-props="{ maxHeight: '400' }"
                                                            label="Select adviser"
                                                            persistent-hint
                                                            chips
                                                            item-text="first_name"
                                                            item-value="adviser_id"
                                                            prepend-icon="mdi-account-check"
                                                            max-height="auto">
                                                                <template slot='item' slot-scope='{ item }'>
                                                                    {{ item.first_name }} {{ item.last_name }}
                                                                </template>
                                                            </v-select>
                                                        </v-col>

                                                        <v-col cols="12" sm="6" md="6">
                                                            <v-select 
                                                            v-model="editedItem.coadviser_id"
                                                            :items="data_adviser"
                                                            :menu-props="{ maxHeight: '400' }"
                                                            label="Select coadviser"
                                                            persistent-hint
                                                            chips
                                                            multiple
                                                            item-text="first_name"
                                                            item-value="adviser_id"
                                                            prepend-icon="mdi-account-check"
                                                            max-height="auto">
                                                                <template slot='item' slot-scope='{ item }'>
                                                                    {{ item.first_name }} {{ item.last_name }}
                                                                </template>
                                                            </v-select>
                                                        </v-col> -->
                                                        
                                                        <v-col cols="12" >
                                                            <v-file-input 
                                                                id="thesis"
                                                                name="thesis"
                                                                v-model="file"
                                                                ref="thesis"
                                                                accept=".pdf"
                                                                show-size 
                                                                label="File input"
                                                                prepend-icon="mdi-clipboard-text-multiple-outline"
                                                            ></v-file-input>
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
                                    :items="documents"
                                    :items-per-page="10"
                                    :search="search"
                                    >
                                    <template v-slot:item.action="{ item }">
                                        <v-icon
                                            small
                                            @click.prevent="dowloadPdf(item)"
                                        >
                                            get_app
                                        </v-icon>
                                        <v-icon
                                            small
                                            @click="editItem(item)"
                                        >
                                            edit
                                        </v-icon>
                                        <v-icon
                                            small
                                            @click="cf_delete_documents(item.document_id)"
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
            file: [],
            documents     : [],
            data_adviser  : [], 
            valid         : true,
            dialog        : false,
            search        : '',
            headers_table : [
                { text: 'document id' ,value: 'document_id' },
                { text: 'name'        ,value: 'name' },
                { text: 'abstract'    ,value: 'abstract' },
                // { text: 'adviser id'  ,value: `adviser_id` },
                // { text: 'authors id'  ,value: 'authors_id' },
                // { text: 'coadvisers id',value: 'coadvisers_id' },
                // { text: 'commitees'   ,value: 'commitees' },
                { text: 'upload date' ,value: 'upload_dt' },
                { text: 'Action'      ,value: 'action', sortable: false}
            ],
            editedItem: {
                document_id   : '',
                name          : '',
                abstract      : '',
                adviser_id    : '',
                authors_id    : [],
                coadvisers_id : [],
                commitees     : [],
                upload_dt     : '',
                file_path     : '',
            },
            nameRules: [
                v => !!v || 'input is required',
                v => v.length <= 50 || 'input must be less than 50 characters',
            ],
        }
    },

    async created() {
        this.intialdocuments();
        this.intialAdviser();
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    
    methods: {
        intialdocuments: async function (){
            try{
                const res = await this.axios.request({
                    method: 'get',
                    url: `http://localhost:5000/search/documents?list=true`,
                    headers: authHeader()
                }).then(res =>{
                    this.documents = res.data.data
                    console.log(this.documents)
                }).catch(res =>{
                    console.error(res)
                })
            }catch(err){
                console.error(err)
            }
        },

        intialAdviser: async function(){
            try{
                return await this.axios.request({
                    method: 'get',
                    url: 'http://localhost:5000/search/advisers?list=true',
                    headers: authHeader()
                }).then(res =>{
                    this.data_adviser  = res.data.data
                }).catch(res =>{
                    console.error(res)
                })
            }catch(err){
                console.error(err)
            }
        },

        close: function() {
            this.dialog = false
            setTimeout(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            }, 300)
        },

        editItem: function (item) {
            this.editedIndex = this.documents.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        save: async function () {
            await this.edit_documents()
        },

        edit_documents: async function () {
            console.log(this.editedItem.authors_id.split(','))
        },

        cf_delete_documents: function (id) {
            this.$swal({
                title: 'Are you sure?',
                text: `Do you want to delete documents id ${id}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    this.Delete_documents(id)
                }
            })
        },

        Delete_documents: async function(id) {
            try{
                const res = await this.axios.request({
                method: 'delete',
                url: `http://localhost:5000/document/${id}`,
                headers: authHeader()
                }).then(res =>{
                    this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'success',
                            title: 'delete documents success',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                    });
                    this.intialdocuments();
                    this.dialog = false;
                }).catch(res =>{
                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'error',
                        title: 'delete documents false',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
            }catch(err){
                console.error(err)
            }
        },

        dowloadPdf:async function(item){
            try {
                return await this.axios.request({
                    method: 'get',
                    url: `http://localhost:5000${item.file_path}`,
                    headers: authHeader(),
                    responseType: 'blob'
                })
                .then(response => {
                    const blob = new Blob([response.data], { type: 'application/pdf' })
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.download = item.name
                    link.click()
                    URL.revokeObjectURL(link.href)
                    this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'success',
                            title: 'dowload documents success',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                    });
                }).catch(err => {
                    this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            icon: 'dowload',
                            title: 'dowload documents false',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                    });
                })
            } catch (error) {
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
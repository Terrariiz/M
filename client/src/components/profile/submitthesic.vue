<template>
    <v-app>
        <div class="submit_thesic">
            <SlideBars></SlideBars>
            <div class="content">
                <div class="section full-height">
                    <div class="absolute-center">
                        <div class="section">
                            <div class="container">
                                <div class="thesic_form">
                                    <div class="header-title">
                                        <h2>SUBMIT THESIC</h2>
                                    </div>

                                    <v-form ref="submit_thesic" v-model="valid" enctype="multipart/form-data">
                                        <div class="header-title">
                                            <h4>FILE</h4>
                                            <hr>
                                        </div>
                                        <div class="file_group">
                                            <v-select 
                                                v-model="courseId"
                                                :items="data_course"
                                                :menu-props="{ maxHeight: '400' }"
                                                label="Select coures"
                                                required
                                                persistent-hint
                                                item-text="name"
                                                item-value="course_id"
                                                prepend-icon="mdi-account-check"
                                                max-height="auto"
                                                :rules="abstractRules"
                                                >
                                                <template slot='item' slot-scope='{ item }'>
                                                    {{ item.course_id }} - {{ item.name }}
                                                </template>
                                            </v-select>

                                            <v-text-field
                                                v-model="name"
                                                :rules="nameRules"
                                                :counter="50"
                                                label="Name"
                                                prepend-icon="mdi-clipboard-text-multiple-outline"
                                                required
                                            ></v-text-field>
                                                
                                            <v-textarea
                                                v-model="abstract"
                                                :rules="abstractRules"
                                                name="input-7-1"
                                                label="abstract"
                                                auto-grow
                                                prepend-icon="mdi-book-information-variant"
                                                required
                                            ></v-textarea>
                                            
                                            <v-file-input 
                                                id="thesis"
                                                name="thesis"
                                                :rules="fileRules"
                                                v-model="file"
                                                ref="thesis"
                                                accept=".pdf"
                                                show-size 
                                                label="File input"
                                                prepend-icon="mdi-clipboard-text-multiple-outline"
                                            ></v-file-input>

                                            <v-select 
                                                v-model="keywords"
                                                :items="data_keyword"
                                                :menu-props="{ maxHeight: '400' }"
                                                label="Select keywords"
                                                multiple
                                                chips
                                                required
                                                persistent-hint
                                                item-text="keyword"
                                                item-value="keyword_id"
                                                prepend-icon="mdi-account-check"
                                                max-height="auto"
                                                :rules="KeywordsRules"
                                            >
                                            </v-select>
                                        </div>

                                        <div class="student_group" >
                                            <div class="header-title">
                                                <h4>GROUP</h4>
                                                <p style="color: red;">*insert only member in your group</p>
                                                <hr>
                                            </div>
                                                 
                                            <div class="student_array">
                                                <v-row>
                                                    <v-col cols="12" sm="4" md="4">
                                                        <v-text-field
                                                            v-model="student_id_0"
                                                            label="Student ID"
                                                            prepend-icon="mdi-face">
                                                        </v-text-field>
                                                    </v-col>

                                                    <v-col cols="12" sm="8" md="8">
                                                        <v-text-field
                                                            disabled
                                                            solo
                                                            v-model="student_name_0"
                                                            label="Name"
                                                            prepend-icon="mdi-face">
                                                        </v-text-field>
                                                    </v-col>

                                                    <v-col cols="12" sm="4" md="4">
                                                        <v-text-field
                                                            v-model="student_id_1"
                                                            label="Student ID"
                                                            prepend-icon="mdi-face">
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="8" md="8">
                                                        <v-text-field
                                                            disabled
                                                            solo
                                                            v-model="student_name_1"
                                                            label="Name"
                                                            prepend-icon="mdi-face">
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </div>                                               

                                            <v-row>
                                                <v-btn
                                                class="mr-4"
                                                id="btn-danger"
                                                @click="reset_student_group"
                                                >
                                                Reset
                                                </v-btn>
                                            </v-row>
                                        </div>

                                        <div class="adviser_group">
                                            <div class="header-title">
                                                <h4>ADVISER</h4>
                                                <hr>
                                            </div>

                                            <v-row align="center">
                                                <v-col cols="12" sm="3">
                                                    <v-subheader v-text="'ADIVISER'"></v-subheader>
                                                </v-col>
                                                <v-col cols="12" sm="9">
                                                    <v-select 
                                                    v-model="adviserId"
                                                    :items="data_adviser"
                                                    :menu-props="{ maxHeight: '400' }"
                                                    label="Select"
                                                    required
                                                    persistent-hint
                                                    item-text="first_name"
                                                    item-value="adviser_id"
                                                    prepend-icon="mdi-account-check"
                                                    max-height="auto"
                                                    :rules="abstractRules"
                                                    >
                                                    <template slot='item' slot-scope='{ item }'>
                                                        {{ item.first_name }}    {{ item.last_name }}
                                                    </template>
                                                    </v-select>
                                                </v-col>

                                                <v-col cols="12" sm="3">
                                                    <v-subheader v-text="'COADVISER'"></v-subheader>
                                                </v-col>
                                                <v-col cols="12" sm="9">
                                                    <v-select 
                                                    v-model="coadviser"
                                                    :items="data_adviser"
                                                    :menu-props="{ maxHeight: '400' }"
                                                    label="Select"
                                                    multiple
                                                    persistent-hint
                                                    item-text="first_name"
                                                    item-value="adviser_id"
                                                    prepend-icon="mdi-account-check"
                                                    max-height="auto"
                                                    :rules="AdviserRules"
                                                    >
                                                    <template slot='item' slot-scope='{ item }'>
                                                        {{ item.first_name }} {{ item.last_name }}
                                                    </template>
                                                    </v-select>
                                                </v-col>

                                                <v-col cols="12" sm="3">
                                                    <v-subheader v-text="'COMMITEE'"></v-subheader>
                                                </v-col>
                                                <v-col cols="12" sm="9">
                                                    <v-select 
                                                    v-model="commitees"
                                                    :items="data_adviser"
                                                    :menu-props="{ maxHeight: '400' }"
                                                    label="Select"
                                                    multiple
                                                    required
                                                    persistent-hint
                                                    item-text="first_name"
                                                    item-value="adviser_id"
                                                    prepend-icon="mdi-account-check"
                                                    max-height="auto"
                                                    :rules="CommiteeRules"
                                                    >
                                                    <template slot='item' slot-scope='{ item }'>
                                                        {{ item.first_name }} {{ item.last_name }}
                                                    </template>
                                                    </v-select>
                                                </v-col>
                                            </v-row>    
                                        </div>

                                        <v-checkbox
                                            v-model="confilm_submit"
                                            :rules="confilmRules"
                                            label="Confirm ?"
                                            required
                                        ></v-checkbox>

                                        <v-btn
                                            :disabled="!valid"
                                            class="mr-4"
                                            id="btn-success"
                                            @click="submit"
                                        >SUBMIT
                                        </v-btn>

                                        <v-btn
                                            class="mr-4 btn-danger"
                                            @click="reset"
                                        >Reset
                                        </v-btn>
                                    </v-form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </v-app>
</template>

<script>
const SlideBars = () => import ('@/components/student/profile/student_nav')
import authHeader from '../../../autheader/header_std'
export default {
    name: "submitThesic",
    components:{
        SlideBars
    },

    data(){
        return{
            valid           : true,
            confilm_submit  : false,
            data_adviser    : [], 
            data_keyword    : [],
            data_course     : [],
            student_id_0    : "",
            student_id_1    : "",
            student_name_0  : "",
            student_name_1  : "",
            student_array   : [],
            adviserId       : "",
            courseId        : "",
            coadviser       : [],
            commitees       : [],
            file            : [],
            keywords        : [],
            name            : "",
            abstract        : "",
            confilmRules    :[
                v => !!v || 'You must agree to continue!',
            ],
            nameRules       : [
                v => !!v || 'Name is required',
                v => v.length <= 50 || 'Name must be less than 50 characters',
            ],
            fileRules       :[
                v => !!v || 'files is required',
                v => !v || v.size < 10000000 || 'file size should be less than 10 MB'
            ],
            abstractRules       :[
                v => !!v || 'Input is required'
            ],
            AdviserRules          :[
                v => v.length <= 3  || 'Adviser is Max 3 '
            ],
            KeywordsRules :[
                v => v != 0  || 'Keywords is required',
                v => v.length <= 10  || 'Keywords is Max 10 '
            ],
            CommiteeRules :[
                v => v != 0  || 'Commitee is required',
                v => v.length <= 3  || 'Commitee is Max 10 '
            ],

        }
    },

    async created() {
        this.intialAdviser();
        this.intialKeyword();
        this.intialCourse();
    },

    watch: {
        student_id_0:async function (student_id) {
            if( !this.student_id_0 || this.student_id_0.length < 11){
                this.student_name_0     = ""
                this.student_array[0]   = null
            }else if( this.student_id_0.length === 11 ){
                const get_student_name  = await this.find_student_name(student_id)
                this.student_name_0     = get_student_name.data.data.first_name + ' ' + get_student_name.data.data.last_name  
                this.student_array[0]   = student_id   
            }
        },

        student_id_1:async function (student_id) {
            if( !this.student_id_1 || this.student_id_1.length < 11 || this.student_id_1.length > 12){
                this.student_name_1     = ""
                this.student_array[1]   = null
            }else if( this.student_id_1.length === 11 ){
                const get_student_name  = await this.find_student_name(student_id)
                this.student_name_1     = get_student_name.data.data.first_name + ' ' + get_student_name.data.data.last_name   
                this.student_array[1]   = student_id   
            }   
        },
    },

    methods: {
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

        intialKeyword: async function(){
            try{
                return await this.axios.request({
                    method: 'get',
                    url: `http://localhost:5000/search/keyword?list=true`,
                    headers: authHeader()
                    }).then(res =>{
                        this.data_keyword = res.data.data
                    }).catch(res =>{
                        console.error(res)
                    })
            }catch(err){
                console.error(err)
            }
        },

        intialCourse: async function(){
            try{
                return await this.axios.request({
                    method: 'get',
                    url: `http://localhost:5000/search/courses?list=true`,
                    headers: authHeader()
                    }).then(res =>{
                        this.data_course = res.data.data
                    }).catch(res =>{
                        console.error(res)
                    })
            }catch(err){
                console.error(err)
            }
        },


        //optimize - import db kmutt and connect
        find_student_name: async function (student_id){   
            const std_id = student_id; 
            const check_student_name = await this.axios.request({
                method: 'get',
                url: `http://localhost:5000/users/`,
                headers: authHeader(),
                'Content-Type': 'multipart/form-data'
            })
            return check_student_name;
        },

        submit:async function () {
            const formData = new FormData();
                formData.append('thesis'    , this.file );
                formData.append('name'      , this.name);
                formData.append('abstract'  , this.abstract);
                formData.append('keywords'  , this.keywords);
                formData.append('courseId'  , this.courseId);
                formData.append('adviserId' , this.adviserId);
                formData.append('coadvisers', this.coadviser);
                formData.append('commitees' , this.commitees);
                formData.append('students'  , this.student_array);  

            if (this.$refs.submit_thesic.validate()) {
                let token = window.localStorage.getItem('tsic_std_token')
                try{
                    return  await this.axios.request({
                        method  : 'post',
                        url     : 'http://localhost:5000/document/',
                        headers :  {
                                    'Authorization' : 'Bearer ' + token,
                                    'Content-Type'  : 'multipart/form-data',
                            },
                        data    : formData
                            }).then(res => {
                                if(res.data.success){
                                    this.$swal({
                                        toast: true,
                                        position: 'bottom-end',
                                        icon: 'success',
                                        title: 'Insert document success',
                                        timerProgressBar: true,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    this.$router.push('/home')
                                }else{
                                    this.$swal({
                                        toast: true,
                                        position: 'bottom-end',
                                        icon: 'error',
                                        title: `${res.data.message}`,
                                        timerProgressBar: true,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }
                            })
                            .catch(err => {
                               this.$swal({
                                    toast: true,
                                    position: 'bottom-end',
                                    icon: 'error',
                                    title: 'Insert document false',
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            })
                }catch(err){
                     console.error(err)
                }
            }
        },

        reset () {
            this.student_id_0 = "",
            this.student_id_1 = "",
            this.student_id_2 = "",
            this.student_name_0   = "",
            this.student_name_1   = "",
            this.student_name_2   = "",
            this.student_array = [],
            this.adviser    = [],
            this.commitees  = [],
            this.file       = [],
            this.name       = "",
            this.abstract   = "",
            this.confilm_submit = false
        },

        reset_student_group(){
            this.student_id_0 = "",
            this.student_id_1 = "",
            this.student_id_2 = "",
            this.student_name_0   = "",
            this.student_name_1   = "",
            this.student_name_2   = ""
            this.student_array    = []
        }
    },
}
</script>

<style scoped>

#btn-danger{
    color: white;
    background-color: red;
}

#btn-success{
    color: white;
    background-color: green;
}
.header-title{
    margin-bottom: 50px;
    margin-top: 20px;
}

.thesic_form{
    max-width: 700px;
    padding: 0 30px;
    margin: auto;
}
.section {
	position: absolute;
	width: 100%;
}

.full-height {
    height: 100%;
    background-color: transparent;
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
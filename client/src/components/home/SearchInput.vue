<template>
    <div class="SearchContent"> 
        <div v-if="thesisList == 0" class="searchSteper mt-12">
            <div class="header-title">
                <h2>Search Thesis</h2>
            </div>
            <v-stepper v-model="searchThesis" vertical >
                <v-stepper-step :complete="searchThesis > 1" step="1" color="#5ad67d">
                Select type collections.
                </v-stepper-step>

                <v-stepper-content step="1">
                    <v-card flat  height="150px" max-width="600">
                        <v-select class="mt-12 mr-2 ml-2" height="60" 
                        v-model="inputSelect"
                        :rules="[inputSelect => !!inputSelect || 'Item is required']"
                        :items="items"
                        label="Select type collections."
                        solo
                        required
                        ></v-select>
                    </v-card>
                <v-btn color="#5ad67d" @click="handleList" :disabled="!inputSelect">Continue</v-btn>
                </v-stepper-content>

                <v-stepper-step color="#5ad67d" :complete="searchThesis > 2" step="2">Input {{ this.inputSelect}}</v-stepper-step>

                <v-stepper-content step="2">
                    <v-card  flat height="150px" max-width="600">
                        <div class="inputSelect" v-if="inputSelect === 'thesisname'">
                            <v-text-field class="mt-12 mr-2 ml-2" height="60"
                            v-model="inputMessage"
                            :rules="InputRules"
                            :counter="50"
                            solo
                            label="Input Thesis name"
                            clearable
                            required
                            ></v-text-field>
                        </div>
                        
                        <div class="inputSelect" v-else >
                            <v-select class="mt-6 mr-2 ml-2" height="60"
                                v-model="inputMessage"
                                :rules="[inputMessage => !!inputMessage || 'Item is required']"
                                :items="dataList"
                                label="select"
                                solo
                                required
                            ></v-select>
                        </div>
                    </v-card>
                <v-btn color="#5ad67d" @click="searchThesis = 3" :disabled="!inputMessage">Search</v-btn>
                <v-btn text @click="searchThesis = 1">Cancel</v-btn>
                </v-stepper-content>
            </v-stepper>
        </div>

        <div v-else class="SerachNav">
            <div class="nav">
                <div class="header-title">
                    <h2>Search Thesis</h2>
                </div>
                <v-row>
                    <v-col cols="12" sm="4" md="4">
                        <v-select class="mt-6 mr-2 ml-2" height="60"
                            v-model="inputSelect"
                            :rules="[inputSelect => !!inputSelect || 'Item is required']"
                            :items="items"
                            label="Select type collections."
                            solo
                            required
                            @change="handleList"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="8" md="8">
                    <div class="inputSelect" v-if="inputSelect === 'thesisname'">
                                <v-text-field class="mt-6 mr-2 ml-2" height="60"
                                v-model="inputMessage"
                                :rules="InputRules"
                                :counter="50"
                                solo
                                label="Input Thesis name"
                                clearable
                                required
                                ></v-text-field>
                            </div>
                            
                            <div class="inputSelect" v-else >
                                <v-select class="mt-6 mr-2 ml-2" height="60"
                                    v-model="inputMessage"
                                    :rules="[inputMessage => !!inputMessage || 'Item is required']"
                                    :items="dataList"
                                    label="select"
                                    solo
                                    required
                                ></v-select>
                            </div>
                    </v-col>
                </v-row>
            </div>
            <div class="cardThesis">

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'SearchInput',
    data () {
      return {
        searchThesis: 1,
        items: ['advisers', 'courses', 'keyword', 'thesisname'],
        inputMessage : '',
        inputSelect : '',
        dataList    : [],
        thesisList  : [],
        InputRules:[
            v => !!v || 'input is required',
            v => (v && v.length <= 50) || 'input must be less than 50 characters',
        ]
      }
    },

    methods: {
        handleList: async function(){
            if(this.inputSelect === 'thesisname'){
                this.searchThesis = 2;
            }else{
                this.intialSelectData(this.inputSelect);
                this.searchThesis = 2;
            }
        },

        intialSelectData: async function(inputSelect){
            try{
                return await this.axios.request({
                    method: 'get',
                    url: `http://localhost:5000/search/${inputSelect}?list=true`,
                }).then(res =>{
                    this.dataList  = res.data.data
                }).catch(res =>{
                    console.error(res)
                })
            }catch(err){
                console.error(err)
            }
        },
    },

}
</script>

<style  scoped>
.v-stepper{
    box-shadow: none;
}
</style>
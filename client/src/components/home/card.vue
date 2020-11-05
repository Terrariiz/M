<template>
  <div class="main_content"> 
    <div class="skeleton_card" v-if="loading">
        <v-skeleton-loader
          ref="skeleton"
          boilerplate="false"
          tile="false"
          type="list-item-avatar-three-line"
          class="mx-auto"
        ></v-skeleton-loader>
    </div>

    <div class="card_content" v-else>
      <div class="card_form" v-for="(document , index ) in documents" :key="document.document_id">
      <div class="blog-card" v-if="index%2 === 1">
        <div class="meta">
          <pdf
            class="photo pdf_img"
            :src="`http://localhost:5000${document.file_path}`"
          >
          </pdf>
          <ul class="details">
            <li class="author">{{ document.authors_id }}</li>
            <li class="date">{{ document.upload_dt }}</li>
            <li class="tags">{{document.keywords}}</li>
          </ul>
        </div>
        <div class="description">
          <h1>{{ document.name}}</h1>
          <h2>Java is not the same as JavaScript</h2>
          <p>{{ document.abstract }}</p>
          <p class="read-more">
            <a @click.prevent="downloadPDF(document)">Dowload</a>
          </p>
        </div>
      </div>

      <div class="blog-card alt" v-else>
        <div class="meta">
          <pdf
            class="photo pdf_img"
            :src="`http://localhost:5000${document.file_path}`"
          >
          </pdf>
          <ul class="details">
            <li class="author">{{ document.authors_id }}</li>
            <li class="date">{{ document.upload_dt }}</li>
            <li class="tags">{{document.keywords}}</li>
          </ul>
        </div>
        <div class="description">
          <h1>{{ document.name}}</h1>
          <h2>{{ document.course_id }}</h2>
          <p>{{ document.abstract }}</p>
          <p class="read-more">
            <a @click.prevent="downloadPDF(document)">Dowload</a>
          </p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
    name: 'card',
     components: {
      pdf
    },
    data() {
      return {
        documents : [],
        loading   : true, 
      }
    },

    created() {
      this.intialDocument();
  
    },

    methods: {
      intialDocument: async function(){
        try{
          return await this.axios.request({
              method: 'get',
              url: `http://localhost:5000/search/documents?list=true&limit=5`,
            }).then(res =>{
                this.documents = res.data.data
                this.loading = false;
                console.log(this.documents)
            }).catch(res =>{
                console.error(res)
            })
        }catch(err){
            console.error(err)
        }
      },

      downloadPDF:async function(item){
        try {
            return await this.axios.request({
                method: 'get',
                url: `http://localhost:5000${item.file_path}`,
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
.annotationLayer{
  min-height: 165px;
}
canvas{
  min-height: 165px;
}

* {
  box-sizing: border-box;
}

body {
  background: #f1f1f1;
  margin: 2rem;
}

.blog-card {
  display: flex;
  flex-direction: column;
  margin: 1rem auto;
  box-shadow: 0 3px 7px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.6%;
  background: #fff;
  line-height: 1.4;
  border-radius: 5px;
  overflow: hidden;
  z-index: 0;
}
.blog-card a {
  color: inherit;
}
.blog-card a:hover {
  color: #5ad67d;
}
.blog-card:hover .photo {
  -webkit-transform: scale(1.3) rotate(3deg);
          transform: scale(1.3) rotate(3deg);
}
.blog-card .meta {
  position: relative;
  z-index: 0;
}
.blog-card .photo {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
  background-position: center;
  transition: -webkit-transform .2s;
  transition: transform .2s;
  transition: transform .2s, -webkit-transform .2s;
  max-height: 150px;
}
.blog-card .details,
.blog-card .details ul {
  margin: auto;
  padding: 0;
  list-style: none;
}
.blog-card .details {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -100%;
  margin: auto;
  transition: left .2s;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 10px;
  width: 100%;
  font-size: .9rem;
}

.blog-card .details ul li {
  display: inline-block;
}
.blog-card .details .author:before {
  font-family: "Font Awesome 5 Free";
  margin-right: 10px;
  content: "\f007";
}
.blog-card .details .date:before {
  font-family: "Font Awesome 5 Free";
  margin-right: 10px;
  content: "\f133";
}
.blog-card .details .tags:before {
  font-family: "Font Awesome 5 Free";
  content: "\f004";
  margin-right: 10px;
}
.blog-card .description {
  padding: 1rem;
  background: #fff;
  position: relative;
  z-index: 1;
  min-height: 150px;
}

.blog-card .description h1 {
  line-height: 1;
  margin: 0;
  font-size: 1.7rem;
}
.blog-card .description h2 {
  font-size: 1rem;
  font-weight: 300;
  text-transform: uppercase;
  color: #a2a2a2;
  margin-top: 5px;
}
.blog-card .description .read-more {
  text-align: right;
}
.blog-card .description .read-more a {
  color: #5ad67d;
  display: inline-block;
  position: relative;
}
.blog-card .description .read-more a:after {
  content: "\f0c7";
  font-family: "Font Awesome 5 Free";
  margin-left: -10px;
  opacity: 0;
  vertical-align: middle;
  transition: margin .3s, opacity .3s;
}
.blog-card .description .read-more a:hover:after {
  margin-left: 5px;
  opacity: 1;
}
.blog-card p {
  position: relative;
  margin: 1rem 0 0;
}
.blog-card p:first-of-type {
  margin-top: 1.25rem;
}
.blog-card p:first-of-type:before {
  content: "";
  position: absolute;
  height: 5px;
  background: #5ad67d;
  width: 35px;
  top: -0.75rem;
  border-radius: 3px;
}
.blog-card:hover .details {
  left: 0%;
}
@media (min-width: 640px) {
  .blog-card {
    flex-direction: row;
    max-width: 1000px;
  }
  .blog-card .meta {
    flex-basis: 40%;
    height: auto;
  }
  .blog-card .description {
    flex-basis: 60%;
  }
  .blog-card .description:before {
    -webkit-transform: skewX(-3deg);
            transform: skewX(-3deg);
    content: "";
    background: #fff;
    width: 30px;
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    z-index: -1;
  }
  .blog-card.alt {
    flex-direction: row-reverse;
  }
  .blog-card.alt .description:before {
    left: inherit;
    right: -10px;
    -webkit-transform: skew(3deg);
            transform: skew(3deg);
  }
  .blog-card.alt .details {
    padding-left: 25px;
  }
}

</style>
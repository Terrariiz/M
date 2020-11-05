<template>
    <div class="bg_content">
        <div class="container">
            <div class="blog_h100">
                <div class="thesis_content_search">
                    <div class="search_input">
                        <SearchInput></SearchInput>
                    </div>
                </div>
            </div>
            <div class="blog_h100">
                <div class="thesis_content_new">
                    <div class="header_title">
                        <h2>News Thesis</h2>
                    </div>
                    <div class="thesis_content">
                        <CardThesis></CardThesis>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const CardThesis  = () => import('./card')
const SearchInput = () => import('./SearchInput')
export default {
    name:'Content_bg',
    components: {
        CardThesis,SearchInput
  }
}
</script>

<style scoped>
    .container{
        background-color: rgba(255, 255, 255, 0.815);
        padding: 2rem 1.5rem;
    }
    .blog_h100{
        height: 80vh;
    }

    .thesis_content_new{
        margin-top: 100px;
    }
</style>


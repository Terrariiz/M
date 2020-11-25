<template>
      <div class="nav_header">
        <header id="masthead" role="banner">
          <div class="container">
            <button class="hamburger hamburger--boring" type="button">
              <span class="hamburger-box">
                <span class="hamburger-inner"></span>
              </span>
              <span class="hamburger-label">Online Thesis</span>
            </button>  
            <nav id="site-nav" role="navigation">
              <div class="col">
                <ul>
                  <h2><a  href="/home">Home</a></h2>
                </ul>  
                <h7>News</h7>
              </div>
              <div class="col">
                <ul>
                  <h2><router-link to="/signin">Sign in</router-link></h2>
                </ul> 
                <h7>For Staff</h7>
              </div>
              <div class="col">
                <ul>
                  <h2><router-link to="/student_signin">Sign in</router-link></h2>
                </ul> 
                <h7>For Student</h7>                
              </div>
              <div class="col">
              </div>
          </nav>
        </div>
      </header>
    </div>
</template>

<script>
export default {
  name: 'defaultNav',
  data () {
    return {
      
    },

    $(function () {
    "use strict";
    $('body').addClass('js');
      var $hamburger = $('.hamburger'),
      $nav = $('#site-nav'),
      $masthead = $('#masthead');
        $hamburger.click(function() {
          $(this).toggleClass('is-active');
          $nav.toggleClass('is-active');
          $masthead.toggleClass('is-active');
          return false; 
        })
    });
  },

}
</script>

<style scoped>
html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

html,
body {
  height: 100%;
}

html, body, div, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, ol, ul, li, form, legend, label, table, header, footer, nav, section, figure {
  margin: 0;
  padding: 0;
}

header, footer, nav, section, article, hgroup, figure {
  display: block;
}

body {
  font-size: 100%;
  line-height: 1.5;
}

.container {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
}

.container:after {
  content: "";
  display: table;
  clear: both;
}

.container {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  max-width: 1200px;
}

.nav_header {
  background: #5ad67d;
  background-size: cover;
  width: 100%;
  height: 80px;
  position: relative;
}

.nav_header:after {
  content: '';
  background: #5ad67d;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.nav_header * {
  position: relative;
  z-index: 1;
}

#masthead {
  padding: 1em 0;
  position: relative;
}

#masthead.is-active {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
}

#masthead:after {
  content: '';
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

#masthead.is-active:after {
  opacity: 1;
}

.hamburger {
  background-color: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  display: inline-block;
  float: left;
  font: inherit;
  margin: 0.8125em 0 1rem;
  overflow: visible; 
  outline: none;
  padding: 0;
  text-transform: none;
  transition: opacity 0.15s;
  -webkit-appearance: none;
}

.hamburger:hover {
  opacity: 0.7; 
}

.hamburger-box {
  width: 30px;
  height: 24px;
  display: inline-block;
  position: relative; 
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -2px; 
}

.hamburger-inner, 
.hamburger-inner::before, 
.hamburger-inner::after {
  width: 30px;
  height: 2px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  transition-property: -webkit-transform;
  transition-property: transform;
  transition-property: transform, -webkit-transform;
  transition-duration: 0.15s;
  transition-timing-function: ease; 
}

#masthead.is-active .hamburger-inner, 
#masthead.is-active .hamburger-inner::before, 
#masthead.is-active .hamburger-inner::after {
    background-color: #000;
}

.hamburger-inner::before, 
.hamburger-inner::after {
  content: "";
  display: block; 
}

.hamburger-inner::before {
  top: -6px; 
}

.hamburger-inner::after {
  bottom: -6px; 
}

/*
 * Boring
 */
.hamburger--boring .hamburger-inner, 
.hamburger--boring .hamburger-inner::before, 
.hamburger--boring .hamburger-inner::after {
  transition-property: none; 
}

.hamburger--boring.is-active .hamburger-inner {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg); 
}

.hamburger--boring.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0; 
}

.hamburger--boring.is-active .hamburger-inner::after {
  bottom: 0;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg); 
}

.hamburger-label {
  color: #fff;
  display: inline-block;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
  margin-left: 0.3125em;
  text-transform: uppercase;
}

#masthead.is-active .hamburger-label {
  color: #000;
}

.hamburger-box,
.hamburger-label {
  display: inline-block;
  vertical-align: middle;
}

#site-nav {
  clear: both;
  display: flex;
  flex-direction: column; 
  height: 0;
  overflow: hidden;
  /* padding-top: 2.5em; */
}

#site-nav.is-active {
  height: auto;
  overflow: visible;
}

#site-nav .col { 
  padding-bottom: 2.5em;
} 

@media screen and (max-width: 660px){
   #masthead-search{
    display: none;
  }
}

@media screen and (min-width: 320px) {
  #site-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  #site-nav .col {
    flex: 0 0 50%;
  } 

}

@media screen and (min-width: 550px) {
  #site-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  #site-nav .col {
    flex: 0 0 50%;
  } 
}

@media screen and (min-width: 768px) {
  #site-nav .col {
    flex: 0 0 33.333333333%;
  } 
}

@media screen and (min-width: 960px) {
  #site-nav {
    flex-wrap: nowrap;
  }
  
  #site-nav .col {
    flex: 0 0 20%;
  } 
  
  #site-nav .col:last-child {
    display: flex;
    justify-content: flex-end;
  } 
}

#site-nav h7 {
  color: #9b9b9b;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

#site-nav ul {
  list-style-type: none;
  margin-top: 1em;
}

#site-nav h7 {
  margin-bottom: 0.3125em;
}

#site-nav h2 a {
  color:#9b9b9b;
  text-decoration: none;
  transition: color 0.3s ease;
}

#site-nav h2 a:hover,
#site-nav h2 a:focus {
  color: #000000;
}

#site-nav .social {
  margin: 0;
  overflow: hidden;
}

#site-nav .social h2 {
  float: left;
  margin: 0 0.3125em;
  width: 32px;
  height: 32px;
}

#site-nav .social h2 svg {
  display: block;
  fill: #b4b9ba;
  width: 100%;
  height: 100%;
  transition: fill 0.3s ease;
}

#site-nav .social h2:hover svg {
  fill: #686d6e;
}

#masthead-search {
  float: right;
  width: 100%;
  max-width: 12em;
  position: relative;
  -webkit-appearance: none;
}

#masthead-search input {
  background: transparent;
  border: none;
  border-color: #fff;
  border-style: solid;
  border-width: 1px;
  border-radius: 50px;
  outline: none;
  width: 100%;
  padding: 0.75em 1.125em;
  transition: border-color 0.3s ease;
  -webkit-appearance: none;
}

#masthead-search button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1em;
  padding: 0;
  position: absolute;
  top: 50%;
  right: 0.75em;
  transform: translateY(-50%);
  -webkit-appearance: none;
}

#masthead.is-active #masthead-search button {
  color: #b4b9ba;
}

#masthead.is-active #masthead-search input {
  border-color: #b4b9ba;
}

#masthead-search ::-webkit-input-placeholder {
    color:    #fff;
}

#masthead-search :-moz-placeholder {
   color:    #fff;
   opacity:  1;
}

#masthead-search ::-moz-placeholder {
   color:    #fff;
   opacity:  1;
}

#masthead-search :-ms-input-placeholder {
   color:    #fff;
}

#masthead.is-active #masthead-search ::-webkit-input-placeholder {
    color:    #b4b9ba;
}

#masthead.is-active #masthead-search :-moz-placeholder {
   color:    #b4b9ba;
   opacity:  1;
}

#masthead.is-active #masthead-search ::-moz-placeholder {
   color:    #b4b9ba;
   opacity:  1;
}

#masthead.is-active #masthead-search :-ms-input-placeholder {
   color: #b4b9ba
}

#masthead .col {
  opacity: 0;
}

#masthead.is-active .col {
  transform: translateY(40px);
  transition: opacity 0.3s ease;
  animation: fade-in-stagger 0.8s ease forwards;
}

#masthead.is-active .col:nth-child(1) {
    -webkit-animation-delay: 0;
}

#masthead.is-active .col:nth-child(2) {
    -webkit-animation-delay: 0.1s;
}

#masthead.is-active .col:nth-child(3) {
    -webkit-animation-delay: 0.2s;
}

#masthead.is-active .col:nth-child(4) {
    -webkit-animation-delay: 0.3s;
}

#masthead.is-active .col:nth-child(5) {
    -webkit-animation-delay: 0.4s;
}

@keyframes fade-in-stagger {
  to {
    opacity: 1;
    transform: translateY(0); 
  }
}
</style>
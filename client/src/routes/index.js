import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//index
const index                     = () => import('@/components/index/index')

//main page
const home                      = () => import('@/components/home/home')

//sing_in staff page 
const signin                    = () => import('@/components/login/signin')

//staff profile
const profile                   = () => import('@/components/profile/profile')
const user_profile              = () => import('@/components/profile/user_profile')
const edit_user_profile         = () => import('@/components/profile/edit_user_profile')
const register_user_profile     = () => import('@/components/profile/register_user_profile')

//lecturer page
const internal_lecturer         = () => import('@/components/lecturer/internal_lecturer')
// const external_lecturer         = () => import('@/components/lecturer/external_lecturer')

//manage manu
//course
const course                    = () => import('@/components/course/course')

//keyword
const keyword                   = () => import('@/components/keyword/keywords')

//curriculum
const curriculum                = () => import('@/components/curriculum/curriculum')
//student

const document                  = () => import('@/components/document/documents')

//sign in
const student_signin            = () => import('@/components/student/signin/signin')
const student_profile           = () => import('@/components/student/profile/student_profile')
const my_student_profile        = () => import('@/components/student/profile/my_student_profile')

 //submit
const submitThesic              = () => import('../components/student/activity/submitthesic')

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/signin',
    name: 'signin',
    component: signin
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile,
    meta: {
      requiresAdminAuth: true
    }
  },
  {
    path: '/home/user_profile',
    name: 'user_profile',
    component: user_profile,
    meta: {
      requiresAdminAuth: true
    }
  },
  {
    path: '/home/edit_user_profile',
    name: 'edit_user_profile',
    component: edit_user_profile,
    meta: {
      requiresAdminAuth: true
    }
  },
  {
    path: '/home/register_user_profile',
    name: 'register_user_profile',
    component: register_user_profile,
    meta: {
      requiresAdminAuth: true
    }
  },
  {
    path: '/home/internal_lecturer',
    name: 'internal_lecturer',
    component: internal_lecturer,
    meta: {
      requiresAdminAuth: true
    }
  },
  // {
  //   path: '/home/external_lecturer',
  //   name: 'external_lecturer',
  //   component: external_lecturer,
  //   meta: {
  //     requiresAdminAuth: true
  //   }
  // }, 
  {
    path: '/home/course',
    name: 'course',
    component: course,
    meta: {
      requiresAdminAuth: true
    }
  },
  {
    path: '/home/keyword',
    name: 'keyword',
    component: keyword,
    meta: {
      requiresAdminAuth: true
    }
  },
  {
    path: '/home/document',
    name: 'document',
    component: document,
    meta: {
      requiresAdminAuth: true
    }
  },
  {
    path: '/home/curriculum',
    name: 'curriculum',
    component: curriculum,
    meta: {
      requiresAdminAuth: true
    }
  },
  //student path
  {
    path: '/student_signin',
    name: 'student_signin',
    component: student_signin
  },    
  {
    path: '/student_profile',
    name: '/student_profile',
    component: student_profile,
    meta: {
      requiresStudentAuth: true
    }
  },
  {
    path: '/student/submitThesic',
    name: 'submitThesic',
    component: submitThesic,
    meta: {
      requiresStudentAuth: true
    }
  },
  {
    path: '/student_profile/my_profile',
    name: '/student_profile/my_profile',
    component: my_student_profile,
    meta: {
      requiresStudentAuth: true
    }
  },
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAdminAuth)) {
      if (localStorage.getItem('tsic_token') == null) {
          next({
              path: '/signin',
              params: { nextUrl: to.fullPath }
          })
      }  
      else { 
        next()
        }
  } else if(to.matched.some(record => record.meta.requiresStudentAuth)) {
      if(localStorage.getItem('tsic_std_token') == null){
        next({
          path: '/student_signin',
          params: { nextUrl: to.fullPath }
      })
      }
      else{
          next()
      }
  }else {
      next()
  }
})

export default router;


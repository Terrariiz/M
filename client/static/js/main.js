$(document).ready(function(){
  $(".log-in").submit(async function(event){
    //break event login and got token 
    event.preventDefault(event)

    const username = $("#username").val();
    const password = $("#password").val();
    const formData = {username: username, password: password};
    const url = "http://localhost:3000/staffs/signin";
    
    const encodeForm = (data) => {
    return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
    }
    
    const gettoken = async function() {
    try {
    return await axios.post(url, 
            encodeForm(formData),{
            header:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
            }
    })
    } catch (error) {
    console.error(error)
      }
    }
    
    const token = await gettoken() 
    if(token.data.success == true){
            localStorage.setItem('token', token.data.data.token);
            setTimeout(function() {
                    window.location='/user/profile'
                    window.alert("Welcome to system")
            }, 1000);
          
    }else if (token.data.success == false){
            setTimeout(function() {
                    window.alert(token.data.message)
            }, 1000);    
    }    
  })  
  
  $(".register_staffs").submit(async function(event){
    //break event login and got token 
    event.preventDefault(event)

    const fname    = $("#fname_user").val();
    const lname    = $("#lname_user").val();
    const email    = $("#email_user").val();
    const username = $("#username_user").val();
    const password = $("#password_user").val();
    const position = $("#position_user").val();
    const formData = {
                      fname   : fname,
                      lname   : lname,
                      email   : email,
                      username: username,
                      password: password,
                      position: position
                    };
    const url = "http://localhost:3000/staffs/";
    console.log(fname,lname,email,username,password,position)
    console.log(formData)

    const encodeForm = (data) => {
    return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
    }
    
    const register_data = async function() {
    try {
    return await axios.post(url, 
            encodeForm(formData),{
            header:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
            }
    })
    } catch (error) {
    console.log(error)
      }
    }
    const user_data = await register_data() 
    if(user_data.data.success){
            setTimeout(function() {
                    window.location='/user/profile'
                    window.alert("Successful register")
            }, 1000);
          
    }else{
            setTimeout(function() {
                    window.alert(user_data.data.message)
            }, 1000);    
    }    
    
    
  })  

  $(".edit_staffs").submit(async function(event){
        event.preventDefault(event)
        const staff_id     = $("#staff_Editid").val();
        const fname        = $("#fname_Edituser").val();
        const lname        = $("#lname_Edituser").val();
        const email        = $("#email_Edituser").val();
        const old_password = $("#oldpassword_Edituser").val();
        const new_password = $("#password_Edituser").val();
        const position     = $("#position_Edituser").val();
        const url          = "http://localhost:3000/staffs/";
        const Usertoken    = localStorage.getItem('token')
        const formData = {
                          staff_id: staff_id,
                          fname   : fname,
                          lname   : lname,
                          email   : email,
                          old_password: old_password,
                          new_password: new_password,
                          position: position
                        };
        let config = { 
               headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${Usertoken}` 
                }
        }

        //console.log(staff_id,fname,lname,email,old_password,new_password,position,Usertoken)
        console.log(formData)
    
        const encodeForm = (data) => {
        return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
        }
        
        const regusdata = axios.put(url,encodeForm(formData),config)
        .then(function (regusdata) {
                window.location = '/user/profile'
                window.alert("Update Profile Successful!!")   
        })
        .catch(function (regusdata) {
                console.log(regusdata.config)
                window.alert("Old password incorrect!!")
        });
  }) 

  $(".register_lecturer_in").submit(async function(event){
        event.preventDefault(event)
        const fname        = $("#fname_lecturer_in").val();
        const lname        = $("#lname_lecturer_in").val();
        const position     = $("#position_lecturer_in").val();
        const url          = "http://localhost:3000/lecturer/internal";
        const Usertoken    = localStorage.getItem('token')
        const formData = {
                          fname   : fname,
                          lname   : lname,
                          position: position
                        };
        let config = { 
               headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${Usertoken}` 
                }
        }

        console.log(formData)

        const encodeForm = (data) => {
        return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
        }
        
        const internal_regis_data = axios.post(url,encodeForm(formData),config)
        .then(function (internal_regis_data) {
                window.location = '/user/profile'
                window.alert(internal_regis_data.data.message)   
        })
        .catch(function (internal_regis_data) {
                window.alert(internal_regis_data.data.message)
        });
  }) 

  $(".register_lc_ex").submit(async function(event){
        event.preventDefault(event)
        const fname        = $("#fname_user_lc_ex").val();
        const lname        = $("#lname_user_lc_ex").val();
        const position     = $("#position_user_lc_ex").val();
        const department   = $("#department_user_lc_ex").val();
        const faculty      = $("#faculty_user_lc_ex").val();
        const university   = $("#university_user_lc_ex").val();
        const url          = "http://localhost:3000/lecturer/external";
        const Usertoken    = localStorage.getItem('token')
        const formData = {
                          fname         : fname,
                          lname         : lname,
                          position      : position,
                          department    : department,
                          faculty       : faculty,
                          university    : university

                        };
        let config = { 
               headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${Usertoken}` 
                }
        }

        console.log(formData)

        const encodeForm = (data) => {
        return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
        }
        
        const external_regis_data = axios.post(url,encodeForm(formData),config)
        .then(function (external_regis_data) {
                window.location = '/user/profile'
                window.alert(external_regis_data.data.message)   
        })
        .catch(function (external_regis_data) {
                window.alert(external_regis_data.data.message)
        });
  }) 
})

$(document).ready( function(){
  $(".lecturer_internal_listdata").one( "click",async function(){
        const Usertoken = localStorage.getItem('token')
        const Url       = 'http://localhost:3000/lecturer/list/internal'
        let config = { 
          headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': `Bearer ${Usertoken}` 
          }}
      
        try {
        const profile_data = await axios.get(Url,config)
        .then(function (profile_data) {
                const data = profile_data.data.data
                const mainContainer = document.getElementById("lecturer_table");
                for (var i = 0; i < data.length; i++) {
                        const div = document.createElement("tr");
                        div.innerHTML =  "<td>" + data[i].lecturer_id+ "</td>" +
                                         "<td>" + data[i].first_name + "</td>" +
                                         "<td>" + data[i].last_name  + "</td>" +
                                         "<td>" + data[i].position   + "</td>" +
                                         "<td>" + 
                                                "<button " + 'class="btn btn-success"' + 'onclick="Get_id_edit(this);"' + 'value=' + data[i].lecturer_id + ">EDIT</button>"  +
                                                "<button " + 'class="btn btn-danger "' + 'onclick="Get_id_delete(this);"' + 'value='+ data[i].lecturer_id + ">DELETE</button>"+
                                         "</td>" ;
                        mainContainer.appendChild(div);
                }
        }).catch(function (profile_data) {
                console.log(profile_data);   
                });
        } catch (error) {
          console.error(error);
          }
  })

  $(".lecturer_external_listdata").one( "click",async function(){
                const Usertoken = localStorage.getItem('token')
                const Url       = 'http://localhost:3000/lecturer/list/external'
                let config = { 
                  headers: {
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': `Bearer ${Usertoken}` 
                  }}
              
                try {
                const profile_data = await axios.get(Url,config)
                .then(function (profile_data) {
                        const data = profile_data.data.data
                        const mainContainer = document.getElementById("lecturer_table_ex");
                        for (var i = 0; i < data.length; i++) {
                                const div = document.createElement("tr");
                                div.innerHTML =  "<td>" + data[i].lecturer_id+ "</td>" +
                                                 "<td>" + data[i].first_name + "</td>" +
                                                 "<td>" + data[i].last_name  + "</td>" +
                                                 "<td>" + data[i].position   + "</td>" +
                                                 "<td>" + data[i].faculty    + "</td>" +
                                                 "<td>" + data[i].university + "</td>" +
                                                 "<td>" + 
                                                        "<a " + 'class="btn btn-success"' + 'href=http://localhost:3000/lecturer/internal/'+ data[i].lecturer_id + ">EDIT</a>"  +
                                                        "<a " + 'class="btn btn-danger"'  + 'onclick="del_lecturer_in()"' + 'href=http://localhost:3000/lecturer/internal/'+ data[i].lecturer_id +  ">DELETE</a>"+
                                                 "</td>" ;
                                mainContainer.appendChild(div);
                        }
                }).catch(function (profile_data) {
                        console.log(profile_data);   
                        });
                } catch (error) {
                  console.error(error);
                  }
  })

  $(".profile_user").one( "click", async function Getusers_profile(){
        const Usertoken = localStorage.getItem('token')
        const Url       = 'http://localhost:3000/staffs/'
        let config = { 
        headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization': `Bearer ${Usertoken}` 
        }}

        try {
        const profile_data = await axios.get(Url,config)
                .then(function (profile_data) {
                document.getElementById("staff_id").innerHTML   = profile_data.data.data.staff_id;
                document.getElementById("username").innerHTML   = profile_data.data.data.username;
                document.getElementById("first_name").innerHTML = profile_data.data.data.first_name;
                document.getElementById("last_name").innerHTML  = profile_data.data.data.last_name;
                document.getElementById("email").innerHTML      = profile_data.data.data.email;
                document.getElementById("position").innerHTML   = profile_data.data.data.position;
                })
                .catch(function (profile_data) {
                window.alert(profile_data);   
                });
        } catch (error) {
        console.error(error);
        }
  })

  $(".profile_user_manage").one( "click",async function Setusers_profile(){
                const Usertoken = localStorage.getItem('token')
                const Url       = 'http://localhost:3000/staffs/'
                let config = { 
                  headers: {
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': `Bearer ${Usertoken}` 
                  }}
              
                  try {
                    const profile_data = await axios.get(Url,config)
                      .then(function (profile_data) {
                          document.getElementById("staff_Editid").value       = profile_data.data.data.staff_id;
                          document.getElementById("username_Edituser").value  = profile_data.data.data.username;
                          document.getElementById("fname_Edituser").value     = profile_data.data.data.first_name;
                          document.getElementById("lname_Edituser").value     = profile_data.data.data.last_name;
                          document.getElementById("email_Edituser").value     = profile_data.data.data.email;
                          document.getElementById("position_Edituser").value  = profile_data.data.data.position;
                      })
                      .catch(function (profile_data) {
                          window.alert(profile_data);   
                      });
                  } catch (error) {
                  console.error(error);
                  }
  })
});

async function Get_id_edit(data_id) {
        const id =  data_id.value;
        const Usertoken = localStorage.getItem('token')
        const Url       = `http://localhost:3000/lecturer/internal/${id}` 
        let config = { 
          headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': `Bearer ${Usertoken}` 
          }}
          console.log(id,Url);
        
        try{
        const Get_lecturer_data = await axios.get(Url,config)
        .then(function (Get_lecturer_data) {
                console.log(Get_lecturer_data.data)
        }).catch(function (Get_lecturer_data) {
                console.log(Get_lecturer_data);   
                });
        }catch (error) {
                console.error(error);
                }

};

async function Get_id_delete(data_id) {
        const fired_button =  await data_id.value;
        console.log(fired_button);
};   



// $(document).on('click', ':not(form)[data-confirm]', function(e){
//         if(!confirm($(this).data('confirm'))){
//                 e.stopImmediatePropagation();
//                 e.preventDefault();
//         }
// });
    
//     $(document).on('submit', 'form[data-confirm]', function(e){
//         if(!confirm($(this).data('confirm'))){
//                 e.stopImmediatePropagation();
//                 e.preventDefault();
//         }
//     });




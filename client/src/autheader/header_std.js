export default function authHeader () {
    let token = window.localStorage.getItem('tsic_std_token')
    if (token) {
      return {
              'Authorization': 'Bearer ' + token,
              'Content-type': 'application/x-www-form-urlencoded'
    }
    } else {
      return {}
    }
  }
  
// taken reference from youtube: https://www.youtube.com/watch?v=ReNkQ0Xkccw&t=1913s

module.exports = {
    getUser: function() {
      const user = sessionStorage.getItem('user');
      console.log(user)
      if (user === 'undefined' || !user) {
        return null;
      } else {
        return JSON.parse(user);
      }
    }, 
  
    getToken: function() {
      return sessionStorage.getItem('token');
    },
  
    setUserSession: function(user, token) {
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);
      console.log(sessionStorage)
     
    },
  
    resetUserSession: function() {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
  }
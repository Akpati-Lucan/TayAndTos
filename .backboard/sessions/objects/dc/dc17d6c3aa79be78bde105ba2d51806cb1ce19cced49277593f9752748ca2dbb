// services/backend/authService.js
class AuthService {
    getToken() {
      return localStorage.getItem('token');
    }
  
    setToken(token) {
      localStorage.setItem('token', token);
    }
  
    clearToken() {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  
    cacheUser(user) {
      const data = JSON.stringify(user);
      localStorage.setItem('user', data);
      sessionStorage.setItem('user', data);
    }
  
    getCachedUser() {
      let user = localStorage.getItem('user') || sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
  
    clearCache() {
      this.clearToken();
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    }
  
      isAuthenticated() {
    return !!(this.getToken() && this.getCachedUser());
  }

  isUserAuthenticated() {
    return this.isAuthenticated();
  }

  clearCachedUserData() {
    this.clearCache();
  }
}

export default new AuthService();
  
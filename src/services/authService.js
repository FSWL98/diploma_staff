import BaseService from './baseService';

export class AuthService extends BaseService {
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  static getAuthToken() {
    return localStorage.getItem('token');
  }

  static getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  static async authorize(user, password) {
    const data = {
      'email': user,
      password
    }
    const options = {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const response = await this.request(`${process.env.BASE_API_URL}/auth/staff/login`, options);
    if (response.error)
      return response;
    localStorage.setItem('token', response.access_token);
    return this.getUserInfo();
  }

  static async getUserInfo() {
    const options = {
      mode: 'cors',
      method: 'GET'
    };
    const response = await this.authRequest(`${process.env.BASE_API_URL}/staff/me`, options);
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static async authRequest(url, options, type = true) {
    options.headers = {
      Authorization: `bearer ${this.getAuthToken()}`,
      'Content-Type': 'application/json',
    };
    options.mode = 'cors';
    const response = await fetch(url, options);
    return this.parseResponse(response, true);
  }
}
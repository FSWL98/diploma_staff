import { AuthService } from './authService';

export class EventsService extends AuthService {
  static async getEvents() {
    const options = {
      mode: 'cors',
      method: 'GET'
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/event/list`, options);
  }

  static async getEventById(event_id) {
    const options = {
      mode: 'cors',
      method: 'GET'
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/event/?event_id=${event_id}`, options);
  }

  static async getCriterias() {
    const options = {
      mode: 'cors',
      method: 'GET'
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/criteria/list`, options);
  }

  static async getAllStaff() {
    const options = {
      mode: 'cors',
      method: 'GET'
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/staff`, options);
  }
}
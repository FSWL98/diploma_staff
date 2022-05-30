import { AuthService } from './authService';

export class SolutionsService extends AuthService {
  static getSolutionsByEvent(eventId) {
    const options = {
      mode: 'cors',
      method: 'GET'
    }

    return this.authRequest(`${process.env.BASE_API_URL}/solution/event?event_id=${eventId}`, options);
  }

  static getNextPairByEvent(eventId) {
    const options = {
      mode: 'cors',
      method: 'GET'
    }

    return this.authRequest(`${process.env.BASE_API_URL}/pairing_mark/new_pair?event_id=${eventId}`, options);
  }

  static async getSolution(solutionId) {
    const options = {
      mode: 'cors',
      method: 'GET'
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/solution?solution_id=${solutionId}`, options);
  }

  static startMarking(eventId) {
    const options = {
      mode: 'cors',
      method: 'POST'
    }

    return this.authRequest(`${process.env.BASE_API_URL}/pairing_mark/start?event_id=${eventId}`, options)
  }

  static saveMark(data) {
    const options = {
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify(data)
    }

    return this.authRequest(`${process.env.BASE_API_URL}/mark`, options)
  }

  static createMark(data) {
    const options = {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(data)
    }

    return this.authRequest(`${process.env.BASE_API_URL}/mark`, options)
  }

  static savePairMark(data) {
    const options = {
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify(data)
    }

    return this.authRequest(`${process.env.BASE_API_URL}/pairing_mark`, options)
  }
}
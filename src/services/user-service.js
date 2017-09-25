import HttpClient from '@/services/request-handler'

export default class UserService extends HttpClient {
  constructor(logService) {
    super(logService)
  }

  get() {
    return super.get(`${__API__}/api/ManageUser`);
    // return fetch(`${__API__}/api/ManageUser`, {credentials: 'include'})
    //   .then(i => i.json());
  }
}

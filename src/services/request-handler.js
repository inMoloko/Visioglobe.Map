export default class HttpClient {
  constructor(logService) {
    this.logService = logService;
  }

  handler(response) {
    if (!response.ok) {
      if (response.status === 401) {
        this.logService.error('Вы не авторизованны либо истекло время авторизации. Перейдите на страницу авторизации');
        return response;
      }
      this.logService.error('Ошибка выполнения запроса');
    }
    if (response.status === 204) {
      return response;
    }
    return response.json();
  }

  get(url) {
    return fetch(url, {credentials: 'include'}).then(i => this.handler(i));
  }
  path(url, object) {
    return fetch(url, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(object)
    }).then(i => this.handler(i));
  }
}

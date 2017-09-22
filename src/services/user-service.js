export default {

  get() {
    return fetch(`${__API__}/api/ManageUser`,{credentials: 'include' }).then(i=>i.json());
  }
}

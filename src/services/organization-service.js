export default {

  get(id) {
    if (!id)
      return fetch(`${__API__}/KazanOdata/VgIds?&$select=OrganizationID,Name,VisioglobeID&$expand=OrganizationImage`, {credentials: 'include'}).then(i => i.json());
    else
      return fetch(`${__API__}/KazanOdata/VgIds?$filter=VisioglobeID eq \'${id}\'&$select=OrganizationID,Name,VisioglobeID&$expand=OrganizationImage`, {credentials: 'include'}).then(i => i.json());
  },
  patch(organization) {
    return fetch(`${__API__}/KazanOdata/VgIds(${organization.OrganizationID})`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(organization)
    }).then(i => {
      // if (i.headers.get('Content-Type')==="application/json") {
      if(i.status === 204) {
        return i;
      }
      return i.json()
    });
  }
}

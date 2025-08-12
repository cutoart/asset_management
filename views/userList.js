import {shortenEmail} from '../database.js';
const createUserListTemplate = (users) => /*html*/`
<p>Total users: ${users.length}</p>
<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>BU</th>
      <th>Status</th>
      <th>Location</th>
      <th>Assets Own</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody class="details">
   ${users.map((user) => `
     <tr data-id="${user.userId}">
      <td>${user.userName}</td>
      <td>${shortenEmail(user.userEmail)}</td>
      <td>${user.userBu}</td>
      <td>${user.userStatus}</td>
      <td>${user.userLocation}</td>
      <td>
  ${user.assetTags
    ? `<details>
         <summary>Assets (${user.assetTags.split(', ').length})</summary>
         <ul>
           ${user.assetTags.split(', ').map(tag => `<li>${tag}</li>`).join('')}
         </ul>
       </details>`
    : 'No Assets'}
</td>
       <td><button class="editAsset" hx-get="/editUserForm/${user.userId}" hx-target=".main">Edit</button></td>
       <td><button class="deleteAsset" hx-delete="/user/${user.userId}" hx-target=".main" hx-confirm="Are you sure you wish to delete user ${user.userName}?">Delete</button></td>
    </tr>
  `).join('')}
  </tbody>
</table>

`;

export default createUserListTemplate;
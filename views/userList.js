const createUserListTemplate = (users) => /*html*/`
<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>BU</th>
      <th>Status</th>
      <th>Location</th>
      <th>User ID</th>
      <th></th>
    </tr>
  </thead>
  <tbody class="details">
   ${users.map((user) => `
     <tr data-id="${user.userId}">
      <td>${user.userName}</td>
      <td>${user.userEmail}</td>
      <td>${user.userBu}</td>
      <td>${user.userStatus}</td>
      <td>${user.userLocation}</td>
      <td>${user.userId}</td>
       <td><button class="editAsset" hx-get="/editUserForm/${user.userId}" hx-target=".main">Edit</button></td>
    </tr>
  `).join('')}
  </tbody>
</table>

`;

export default createUserListTemplate;
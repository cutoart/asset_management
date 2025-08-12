import {formatDateTime} from '../database.js'
const createUserLogHomeTemplate = (userlogs) => /*html*/`

 <div class="search">
<h3>Search Assets<span class="htmx-indicator">Searching...</span></h3>

<input class="form-control" type="search"
       name="search" placeholder="Search User Log..."
       hx-post="/userlog/search"
       hx-trigger="input changed delay:900ms, keyup[key=='Enter']"
       hx-target=".userlog-list"
       hx-indicator=".htmx-indicator">
         
        </div> 
   <div class="div-align-center">
<div class="userlog-list">
   ${createUserLogListTemplate(userlogs)}
</div>
   </div>

`;

const createUserLogListTemplate = (userlogs) => /*html*/`
<p>Total user logs: ${userlogs.length}</p>
 <table class="table">
  <thead>
    <tr>
      <th>Performed By</th>
      <th>Action</th>
      <th>User</th>
      <th>BU</th>
      <th>Status</th>
      <th>Location</th>
      <th>Log DateTime</th>
    
    </tr>
  </thead>
  <tbody class="details">
   ${userlogs.map((userlog) => `
     <tr data-id="${userlog.logId}">
     <td>${userlog.userName}</td>
     <td>${userlog.action}</td>
      <td>${userlog.logUserEmail}</td>
      <td>${userlog.logUserBu}</td>
      <td>${userlog.logUserStatus}</td>
      <td>${userlog.logUserLocation}</td>
      <td>${formatDateTime(userlog.createdAt)}</td>
      
    </tr>
  `).join('')}
  </tbody>
</table>

`;


export {createUserLogHomeTemplate,createUserLogListTemplate} ;
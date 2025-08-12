import {formatDateTime} from '../database.js'

const createAssetLogHomeTemplate = (assetlogs) => /*html*/`

 <div class="search">
<h3>Search Assets<span class="htmx-indicator">Searching...</span></h3>
<input class="form-control" type="search"
       name="search" placeholder="Search Asset Log..."
       hx-post="/assetlog/search"
       hx-trigger="input changed delay:1900ms, keyup[key=='Enter']"
       hx-target=".assetlog-list"
       hx-indicator=".htmx-indicator">
        </div> 
   
<div class="div-align-center">
    <div class="assetlog-list">
${createAssetLogListTemplate(assetlogs)}
 </div>
   </div>

`;


const createAssetLogListTemplate = (assetlogs) => /*html*/`

<p>Total assets logs: ${assetlogs.length}</p>

    <table class="table">
  <thead>
    <tr>
      <th>Performed By</th>
      <th>Action</th>
      <th>Asset Tag</th>
      <th>Status</th>
      <th>From/To</th>
      <th>Log DateTime</th>
      <th></th>
    
    </tr>
  </thead>
  <tbody class="details">
   ${assetlogs.map((assetlog) => `
     <tr data-id="${assetlog.assetlogId}">
     <td>${assetlog.performedByName}</td>
     <td>${assetlog.action}</td>
      <td>${assetlog.logAssetTag}</td>
      <td>${assetlog.logAssetStatus}</td>
      <td>${assetlog.assignedFromName}<br>${assetlog.assignedToName}</td>
      <td>${formatDateTime(assetlog.createdAt)}</td>
      <td><button class="printAssetLog" hx-get="/printAssetLog/${assetlog.assetlogId}" hx-target=".main">Print</button></td>
      
    </tr>
  `).join('')}
  </tbody>
</table>

`;

export {createAssetLogHomeTemplate,createAssetLogListTemplate};
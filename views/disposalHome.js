const createDisposalListTemplate = (assets) => /*html*/`

<div class="div-align-center">
    <div class="bunit-list">
    <p>Total Units: ${assets.length}</p>
    <table class="table">
  <thead>
    <tr>
      <th>Asset Tag</th>
      <th>Asset Type</th>
       <th>Serial No</th>
       <th>Model</th>
       <th>Status</th>
      <th>Assigned To</th>
     
    
    </tr>
  </thead>
  <tbody class="details">
   ${assets.map((asset) => `
     <tr data-id="${asset.buId}">
     <td>${asset.assetTag}</td>
     <td>${asset.assetType}</td>
     <td>${asset.serialNo}</td>
     <td>${asset.assetModel}</td>
     <td>${asset.assetStatus}</td>
     <td>${asset.userName}</td>
    </tr>
  `).join('')}
  </tbody>
</table>

</div>
   </div>

`;

export default createDisposalListTemplate;
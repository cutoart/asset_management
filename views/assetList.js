const createAssetListTemplate = (assets) => /*html*/`
<p>Total assets: ${assets.length}</p>
  <table class="table">
    <thead>
      <tr>
        <th>AssetTag/Type</th>
        <th>Model/SerialNo</th>
        <th>Status</th>
        <th>Assigned To</th>
         <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody class="details">
    ${assets.map((asset) =>`
    <tr data-id="${asset.assetId}">
  <td>${asset.assetTag}<br>${asset.assetType}</td>
  <td>${asset.assetModel}<br>${asset.serialNo}</td>
  <td>${asset.assetStatus}</td>
  <td>${asset.userName}</td>
   <td><button class="editAsset" hx-get="/editAssetForm/${asset.assetId}" hx-target=".main">Edit</button></td>
    <td><button class="deleteAsset" hx-delete="/asset/${asset.assetId}" hx-target=".main" hx-confirm="Are you sure you wish to delete asset ${asset.assetTag}?">Delete</button></td>
</tr>`
    ).join('')}

    
  </tbody>
  
`;

export default createAssetListTemplate;
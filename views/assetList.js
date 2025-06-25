const createAssetListTemplate = (assets) => /*html*/`
  <table class="table">
    <thead>
      <tr>
        <th>Asset Tag</th>
        <th>Type</th>
        <th>Serial No</th>
        <th>Model</th>
        <th>Brand</th>
        <th>Status</th>
        <th>Assigned To</th>
         <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody class="details">
    ${assets.map((asset) =>`
    <tr data-id="${asset.assetId}">
  <td>${asset.assetTag}</td>
  <td>${asset.assetType}</td>
  <td>${asset.serialNo}</td>
  <td>${asset.assetModel}</td>
  <td>${asset.assetBrand}</td>
  <td>${asset.assetStatus}</td>
  <td>${asset.userName}</td>
   <td><button class="editAsset" hx-get="/editAssetForm/${asset.assetId}" hx-target=".main">Edit</button></td>
    <td><button class="deleteAsset" hx-delete="/asset/${asset.assetId}" hx-target=".main" hx-confirm="Are you sure you wish to delete asset ${asset.assetTag}?">Delete</button></td>
</tr>`
    ).join('')}

    
  </tbody>
  
`;

export default createAssetListTemplate;
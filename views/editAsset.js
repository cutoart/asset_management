const editAssetHomeTemplate = (result) => /*html*/`
<div class="div-align-center">
<div class="edit-form">
  <h2>Edit Asset</h2>
  <form>

  <div class="edit-group">
         <label for="assetTag">Asset Tag</label>
    <input type="text" name="assetTag" id="assetTag" value="${result.assetTag}" disabled>
        </div>

        <div class="edit-group">
         <label for="serialNo">Serial No</label>
    <input type="text" name="serialNo" id="serialNo" value="${result.serialNo}" disabled>
        </div>

        <div class="edit-group">
         <label for="assetType">Type</label>
    <input type="text" name="assetType" id="assetType" value="${result.assetType}" disabled>
        </div>

        <div class="edit-group">
         <label for="assetModel">Model</label>
    <input type="text" name="assetModel" id="assetModel" value="${result.assetModel}" disabled>
        </div>

        <div class="edit-group">
         <label for="assetBrand">Brand</label>
    <input type="text" name="assetBrand" id="assetBrand" value="${result.assetBrand}" disabled>
        </div>

    <div class="edit-group">
   <label for="assetStatus">Status</label>
    <select name="assetStatus" id="assetStatus">
        <option value=${result.assetStatus} selected>${result.assetStatus}</option>
        <option value="Assigned">Assigned</option>
        <option value="NotReady">NotReady</option>
        <option value="Ready">Ready</option>
        <option value="Retired">Retired</option>
        <option value="Disposed">Disposed</option>
        <option value="Production">Production</option>
        
</select>
</div>
<div class="edit-group">
    <label for="assetAssignedTo">User Assigned</label>
    <select 
  name="assetAssignedTo" 
  id="assetAssignedTo" 
  hx-get="/user-list/${result.userId}" 
  hx-trigger="focus delay:0.3s" 
  hx-target="#assetAssignedTo" 
  hx-swap="innerHTML">
  <option value="${result.userId}">${result.userName}</option>
</select>
        </div>

<div class="edit-group">
    <button class="btnEditAsset" hx-put="/asset/edit/${result.assetId}" hx-target=".main" hx-trigger="click">Update</button>
    </div>
    
  </form>
</div>
</div>
`;

export default editAssetHomeTemplate;
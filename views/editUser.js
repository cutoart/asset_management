const editUserHomeTemplate = (result,bunits,currentUser) => /*html*/`
<div class="div-align-center">
<div class="edit-form">
  <h2>Edit User</h2>
  <form>

  <div class="edit-group">
         <label for="userName">Name</label>
    <input type="text" name="userName" id="userName" value="${result.userName}">
        </div>

        <div class="edit-group">
         <label for="userEmail">Email</label>
    <input type="text" name="userEmail" id="userEmail" value="${result.userEmail}" readonly>
        </div>

        ${currentUser.userType === 'Admin' ?`<div class="edit-group">
         <label for="userPassword">Password</label>
    <input type="password" name="userPassword" id="userPassword" value="${result.userPassword}">
    <button class="btnUpdatePassword" hx-put="/user/editPassword/${result.userId}" hx-target=".main" hx-trigger="click">Update Password</button>
        </div>`:''}

        <div class="edit-group">
         <label for="userBu">Business Unit:</label>
           <select name="userBu">
  ${bunits.map(bunit => `
        <option value="${bunit.bunitName}" ${bunit.bunitName === result.userBu ? 'selected' : ''}>
      ${bunit.bunitName}
    </option>
      `).join('')}
    </select>         
        </div>

        <div class="edit-group">
         <label for="userStatus">Status</label>
         <select name="userStatus" id="userStatus">
         <option value=${result.userStatus} selected>${result.userStatus}</option>
        <option value="Resigned">Resigned</option>
        <option value="Active">Active</option>
          </select> 
        </div>

    <div class="edit-group">
   <label for="userLocation">Location</label>
    <select name="userLocation" id="userLocation">
        <option value=${result.userLocation} selected>${result.userLocation}</option>
            <option value="OnSide">OnSide</option>
              <option value="EMHQ">EMHQ</option>
          <option value="JKT">JKT</option>
          <option value="JKB">JKB</option>
          <option value="YohaTampines">YohaTampines</option>
<option value="TerusanRC">TerusanRC</option>
          <option value="PenjuruRC">PenjuruRC</option>
          <option value="TuasSouthRC">TuasSouthRC</option>
          <option value="KranjiRC">KranjiRC</option>
          <option value="PearlHill">PearlHill</option>
          <option value="CampusHeightRP">CampusHeightRP</option>
          <option value="TC-EastCoast">TC-EastCoast</option>
          <option value="TC-WestCoast">TC-WestCoast</option>
          <option value="TC-PRPG">TC-PRPG</option>
          <option value="TC-HBP">TC-HBP</option>
          <option value="TC-MYT">TC-MYT</option>
          <option value="TC-SB">TC-SB</option>
          <option value="TC-JB">TC-JB</option>
          <option value="TC-TP">TC-TP</option>
        
</select>
</div>

<div class="edit-group">
    <button class="btnEditAsset" hx-put="/user/edit/${result.userId}" hx-target=".main" hx-trigger="click">Update</button>
    </div>
    
  </form>
</div>
</div>
`;

export default editUserHomeTemplate;
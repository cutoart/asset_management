const editUserHomeTemplate = (result) => /*html*/`
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
    <input type="text" name="userEmail" id="userEmail" value="${result.userEmail}" disabled>
        </div>

        <div class="edit-group">
         <label for="userBu">Business Unit:</label>
            <select 
              id="userBu" 
              name="userBu">
              <option value=${result.userBu} selected>${result.userBu}</option>
              <option value="Accounts">Accounts</option>
          <option value="ACMV">ACMV</option>
  <option value="AM">AM</option>
  <option value="EMRE">EMRE</option>
  <option value="ENGRG">ENGRG</option>
   <option value="FA">FA</option>
   <option value="FM">FM</option>
    <option value="HR">HR</option>
    <option value="IA">IA</option>
      <option value="T&I">T&I</option>
     <option value="LIFTS">LIFTS</option>
     <option value="OCC">OCC</option>
     <option value="PMS">PMS</option>
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
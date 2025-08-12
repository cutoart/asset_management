const faqHomeTemplate = () => /*html*/`
<div class="div-align-center">
  <div class="edit-form" style="max-width:800px">
    <h2>FAQ</h2>
    <dl class="faq-list">

      <dt>When should I change Asset Status?</dt>
      <dd>
        <strong>Created</strong> - When the asset is newly created and without any status changing yet. No signature required as it is logged by system on who created it.<br>
        <strong>Assigned</strong> - When coordinator assigning asset to user.<strong>User do required to sign</strong> on the Signature(Assigned To) field before submit form.<br>
        <strong>Returned</strong> – When the user is returning asset back to the asset coordinator.<strong>Coordinator do required to sign</strong> on the Signature(Assigned To) field before submit form.<br>
        <strong>Ready</strong> – When the asset is ready to assign to the next user. No signature required.<br>
        <strong>Production</strong> – When the asset is belong to a Location and is for production purpose such as server and router etc. No signature required.<br>
        <strong>Retired</strong> – When the asset is ready to be retired, has been completely returned to coordinator and no longer stuck at any user in the system, assets with retired status are allow to be active in D365 for the transition period. No signature required.<br>
        <strong>Disposed</strong> - When asset is completely retired from D365. Once it is disposed, it will no longer shown under Active Assets BUT under Disposed. No signature required. 
      </dd>

      <dt>Can I delete asset and user?</dt>
      <dd>No, only Admin can delete user and asset but coordinator may put on a request to do so if really needed. Please do check properly when creating and editing user or asset to prevent data mismatch.</dd>

       <dt>Why some field are not able to be edit?</dt>
      <dd>Those field which cant be edited are primary key/ unique to that asset or user. But coordinator may put on a request to do so if really needed.</dd> 

      <dt>Can't get the correct asset Model on the drop-down list?</dt>
      <dd>You may create an asset Model on Asset Model tab. Please write the asset model without the brand and put the brand in the model desctiption.</dd>
      <dt>Can't understand which Business Unit to apply?</dt>
      <dd>You may refer to Business Unit tab for reference, if none of it are suitable please select others and may put on a request to do so if need a new Business Unit.</dd> 
      
      
      

    </dl>
  </div>
</div>
`;

export default faqHomeTemplate;
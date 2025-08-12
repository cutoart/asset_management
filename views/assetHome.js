const createAssetHomeTemplate = (amodels) => /*html*/`
 <div class="search">
<h3>Search Assets<span class="htmx-indicator">Searching...</span></h3>
<input class="form-control" type="search"
       name="search" placeholder="To Search Users..."
       hx-post="/assets/search"
       hx-trigger="input changed delay:900ms, keyup[key=='Enter']"
       hx-target=".asset-list"
       hx-indicator=".htmx-indicator">
         
        </div> 
         <div>
    ${createAssetFormTemplate(amodels)}
  </div>

         <div class="div-align-center">
        <div class="asset-list" hx-get="/assets" hx-trigger="load" hx-target=".asset-list">
        </div>
        </div>        
`;

const createAssetFormTemplate = (amodels) => /*html*/`

          <form
            hx-post="/assets" 
            hx-target=".asset-list" 
            hx-on::after-request="document.querySelector('form').reset()"
          >
          <div class="add-form">
            <input 
              id="assetTag" 
              name="assetTag"
              placeholder="Asset Tag" 
              type="text"
              required
            />
            
            <select 
              id="assetType" 
              name="assetType">
              <option value="Laptop">Laptop</option>
          <option value="Desktop">Desktop</option>
  <option value="Handphone">Handphone</option>
  <option value="Tablet">Tablet</option>
   <option value="Server">Server</option>
    <option value="VirtServer">VirtServer</option>
  <option value="Router">Router</option>
  <option value="AccessPoint">AccessPoint</option>
  <option value="Printer">Printer</option>
   <option value="Printer">Projector</option>
  </select>  
  
     <input 
              id="serialNo" 
              name="serialNo"
              placeholder="Serial No" 
              type="text"
              required
            />        
  
            <select name="assetModel">
  ${amodels.map(amodel => `
        <option value="${amodel.amodelName}">${amodel.amodelName}</option>
      `).join('')}
    </select>         

            <input 
              type="hidden"
              id="userId" 
              name="userId"
              value="1"
            />
            
            <button>Create</button> 
          </form>
        
`;
export { createAssetHomeTemplate, createAssetFormTemplate };
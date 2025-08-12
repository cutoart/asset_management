const createAssetModelHomeTemplate = (amodels) => /*html*/`

          <div>
                ${createAssetModelFormTemplate()}
                </div>
   
<div class="div-align-center">
    <div class="amodel-list">
${createAssetModelListTemplate(amodels)}
 </div>
   </div>

`;

const createAssetModelFormTemplate = () => /*html*/`

<form
            hx-post="/amodels" 
            hx-target=".amodel-list" 
            hx-on::after-request="document.querySelector('form').reset()"
          >
          <div class="add-form">

           <label for="Model">Model:</label>
            <input 
              id="amodelName" 
              name="amodelName"
              placeholder="Model" 
              type="text"
              required
            />
            <label for="amodelDesc">Model Description:</label>
            <input 
              id="amodelDesc" 
              name="amodelDesc"
              placeholder="Model Description with Brand" 
              type="text"
              required
            />
             
            <button>Create</button>
          </form>

`;

const createAssetModelListTemplate = (amodels) => /*html*/`

<div class="div-align-center">
    <div class="bunit-list">
      <p>Total Models: ${amodels.length}</p>
    <table class="table">
  <thead>
    <tr>
      <th>Asset Model</th>
      <th>Asset Model Description</th>
     
    
    </tr>
  </thead>
  <tbody class="details">
   ${amodels.map((amodel) => `
     <tr data-id="${amodel.amodelId}">
     <td>${amodel.amodelName}</td>
     <td>${amodel.amodelDesc}</td>
    </tr>
  `).join('')}
  </tbody>
</table>
</div>
   </div>

`;

export {createAssetModelHomeTemplate,createAssetModelFormTemplate,createAssetModelListTemplate} ;
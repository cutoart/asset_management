const createAssetHomeTemplate = () => /*html*/`
 <div class="search">
<h3>
  Search Assets
  <span class="htmx-indicator">
    <!-- <img src="/img/bars.svg"/> -->
 Searching...
   </span>
</h3> 
<input class="form-control" type="search"
       name="search" placeholder="Begin Typing To Search Users..."
       hx-post="/assets/search"
       hx-trigger="input changed delay:900ms, keyup[key=='Enter']"
       hx-target=".asset-list"
       hx-indicator=".htmx-indicator">
         
        </div> 
        <div>
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
  <option value="Smart Phone">Smart Phone</option>
  <option value="Tablet">Tablet</option>
  <option value="Router">Router</option>
  <option value="Access Point">Access Point</option>
  <option value="Printer">Printer</option>
  </select>  
  
     <input 
              id="serialNo" 
              name="serialNo"
              placeholder="Serial No" 
              type="text"
              required
            />
            
  <select id="assetBrand" name="assetBrand">
              <option value="Acer">Acer</option>
          <option value="Afterschock">Afterschock</option>
  <option value="Apple">Apple</option>
  <option value="Aruba">Aruba</option>
  <option value="Asus">Asus</option>
  <option value="Canon">Canon</option>
  <option value="Dell">Dell</option>
              <option value="Epson">Epson</option>
          <option value="Fortigate">Fortigate</option>
  <option value="Fortinet">Fortinet</option>
  <option value="Fuji Xerox">Fuji Xerox</option>
  <option value="H3C">H3C</option>
  <option value="HP">HP</option>
  <option value="Huawei">Huawei</option>
  <option value="Lenovo">Lenovo</option>
  <option value="Microsoft">Microsoft</option>
  <option value="Oki">Oki</option>
  <option value="Samsung">Samsung</option>
  <option value="Sharp">Sharp</option>
  </select>      
           
          
            <input 
              id="assetModel" 
              name="assetModel"
              placeholder="Model : Dell Latitude 5310" 
              type="text"
              required
            />
            <input 
              type="hidden"
              id="assetStatus" 
              name="assetStatus"
              value="Created"
            />

            <input 
              type="hidden"
              id="userId" 
              name="userId"
              value="1"
            />
            
            <button>Create</button>
          </form>
        </div>
        </div>
        <!-- <div class="asset-list-error"></div> -->
         <div class="div-align-center">
        <div class="asset-list" hx-get="/assets" hx-trigger="load" hx-target=".asset-list">
        
          <!-- <button hx-get="/assets" hx-target=".asset-list">Show Assets</button> -->
        </div>
        </div>        
`;

export default createAssetHomeTemplate;
const createUserHomeTemplate = (bunits) => /*html*/`
 <div class="search">
<h3>Search Users<span class="htmx-indicator">Searching...</span></h3>
<input class="form-control" type="search"
       name="search" placeholder="Search Users..."
       hx-post="/users/search"
       hx-trigger="input changed delay:900ms, keyup[key=='Enter']"
       hx-target=".user-list"
       hx-indicator=".htmx-indicator">
        </div> 
        <div>
        ${createUserFormTemplate(bunits)}
        </div>
        
        <div class="div-align-center">
        <div class="user-list" hx-trigger="load" hx-get="/users" hx-target=".user-list">
          

        </div>
        
        </div>
        
`;

const createUserFormTemplate = (bunits) => /*html*/`

<form
            hx-post="/users" 
            hx-target=".user-list" 
            hx-on::after-request="document.querySelector('form').reset()"
          >
          <div class="add-form">

           <label for="userName">Name:</label>
            <input 
              id="userName" 
              name="userName"
              placeholder="Name" 
              type="text"
              required
            />
            <label for="userEmail">Email Address:</label>
            <input 
              id="userEmail" 
              name="userEmail"
              placeholder="username" 
              type="text"
              pattern="^[^@]+$"
              required
            />
             <select 
              id="userEmailDomain" 
              name="userEmailDomain">
              <option value="@emservices.com.sg">@emservices.com.sg</option>
               <option value="@emre.com.sg">@emre.com.sg</option>
            </select>
            <label for="userBu">Business Unit:</label>

            <select name="userBu">
  ${bunits.map(bunit => `
        <option value="${bunit.bunitName}">${bunit.bunitName}</option>
      `).join('')}
    </select>          
  <input 
              id="userStatus" 
              name="userStatus"
              value="Active"
              type="text"
              hidden
            />  
           <label for="userLocation">Working Place:</label>     
          <select id="userLocation" name="userLocation">
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
            
            <button>Create</button>
          </form>

`;
export  {createUserHomeTemplate,createUserFormTemplate};

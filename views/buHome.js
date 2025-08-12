const createBuListTemplate = (bunits) => /*html*/`

<div class="div-align-center">
    <div class="bunit-list">
    <p>Total Units: ${bunits.length}</p>
    <table class="table">
  <thead>
    <tr>
      <th>Business Unit</th>
      <th>BU Description</th>
     
    
    </tr>
  </thead>
  <tbody class="details">
   ${bunits.map((bunit) => `
     <tr data-id="${bunit.buId}">
     <td>${bunit.bunitName}</td>
     <td>${bunit.bunitDesc}</td>
    </tr>
  `).join('')}
  </tbody>
</table>

</div>
   </div>

`;

export default createBuListTemplate;
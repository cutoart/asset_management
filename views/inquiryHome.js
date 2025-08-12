const inquiryHomeTemplate = (inquiries) => /*html*/`

          <div>
                ${createInquiryFormTemplate()}
                </div>
   
<div class="div-align-center">
    <div class="inquiry-list">
${createInquiryListTemplate(inquiries)}
 </div>
   </div>

`;

const createInquiryFormTemplate = () => /*html*/`

<form
            hx-post="/inquiry" 
            hx-target=".inquiry-list" 
            hx-on::after-request="document.querySelector('form').reset()"
          >
          <div class="add-form">

             <label for="inquiryType">Inquiry Type:</label>
            <select id="inquiryType" name="inquiryType">
              <option value="question">question</option>
              <option value="answer">answer</option>
            </select>

             <label for="inquiry">Inquiry:</label>
            <input 
              id="inquiryDesc" 
              name="inquiryDesc"
              placeholder="Inquiry" 
              type="text"
              required
            /> 
              
           
            <button>Create</button>
          </form>

`;

const createInquiryListTemplate = (inquiries) => /*html*/`

<div class="div-align-center">
    <div class="inquiry-list">
      <p>Total Inquiries: ${inquiries.length}</p>
    <table class="table">
  <thead>
    <tr>
      <th>Inquiry By</th>
      <th>Inquiry Type</th>
      <th>Inquiry Description</th>
     
    
    </tr>
  </thead>
  <tbody class="details">
   ${inquiries.map((inquiry) => `
     <tr data-id="${inquiry.inquiryId}">
     <td>${inquiry.userName}</td>
     <td>${inquiry.inquiryType}</td>
     <td>${inquiry.inquiryDesc}</td>
    </tr>
  `).join('')}
  </tbody>
</table>
</div>
   </div>

`;

export {inquiryHomeTemplate,createInquiryFormTemplate,createInquiryListTemplate} ;
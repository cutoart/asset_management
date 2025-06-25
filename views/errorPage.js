const errorHandlingTemplate = (duplicateInput) => /*html*/`
  <div class="asset-list-error">
    <a class="validaton-message">${duplicateInput} has has already been used.</a>
   
</div>
`;

export default errorHandlingTemplate;
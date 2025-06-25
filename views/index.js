const createLoginForm = (errorMessage = '') => /*html*/`
<div class="div-align-center">
    <div class="edit-form">
 <h2>Login</h2>
    <form hx-post="/login" hx-target=".main" hx-swap="innerHTML">
     <div class="edit-group">
      <label for="userEmail">Email:
        <input type="text" name="userEmail" id="userEmail" required>
        </div>
      </label>

        <div class="edit-group">
      <label for="userPassword">Password:
        <input type="password" name="userPassword" id="userPassword" required>
         </div>

          <div class="edit-group">
      </label>
      <button type="submit">Login</button>
       </div>
    </form>
    <div id="login-result">
      ${errorMessage ? `<p class="error" style="color:red">${errorMessage}</p>` : ''}
    </div>
  </div>
   </div>
`;

const createHomepageTemplate = () => /*html*/`
  <!DOCTYPE html>
  <html>
    <head>
      <title>EM Assets Management</title>
      <script src="https://unpkg.com/htmx.org@1.9.12"></script>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <header>
        <h1>System</h1>
     <ul>
      <li><a hx-get="/assetHome" hx-trigger="click" hx-target=".main" >Assets</a></li>
  <li><a hx-get="/userHome" hx-trigger="click" hx-target=".main">Users</a></li>
  <li><a href="#Log">Logs</a></li>
  <li style="float:right"><a hx-post="/logout" hx-trigger="click">Logout</a></li>
</ul>
      </header>

      <main>
       <div class="main">
        ${createLoginForm()}
       </div>
      </main>
    </body>
  </html>
`;

export {
  createHomepageTemplate,
  createLoginForm
};
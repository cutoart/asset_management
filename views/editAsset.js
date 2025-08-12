const editAssetHomeTemplate = (result,amodels) => /*html*/`

<script>
(function () {
  let canvas, ctx;
  let drawing = false;

  function handleUserChange(event) {
    console.log("User changed:", event.target.value);
    const originalUserId = "${result.userId}";
    const selectedUserId = event.target.value;
    const signatureContainer = document.getElementById("signatureContainer");

    if (selectedUserId !== originalUserId) {
      signatureContainer.style.display = "block";
      initSignaturePad();
    } else {
      signatureContainer.style.display = "none";
      clearSignature();
    }
  }

      // ✅ Expose clearSignature globally for onclick
  window.handleUserChange = handleUserChange;

  function initSignaturePad() {
    canvas = document.getElementById("signaturePad");
    if (!canvas) {
      console.warn("SignaturePad canvas not found!");
      return;
    }

    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    // Remove existing listeners by replacing canvas
    canvas.replaceWith(canvas.cloneNode(true));
    canvas = document.getElementById("signaturePad");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("touchstart", e => e.preventDefault(), { passive: false });
    canvas.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
  }

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }

  function startDrawing(e) {
    drawing = true;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  }

  function draw(e) {
    if (!drawing) return;
    const pos = getPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    e.preventDefault();
  }

  function stopDrawing(e) {
    if (!drawing) return;
    drawing = false;
    const dataUrl = canvas.toDataURL("image/png");
    document.getElementById("signatureData").value = dataUrl;
    e.preventDefault();
  }

  function clearSignature() {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      document.getElementById("signatureData").value = "";
    }
  }

    // ✅ Expose clearSignature globally for onclick
  window.clearSignature = clearSignature;

  // Rebind listeners and reinitialize signature pad after HTMX swap
  document.body.addEventListener("htmx:afterSwap", function(evt) {
    if (evt.target.id === "assetAssignedTo") {
      const select = document.getElementById("assetAssignedTo");
      if (select) {
        select.removeEventListener("change", handleUserChange);
        select.addEventListener("change", handleUserChange);
      }

      const signatureContainer = document.getElementById("signatureContainer");
      if (signatureContainer && signatureContainer.style.display === "block") {
        initSignaturePad();
      }
    }
  });
})();
</script>

<div class="div-align-center">
<div class="edit-form">
  <h2>Edit Asset</h2>
  <form>

  <div class="edit-group">
         <label for="assetTag">Asset Tag</label>
    <input type="text" name="assetTag" id="assetTag" value="${result.assetTag}" readonly>
        </div>

        <div class="edit-group">
         <label for="serialNo">Serial No</label>
    <input type="text" name="serialNo" id="serialNo" value="${result.serialNo}" disabled>
        </div>

        <div class="edit-group">
         <label for="assetType">Type</label>
    <input type="text" name="assetType" id="assetType" value="${result.assetType}" disabled>
        </div>

          <div class="edit-group">
         <label for="assetModel">Model</label>
           <select name="assetModel">
  ${amodels.map(amodel => `
        <option value="${amodel.amodelName}" ${amodel.amodelName === result.assetModel ? 'selected' : ''}>
      ${amodel.amodelName}
    </option>
      `).join('')}
    </select>         
        </div>

    <div class="edit-group">
   <label for="assetStatus">Status</label>
    <select name="assetStatus" id="assetStatus">
        <option value=${result.assetStatus} selected>${result.assetStatus}</option>
        <option value="Assigned">Assigned</option>
        <option value="Returned">Returned</option>
        <option value="Ready">Ready</option>
        <option value="Production">Production</option>
        <option value="Retired">Retired</option>
        <option value="Disposed">Disposed</option>   
</select>
</div>

<!-- Hidden input: submits userId -->
<input type="hidden" name="logAssetAssignFrom" id="logAssetAssignFrom" value="${result.userId}">

<!-- Visible input: shows userName but is not submitted -->
<div class="edit-group">
  <label for="logAssetAssignFromName">Assigned From</label>
  <input type="text" id="logAssetAssignFromName" value="${result.userName}" disabled>
</div>

<div class="edit-group">
    <label for="assetAssignedTo">Assigned To</label>
 <select 
  name="assetAssignedTo" 
  id="assetAssignedTo" 
  hx-get="/user-list/${result.userId}" 
  hx-trigger="focus delay:0.3s" 
  hx-target="#assetAssignedTo" 
  hx-swap="innerHTML"
  onchange="handleUserChange(event)">
   <option value="${result.userId}">${result.userName}</option>
</select>
        </div>

        <div class="edit-group" id="signatureContainer" style="display: none;">
  <label>Signature(Assigned To)</label>
  <canvas id="signaturePad" width="300" height="200" style="border:1px solid #000; touch-action: none;"></canvas>
  <input type="hidden" name="signatureData" id="signatureData">
  <button type="button" onclick="clearSignature()">Clear</button>
</div>


<div class="edit-group">
    <button class="btnEditAsset" hx-put="/asset/edit/${result.assetId}" hx-target=".main" hx-trigger="click">Update</button>
    </div>
    
  </form>
</div>
</div>
`;

export default editAssetHomeTemplate;
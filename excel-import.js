import { safeToast } from "./safeToast.js";

export function initDropzoneImport(table) {
  const dz = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  if (!dz || !fileInput) return;

  const processFile = (file) => {
    if (!file || !file.name.endsWith(".xlsx")) {
      safeToast("error", "Please choose a valid .xlsx file.", 2);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      if (!Array.isArray(rows) || rows.length === 0) {
        safeToast("error", "Sheet is empty or not formatted correctly.", 2);
        return;
      }

      const mapped = rows.map(r => ({
        subactivity: r["Subactivity"] ?? "",
        currentQuantity: parseFloat(r["Current Quantity"]) || 0,
        requestedQuantity: parseFloat(r["Requested Quantity"]) || 0,
        unitOfMeasure: r["Unit of measure"] ?? r["Unit of Measure"] ?? "",
        contractPrice: parseFloat(r["Contract Price per unit"] ?? r["Contract price per unit"]) || 0,
        expectedTotalPrice: 0
      }));

      table.clearData();
      table.setData(mapped);
      safeToast("success", "Excel file imported successfully!", 1);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle drag & drop
  dz.addEventListener("dragover", e => { e.preventDefault(); dz.classList.add("dragover"); });
  dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
  dz.addEventListener("drop", e => {
    e.preventDefault();
    dz.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    processFile(file);
  });

  // Handle file selection
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    processFile(file);
    // Reset input value to allow re-uploading the same file
    e.target.value = "";
  });
}

import { darkTheme } from "./dark-theme.js";
import { exportTableToExcel } from "./excel-export.js";
import { initDropzoneImport } from "./excel-import.js";
import { safeToast } from "./safeToast.js";
import { clearTable } from "./clearTable.js";

document.addEventListener("DOMContentLoaded", async () => {
  let table = null;
  let copiedRowData = null;
  let tabledata = [];

  // const tabledata = [
  //   { subactivity: "", currentQuantity: 0, requestedQuantity: 0, unitOfMeasure: "", contractPrice: 0, expectedTotalPrice: 0 }
  // ];

  const toNum = v => {
    if (v == null || v === "") return 0;
    if (typeof v === "string") v = v.replace(/\s/g, "").replace(",", ".");
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  table = new Tabulator("#subactivities-table", {
    dependencies: {
      XLSX: XLSX,
    },
    selectableRows: 1,
    layout: "fitColumns",
    reactiveData: true,
    data: tabledata,
    responsiveLayout:true,
    

    // num currentQuantity  requestedQuantity unitOfMeasure contractPrice expectedTotalPrice
    columns: [ 
      // field: "num",
      { title: "#", formatter: "rownum", width: 50, cssClass: "bg-zero" },

      { title: "Current Quantity", field: "currentQuantity", sorter: "number", editor: "number" },
      {
        title: "Requested Quantity", field: "requestedQuantity", sorter: "number", editor: "number", mutator: (value) => toNum(value),
        formatter: (cell) => {
          const value = cell.getValue();
          return `<span style="color: ${value < 0 ? 'red' : 'inherit'}">${value}</span>`;
        },
      },
      { title: "Unit of measure", field: "unitOfMeasure", sorter: "string", editor: "list", editorParams: { values: { "Kilos": "Kilos", "Litres": "Litres", "Metres": "Metres" }, clearable: true } },
      {
        title: "Contract Price per unit", field: "contractPrice", sorter: "number", editor: "number", mutator: (value) => toNum(value),
        formatter: (cell) => {
          const value = cell.getValue();
          return `<span style="color: ${value < 0 ? 'red' : 'inherit'}">${value}</span>`;
          
        },
      },
      {
        title: "Expected Total Price in EUR",
        field: "expectedTotalPrice",
        sorter: "number",
        editor: false,
        mutator: function (value, data) {
          const price = toNum(data.contractPrice);
          const qty = toNum(data.requestedQuantity);
          return price * qty;
        },
        formatter: "money",
        formatterParams: { symbol: "€", precision: 2, symbolAfter: true },
      },
      {
        field: "delete",
        title: "",
        width: 50,
        headerSort: false,
        formatter: () => "<button class='px-2 py-1 rounded text-red-400 border border-red-500 hover:bg-red-700 hover:text-white transition'>✕</button>",
        cssClass: "delete-c",
        cellClick: (e, cell) => cell.getRow().delete()
      }
    ],

  });

  table.on("cellEdited", function (cell) {
    const field = cell.getField();
    const value = cell.getValue();
    const row = cell.getRow();
    const data = row.getData();

    const toNum = v => {
      if (v == null || v === "") return 0;
      if (typeof v === "string") v = v.replace(/\s/g, "").replace(",", ".");
      const n = Number(v);
      return Number.isFinite(n) ? n : NaN;
    };

    // Validate input
    if ((field === "requestedQuantity" || field === "contractPrice")) {
      const num = toNum(value);

      if (isNaN(num)) {
        alert("Invalid number entered!");
        return;
      }

      if (num < 0) {
        alert("Value cannot be negative!"); 
        return;
      }

      const total = toNum(data.contractPrice) * toNum(data.requestedQuantity);
      row.update({ expectedTotalPrice: total });
    }
  });



  // Keep layout crisp
  ["rowAdded", "rowDeleted", "dataSorted", "dataFiltered", "dataLoaded"].forEach((ev) =>
    table.on(ev, () => table.redraw(true))
  );

  // Select row & copy data
  table.on("rowClick", (e, row) => {
    copiedRowData = row.getData();
    console.log("Row selected:", copiedRowData);
  });

  initDropzoneImport(table);
  // Keep layout crisp
  ["rowAdded", "rowDeleted", "dataSorted", "dataFiltered", "dataLoaded"].forEach(ev =>
    table.on(ev, () => table.redraw(true))
  );

  table.on("rowClick", (e, row) => {
    copiedRowData = row.getData();
    console.log("Row selected:", copiedRowData);
  });



  document.getElementById("pasteButton").addEventListener("click", async (e) => {
    if (!copiedRowData) {
      await safeToast("error", "Copy a row first by clicking on it!", 2);
      return;
    }
    const newData = { ...copiedRowData };
    const row = await table.addRow(newData);
    // recalcRow(row);
  });

  document.getElementById("deselectButton").addEventListener("click", async (e) => {
    table.deselectRow();
    copiedRowData = null;
    await safeToast("success", "Selection cleared.", 1);
  });

  document.getElementById("reactivity-add").addEventListener("click", async (e) => {
    const row = await table.addRow({
     // subactivity: "",
      currentQuantity: 0,
      requestedQuantity: 0,
      unitOfMeasure: "",
      contractPrice: 0,
      expectedTotalPrice: 0
    });
    // recalcRow(row);
  });

  document.getElementById("clearTable").addEventListener("click", async () => {
    clearTable(table , tabledata);
  });

  document.getElementById("exportExcel").addEventListener("click", () => {
    exportTableToExcel(table);
  });

  darkTheme();

  // Initial load
  try {
    const res = await fetch("http://localhost:5028/api/subactivities");
    const savedData = await res.json();
    //table.setData(savedData);
     tabledata.splice(0, tabledata.length, ...savedData); 
     table.redraw(true);
  } catch (err) {
    await safeToast("error", "Error! Server not responding.", 2);
  }

  // Load from server
  try {
    const res = await fetch("http://localhost:5028/api/subactivities");
    const data = await res.json();
    table.setData(data);
  } catch (e) {
    await safeToast("error", "Error! Server not responding.", 2);
  }

  //Save
  document.getElementById("test").addEventListener("click", async () => {
    const data = table.getData();

    console.log("Saving data:", data);

    try {
      const res = await fetch("http://localhost:5028/api/subactivities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await safeToast("success", "Data saved successfuly!", 1);
      } else {
        await safeToast("error", "Error! Data was not saved.", 2);
      }
    } catch (e) {
      await safeToast("error", "Error! Server not responding.", 2);
    }
  });

  
}); 
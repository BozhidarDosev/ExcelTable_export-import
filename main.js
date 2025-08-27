import { darkTheme } from "./dark-theme.js";
import { exportTableToExcel } from "./excel-export.js";    
import { initDropzoneImport } from "./excel-import.js"; 
import { safeToast } from "./safeToast.js";


document.addEventListener("DOMContentLoaded", () => {
let table = null;
let copiedRowData = null;

  const tabledata = [
          { subactivity: "", currentQuantity: 0, requestedQuantity: 0, unitOfMeasure: "", contractPrice: 0, expectedTotalPrice: 0 }
];

table = new Tabulator("#subactivities-table", {
          dependencies:{
        XLSX:XLSX,
    }, 
    selectableRows: 1,
          layout: "fitColumns",
          reactiveData: true,
          data: tabledata,
          columns: [
            { title: "#", formatter: "rownum", width: 50, cssClass: "bg-zero" },
            
            { title: "Current Quantity", field: "currentQuantity", sorter: "number", editor: "number"},
            { title: "Requested Quantity", field: "requestedQuantity", sorter: "number", editor: "number"},
            { title: "Unit of measure", field: "unitOfMeasure", sorter: "string", editor: "input", headerFilter: "input" },
            { title: "Contract Price per unit", field: "contractPrice", sorter: "number", editor: "number" },
            {
              title: "Expected Total Price in EUR",
              field: "expectedTotalPrice",
              sorter: "number",
              editor: false,
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
          ]
        });

        initDropzoneImport(table);

        // Keep layout crisp
        ["rowAdded","rowDeleted","dataSorted","dataFiltered","dataLoaded"].forEach(ev =>
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
            subactivity: "",
            currentQuantity: 0,
            requestedQuantity: 0,
            unitOfMeasure: "",
            contractPrice: 0,
            expectedTotalPrice: 0
        });
       // recalcRow(row);
    });

    document.getElementById("clearTable").addEventListener("click", async (e) => {
        table.clearData();
        table.setData(tabledata);
    });

    document.getElementById("exportExcel").addEventListener("click", () => {
        exportTableToExcel(table);
    });

    darkTheme();

 });
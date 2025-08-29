import { safeToast } from "./safeToast.js";

export async function clearTable(table, tabledata) {
  console.log("Current table data:", tabledata);

  const currentData = table.getData();

  if (currentData.length === 0) {
    await safeToast("info", "Table is already empty.", 1);
    return;
  }
  // Clear the frontend data (keep reactive reference)
  // tabledata.splice(0, tabledata.length); // reactiveData will pick this up
  table.clearData();
  table.redraw(true); // force UI refresh, optional

  // Send empty array to backend to overwrite saved data
  try {
    const res = await fetch("http://localhost:5028/api/subactivities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([]) // send empty array
    });

    if (res.ok) {
      await safeToast("success", "Table cleared and saved.", 1);
    } else {
      await safeToast("error", "Table was cleared locally, but not saved.", 2);
    }
  } catch (e) {
    await safeToast("error", "Error! Server not responding.", 2);
  }
}
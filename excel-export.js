import { safeToast } from "./safeToast.js";

export function exportTableToExcel(table) {
  const rawData = table.getData();
  if (!rawData.length) return;

  const allCols = table.getColumns().slice(0, -1);

  const headers = allCols
    .map(col => {
      const def = col.getDefinition();
      return def.field && def.title ? { field: def.field, title: def.title } : null;
    })
    .filter(Boolean);

  const cleanedData = rawData.map(row => {
    const cleaned = {};
    headers.forEach(({ field, title }) => {
      cleaned[title] = row[field];
    });
    return cleaned;
  });

try{
  const ws = XLSX.utils.json_to_sheet(cleanedData);

  const colWidths = headers.map(({ title }) => {
    const headerLen = title.length;
    const maxCellLen = Math.max(
      ...cleanedData.map(row => (row[title] != null ? row[title].toString().length : 0))
    );
    return { wch: Math.max(headerLen, maxCellLen) + 2 };
  });

  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Subactivities");

  XLSX.writeFile(wb, "subactivities.xlsx");
  safeToast("success", "Excel file exported successfully!", 1);       
}catch(err){
  safeToast("error", "Sheet is empty or not formatted correctly.", 2);
}}

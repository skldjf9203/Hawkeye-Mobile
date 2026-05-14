import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], fileName: string, sheetName: string = 'Data') {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Basic styling isn't well supported in generic xlsx, 
  // but we can set column widths
  const max_width = data.reduce((w, r) => Math.max(w, Object.values(r).join('').length / 10), 10);
  ws['!cols'] = Object.keys(data[0] || {}).map(() => ({ wch: Math.min(max_width, 50) }));

  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

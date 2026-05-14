import pptxgen from 'pptxgenjs';

export function exportToPptx(records: any[], title: string) {
  const pptx = new pptxgen();
  
  pptx.layout = 'LAYOUT_16x9';

  // Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: '1A233A' }; // Navy
  slide1.addText('HawkSpot', {
    x: 0.5, y: 3.5, w: 9, h: 1, 
    fontSize: 48, color: 'D4AF37', // Gold
    bold: true, fontFace: 'Arial'
  });
  slide1.addText(title, {
    x: 0.5, y: 4.5, w: 9, h: 0.5, 
    fontSize: 18, color: 'FFFFFF', 
    italic: true
  });

  // Data Slides
  records.forEach((record, index) => {
    const slide = pptx.addSlide();
    slide.addText(record.shop_name || 'Outlet Record', {
      x: 0.5, y: 0.5, w: 9, h: 0.5,
      fontSize: 24, fontFace: 'Arial', bold: true, color: '1A233A'
    });

    slide.addText(`Area: ${record.area || record.sub_channel || 'N/A'}`, {
      x: 0.5, y: 1, w: 5, h: 0.3,
      fontSize: 14, color: 'D4AF37'
    });

    // Content
    const keys = Object.keys(record).filter(k => k !== 'images' && k !== 'photo_url' && k !== 'id');
    const tableData = keys.slice(0, 10).map(k => [k, String(record[k])]);
    
    slide.addTable(tableData, {
      x: 0.5, y: 1.5, w: 4.5,
      fontSize: 10, border: { type: 'solid', color: 'E2E8F0' }
    });

    // Images
    const imageUrls = record.images || (record.photo_url ? [record.photo_url] : []);
    if (imageUrls.length > 0) {
      slide.addImage({
        path: imageUrls[0],
        x: 5.5, y: 1.5, w: 4, h: 3,
        sizing: { type: 'contain' }
      });
    }
  });

  pptx.writeFile({ fileName: `${title.replace(/\s+/g, '_')}_Report.pptx` });
}

import { toPng } from 'html-to-image';

export async function exportCollage(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });
    
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (err) {
    console.error('oops, something went wrong!', err);
    return false;
  }
}

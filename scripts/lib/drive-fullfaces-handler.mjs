import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import puppeteer from 'puppeteer';

const DRIVE_ROOT_FOLDER_ID = '1SEUdG3OIiRZ_BNxTKPLB2GRBFiSYv-Z4';
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');

const ENTRY_PATTERN = /id="entry-([^"]+)"[\s\S]*?flip-entry-title">([^<]+)<\/div>/g;

async function listDriveFolder(folderId) {
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Drive listing failed for ${folderId}: ${response.status}`);
  }
  const html = await response.text();
  const entries = [];
  for (const match of html.matchAll(ENTRY_PATTERN)) {
    entries.push({ fileId: match[1], name: match[2].trim() });
  }
  return entries;
}

async function downloadDriveFile(fileId) {
  const baseUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  let response = await fetch(baseUrl, { redirect: 'manual' });

  let cookies = [];
  const setCookie = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
  if (setCookie.length) {
    cookies = setCookie.map(c => c.split(';')[0]);
  } else if (response.headers.get('set-cookie')) {
    cookies = [response.headers.get('set-cookie').split(';')[0]];
  }

  if (response.status >= 300 && response.status < 400) {
    const loc = response.headers.get('location');
    response = await fetch(loc, {
      headers: { Cookie: cookies.join('; ') }
    });
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('text/html')) {
    const html = await response.text();
    const confirmMatch =
      html.match(/confirm=([0-9A-Za-z_]+)/) ??
      html.match(/download_warning[^>]*>[\s\S]*?confirm=([0-9A-Za-z_]+)/) ??
      html.match(/name="confirm"\s+value="([^"]+)"/);
    if (confirmMatch) {
      const confirmUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirmMatch[1]}`;
      response = await fetch(confirmUrl, {
        headers: { Cookie: cookies.join('; ') }
      });
    } else {
      throw new Error(`Drive returned HTML without confirm token for ${fileId}`);
    }
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}

function extractEmbeddedJpeg(pdfBuf) {
  let startIndex = 0;
  let largestJpeg = null;
  while ((startIndex = pdfBuf.indexOf(Buffer.from([0xff, 0xd8, 0xff]), startIndex)) !== -1) {
    const endIndex = pdfBuf.indexOf(Buffer.from([0xff, 0xd9]), startIndex);
    if (endIndex !== -1) {
      const candidate = pdfBuf.subarray(startIndex, endIndex + 2);
      if (!largestJpeg || candidate.length > largestJpeg.length) {
        largestJpeg = candidate;
      }
      startIndex = endIndex + 2;
    } else {
      break;
    }
  }
  return largestJpeg && largestJpeg.length > 50000 ? largestJpeg : null;
}

let browserInstance = null;
async function renderPdfPage(pdfBuf) {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  const base64Pdf = pdfBuf.toString('base64');
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
      <style>body, html { margin: 0; padding: 0; background: #fff; } canvas { display: block; }</style>
    </head>
    <body>
      <canvas id="pdf-canvas"></canvas>
      <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdfData = atob('${base64Pdf}');
        pdfjsLib.getDocument({ data: pdfData }).promise.then(async function(pdf) {
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 4.0 });
          const canvas = document.getElementById('pdf-canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          window._renderDone = true;
        });
      </script>
    </body>
    </html>
  `;
  const page = await browserInstance.newPage();
  await page.setViewport({ width: 3000, height: 4000 });
  await page.setContent(html);
  await page.waitForFunction('window._renderDone === true', { timeout: 30000 });
  const canvasEl = await page.$('#pdf-canvas');
  const screenshotBuf = await canvasEl.screenshot();
  await page.close();
  return screenshotBuf;
}

export async function processFullFacesAsset(fileId, fileName, targetPath) {
  console.log(`  Processing FullFaces: ${fileName} -> ${path.basename(targetPath)}`);
  const rawBuf = await downloadDriveFile(fileId);

  let imageBuf = null;
  if (/\.pdf$/i.test(fileName)) {
    const embedded = extractEmbeddedJpeg(rawBuf);
    if (embedded) {
      console.log(`    Extracted high-res embedded JPEG (${(embedded.length / 1e6).toFixed(2)} MB)`);
      imageBuf = embedded;
    } else {
      console.log(`    Rendering PDF page via PDF.js...`);
      imageBuf = await renderPdfPage(rawBuf);
    }
  } else {
    imageBuf = rawBuf;
  }

  // Optimize keeping exact original layout and aspect ratio
  await mkdir(path.dirname(targetPath), { recursive: true });
  await sharp(imageBuf)
    .rotate()
    .resize({
      width: 2800,
      height: 2800,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(targetPath);

  const stat = await sharp(targetPath).metadata();
  console.log(`    ✓ Saved optimized FullFaces: ${stat.width}x${stat.height}px`);
}

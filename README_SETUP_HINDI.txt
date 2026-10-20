RAJ GROUP CHEQUE RETURN DATA — V7.4 (20 October 2026)
GitHub Pages Frontend + Existing Google Apps Script / Google Sheets Backend

DOWNLOAD KE BAAD KYA UPLOAD KARNA HAI:
Existing GitHub repo: pxpixaro/RAJ-GROUP-CHEQUE-RETURN
ZIP ke ROOT mein ye 5 files hain; repo root par inhi names se upload / replace karein:
  1. index.html
  2. style.css
  3. script.js
  4. excel-export.js (NAYI FILE — zaroor upload karein)
  5. logo.jpg (unchanged)

Google Apps Script mein Code.gs ko NA badlein aur dobara deploy ki zarurat NAHI.
Same Google Sheet ID aur Web App /exec URL script.js mein preserved hain.

FEATURE 1 — MERGED CHEQUE IN HAND:
Entry form mein Y2010 likhein -> Yes-20/10/2026.
Entry form mein N2010 likhein -> No-20/10/2026.
Y201026 / N201026 (full year ke compact forms) bhi support hain.
Yes-20/10/2026 / No-20/10/2026 direct enter kar sakte hain.
Text ka format typing ke baad ya field leave karte hi normal ho jayega.
Old Google Sheet ke 'Cheque Is In Hand' aur 'Cheque Is In Hand Date' columns alag hi rahenge.
Naya UI data ko combine karke dikhata hai; purana data delete/change nahin hota.
Purane records bhi editing mein sahi combined field mein dikhte hain.

FEATURE 2 — COLUMN FILTERS:
Blue table ke kisi data heading par click karein (small arrow ▾).
Unique values ke saath dropdown khulega; duplicate values ek hi baar dikhenge.
Legal Remark -> CASE MATE JOVU select karne se sirf matching entries.
Multiple columns ke filters saath apply (AND).
Filter mein search box, (Blank), Clear Filters button available hain.
Cheque Image heading se Attached / No Image filter hota hai.
Actions column mein filter nahi (sirf Edit/Delete controls hain).
Year change par column filters reset ho jaate hain.

FEATURE 3 — REAL EXCEL EXPORT:
Export to Excel (.xlsx) — REAL valid Excel workbook, CSV file nahi.
Export filtered matching records ko include karta hai (all pages, sirf current page nahi).
Sheet mein heading filters hain; amounts numeric hain; cheque number & DD/MM/YYYY dates text
rakhe gaye hain, taaki leading zeros aur date interpretation na bigde.
Koi CDN / internet library dependency nahi; excel-export.js ko upload karna zaroori hai.

RELEASE PROCESS:
1. GitHub repo ke root mein saari 5 files upload / replace karke Commit karein.
2. GitHub Pages update complete hone ka wait karein (1-3 minutes common).
3. Page kholen: https://pxpixaro.github.io/RAJ-GROUP-CHEQUE-RETURN/
4. Ctrl+Shift+R hard-refresh karein.
5. Google Sheets connected confirm karein. Test entry: y2010 / n2010.
6. Legal Remark column heading click karke test filter karein.
7. Export to Excel button se XLSX download karke verify karein.

PLEASE NOTE:
Public/no-login setup mein financial records sab URL visitors ko accessible hain.
Koi backend Code.gs ya existing Google Sheet headers/records/is folder ke andar change nahi kiya gaya.
Pehle Google Sheet ka backup rakhna achha rahega.

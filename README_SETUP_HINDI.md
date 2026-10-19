# RAJ GROUP CHEQUE RETURN DATA — GitHub Pages + Google Sheets (V5)

## Ye version exactly kya karta hai?
Website **GitHub Pages** par hi dikhegi: `https://cheque.rajagencies.info`.
User ko pehle **simple browser password login** milega. Login ke baad entry, search,
financial year, edit/delete, dropdown, image attachment + View Image ka UI milega.
Data **Google Sheets**, aur cheque photos **aapke Google Drive** mein jayengi.
Cloudflare / alag hosting nahi chahiye. Apps Script sirf invisible data bridge hai,
website Apps Script par host nahi hoti.

**ZAROORI:** Browser-only password **SECURITY NAHI HAI**. Jise technical knowledge ho,
woh bypass kar sakta hai. Apps Script web app ko "Anyone" access dena padega,
isliye aapka Google Sheets backend bhi public callable hoga. Domain allowlist in
Bridge.html actual authentication nahi hoti. Real cheque data private rakhne ke
liye is setup ko use na karein jab tak proper secure backend nahi hota.

## STEP 1 — Google Apps Script backend
1. Google Sheet kholo: https://docs.google.com/spreadsheets/d/1MimGbYNBqVbDLOxC7TIVv8IQImNCPkxSgnmjq94NxnQ/edit
2. Extensions > Apps Script.
3. `backend/Code.gs` ka full code paste karein (purana replace).
4. + > HTML file: naam **Bridge** (capital B); `backend/Bridge.html` paste karein.
5. Project Settings mein `appsscript.json` chahein to upload/replace karein (optional).
6. Bridge.html mein `ALLOWED_PARENT_ORIGINS` array mein aapka website origin
   `https://cheque.rajagencies.info` already hai. GitHub Pages default URL par
   bhi test karna ho to exact origin `https://YOUR-USERNAME.github.io` add karein.
7. Deploy > New deployment > Web App > Execute as **Me** > Who has access **Anyone**.
   Authorize permissions. Copy Web App URL ending in **/exec**.
8. Browser mein `/exec` URL kholne par blank bridge page dikhega, ye normal hai.

## STEP 2 — GitHub Pages frontend
1. `script.js` mein `APPS_SCRIPT_WEB_APP_URL` ko apne /exec URL se replace karein.
2. GitHub public repository ke ROOT mein **sirf** ye files upload karein:
   `index.html`, `style.css`, `script.js`, `logo.jpg`, `CNAME`.
   **backend folder GitHub par upload karne ki zaroorat nahi**.
3. Settings > Pages > main branch / root, aur Custom Domain: `cheque.rajagencies.info`.
4. DNS CNAME `cheque` -> `YOUR-USERNAME.github.io`, HTTPS enable.
5. Site open karein. First time password set karein; agli baar same browser
   par password se login karein. Password is browser ke localStorage mein stored hash hai.
   Browser data clear hua ya new device hai toh naya password set ho sakta hai.
6. Login > **Initialize Google Sheet** click karein. 2026-2030 year tabs aur DROP DOWN
   list initialize hogi. Existing master data overwrite nahi kiya jata.
7. TEST: Ek dummy entry + image add karein, Google Sheet aur Drive check karein,
   phir Refresh, View Image, edit, delete test karein.

## Connection error?
- Blank/error: `script.js` mein URL sahi /exec hai?
- Browser third-party cookies / iframe restrictions block kar sakte hain. Apps Script
  iframe embed unsupported browser settings mein fail ho sakta hai. Incognito/cookie
  settings aur Browser console check karein.
- `Bridge.html` allowlist mein website ka exact origin (protocol + hostname) hai?
- Deployment `Anyone`, `Execute as Me` aur fresh version deployed hai?
- Google Sheet / Drive permissions deployment owner ko mil gayi hain?
- 25-second timeout ho to browser / network iframe embed ko block kar raha ho sakta hai.
- Apps Script edit ke baad **Deploy > Manage deployments > Edit > New version > Deploy**.

## IMPORTANT data & security caveats
- Password sirf UI lock hai; backend ko authenticate **nahi** karta.
- Publicly deployed Apps Script to anyone is **NOT private**. Customer cheque details,
  account numbers aur photos sensitive ho sakte hain. Is design mein unka real
  production use recommend nahi hai. For secure usage use Google Sign-In based API
  or authenticated backend proxy.
- Apps Script quotas/size limits apply; photo limit 4 MB, upload via postMessage
  browser/Apps Script HTML bridge may fail for large images or blocked frames.
- Apps Script Web App URL hidden by page design hai, secret nahi. Public frontend
  source mein URL dekha ja sakta hai.
- If user needs actual privacy, use protected Apps Script-only hosting instead.

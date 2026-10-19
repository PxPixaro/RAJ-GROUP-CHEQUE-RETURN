# RAJ GROUP — GitHub Pages Single-Browser Password Login (V4)

## GitHub par kaise lagayein
Root ki ye files GitHub Pages repository par upload karein: `index.html`, `style.css`, `script.js`, `logo.jpg`, `CNAME`.
Settings > Pages > main / root se GitHub Pages enable karein. DNS mein `cheque` CNAME ko `<username>.github.io` par point karein. Pages settings mein custom domain `cheque.rajagencies.info` set karein.

## Login
Pehli baar site kholne par apna password set karein (kam se kam 8 characters). Agli baar us browser mein password daal ke login ho jayega. Logout button maujood hai. Password ka SHA-256 hash sirf *usi browser* ke localStorage mein rakha jata hai. Kisi aur browser/device par alag password set ho sakta hai. Browser ka data clear kiya toh password aur records dono hat sakte hain.

## BAHUT ZAROORI: Security aur Saving
Is edition ka login SIRF screen lock hai. GitHub Pages static hai, isliye technically koi developer tools se lock bypass kar sakta hai. Isko confidential cheque data bachane wala secure login NA SAMJHEIN.
**Entry Google Sheets mein save NAHI hoti.** Entry aur attached photo localStorage mein save karne ki koshish hoti hai, jo photo badi hone par storage quota exceed kar sakta hai. Records browser change/clear karne par nahi milenge. Sensitive real cheque details upload mat karein. Demo/test ke liye use karein.

Google Sheets + Google Drive mein permanent and protected data save karne ke liye alag authenticated backend chahiye. Bina Cloudflare ke easiest secure option: pura UI Google Apps Script HtmlService par host karein aur Google account se access restrict karein. GitHub Pages URL ko wahi rakhe hue securely use karne ke liye independent backend/auth service chahiye.

Original V3 Apps Script backend is NOT automatically connected to this GitHub version.

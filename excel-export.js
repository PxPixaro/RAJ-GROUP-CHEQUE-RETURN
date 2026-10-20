/* RAJ GROUP V7.4 — Offline native .xlsx writer. No external CDN, Google Sheet or login needed. */
(function(){
'use strict';
const encoder=new TextEncoder();
const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let i=0;i<8;i++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(bytes){let c=0xFFFFFFFF;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
function w16(b,pos,x){b[pos]=x&255;b[pos+1]=(x>>>8)&255}
function w32(b,pos,x){w16(b,pos,x&65535);w16(b,pos+2,(x>>>16)&65535)}
function join(chunks){const total=chunks.reduce((n,b)=>n+b.length,0),result=new Uint8Array(total);let off=0;for(const b of chunks){result.set(b,off);off+=b.length}return result}
function archive(files){
  const locals=[],centers=[];let offset=0;
  for(const file of files){
    const name=encoder.encode(file.name),data=encoder.encode(file.xml),crc=crc32(data);
    const local=new Uint8Array(30+name.length);w32(local,0,0x04034b50);w16(local,4,20);w16(local,6,0x0800);w16(local,8,0);w32(local,14,crc);w32(local,18,data.length);w32(local,22,data.length);w16(local,26,name.length);local.set(name,30);
    locals.push(local,data);
    const central=new Uint8Array(46+name.length);w32(central,0,0x02014b50);w16(central,4,20);w16(central,6,20);w16(central,8,0x0800);w16(central,10,0);w32(central,16,crc);w32(central,20,data.length);w32(central,24,data.length);w16(central,28,name.length);w32(central,42,offset);central.set(name,46);centers.push(central);
    offset+=local.length+data.length;
  }
  const centralSize=centers.reduce((n,v)=>n+v.length,0);const end=new Uint8Array(22);w32(end,0,0x06054b50);w16(end,8,files.length);w16(end,10,files.length);w32(end,12,centralSize);w32(end,16,offset);
  return join([...locals,...centers,end]);
}
function xmlEscape(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'')}
function colName(index){let s='';for(let n=index+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s}
function makeXlsx(headings,rows,numericIndex){
  if(!Array.isArray(headings)||!headings.length)throw Error('No Excel columns');
  if(!Array.isArray(rows))throw Error('Invalid Excel records');
  if(rows.length>1048575)throw Error('Excel supports at most 1,048,575 data rows');
  const right=colName(headings.length-1),last=rows.length+1;
  function cell(value,ri,ci){
    const ref=colName(ci)+(ri+1);
    if(ri!==0&&ci===numericIndex&&value!==''&&value!=null&&Number.isFinite(Number(value)))return '<c r="'+ref+'"><v>'+Number(value)+'</v></c>';
    const style=ri===0?' s="1"':'';
    return '<c r="'+ref+'"'+style+' t="inlineStr"><is><t xml:space="preserve">'+xmlEscape(value)+'</t></is></c>';
  }
  // Keep dates and cheque numbers TEXT so Excel will not silently misinterpret DD/MM/YYYY or strip leading zeroes.
  const parts=['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>',
    '<cols>',...headings.map((h,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+(i===3?35:i===10?24:i===11?24:i===6?16:18)+'" customWidth="1"/>'),'</cols><sheetData>',
    '<row r="1">'+headings.map((h,i)=>cell(h,0,i)).join('')+'</row>'];
  for(let i=0;i<rows.length;i++)parts.push('<row r="'+(i+2)+'">'+headings.map((_,j)=>cell((rows[i]||[])[j],i+1,j)).join('')+'</row>');
  parts.push('</sheetData><autoFilter ref="A1:'+right+last+'"/></worksheet>');
  const styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF093D87"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  return archive([
    {name:'[Content_Types].xml',xml:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'},
    {name:'_rels/.rels',xml:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
    {name:'xl/workbook.xml',xml:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Cheque Returns" sheetId="1" r:id="rId1"/></sheets></workbook>'},
    {name:'xl/_rels/workbook.xml.rels',xml:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
    {name:'xl/styles.xml',xml:styles},
    {name:'xl/worksheets/sheet1.xml',xml:parts.join('')}
  ]);
}
function save(headings,rows,filename,numericIndex){
  const bytes=makeXlsx(headings,rows,numericIndex);
  const blob=new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=filename||'RAJ_GROUP_Cheque_Returns.xlsx';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
window.RajExcel={save,makeXlsx};
})();

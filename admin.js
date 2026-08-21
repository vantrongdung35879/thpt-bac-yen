(() => {
  const api=(window.APP_CONFIG||{}).API_URL||'';
  const $=id=>document.getElementById(id);
  let secret='', dataset=[];
  function msg(text,cls=''){ $('msg').textContent=text; $('msg').className=`msg ${cls}`; }
  function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  async function post(payload){
    if(!api||api.includes('YOUR_GOOGLE')) throw new Error('Hệ thống chưa cấu hình API trong config.js.');
    const r=await fetch(api,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
    const data=await r.json(); return data;
  }
  async function load(){
    const r=await post({action:'adminList',secret}); if(!r.ok) throw new Error(r.error||'Không thể tải dữ liệu.');
    dataset=Array.isArray(r.students)?r.students:[]; updateClassFilter_(); render();
  }
  function updateClassFilter_(){
    const sel=$('classFilter'), cur=sel.value;
    const cls=[...new Set(dataset.map(x=>String(x.className||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
    sel.innerHTML='<option value="">Tất cả lớp</option>'+cls.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
    if(cls.includes(cur)) sel.value=cur;
  }
  function render(){
    const q=$('search').value.trim().toLowerCase(), c=$('classFilter').value, s=$('statusFilter').value;
    const list=dataset.filter(x=>{
      const name=String(x.fullName||'').toLowerCase();
      return (!q||name.includes(q))&&(!c||x.className===c)&&(!s||(s==='done'?!!x.completed:!x.completed));
    });
    const base=new URL(location.href); base.pathname=base.pathname.replace(/admin\.html$/i,''); base.search=''; base.hash='';
    $('rows').innerHTML=list.map(x=>{
      const subjects=['subject1','subject2','subject3','subject4','subject5','subject6','subject7'].filter(k=>x[k]).map((k,i)=>['Toán','Tiếng Anh','Vật lí','Hóa học','Sinh học','Lịch sử','Địa lý'][Number(k.replace('subject',''))-1]).join(', ');
      const url=`${base.toString()}?id=${encodeURIComponent(x.token)}`;
      return `<tr><td><strong>${esc(x.fullName)}</strong></td><td>${esc(x.className||'')}</td><td>${esc(x.email||'')}</td><td>${esc(x.phone||'')}</td><td>${esc(subjects)}</td><td><span class="pill ${x.completed?'good':'pending'}">${x.completed?'Đã hoàn thành':'Chưa hoàn thành'}</span></td><td><button class="copy" data-url="${esc(url)}">Copy link</button></td></tr>`;
    }).join('') || '<tr><td colspan="7" style="text-align:center;padding:24px">Chưa có học sinh.</td></tr>';
    document.querySelectorAll('button.copy').forEach(b=>b.onclick=async()=>{
      try{ await navigator.clipboard.writeText(b.dataset.url); b.textContent='Đã copy'; setTimeout(()=>b.textContent='Copy link',1200); }
      catch(e){ prompt('Sao chép link này:',b.dataset.url); }
    });
    const total=dataset.length, done=dataset.filter(x=>!!x.completed).length;
    $('total').textContent=total; $('done').textContent=done; $('pending').textContent=total-done; $('progress').textContent=total?`${Math.round(done*100/total)}%`:'0%';
  }
  async function login(){
    secret=$('password').value.trim(); if(!secret) return;
    try{
      const r=await post({action:'adminCheck',secret}); if(!r.ok) throw new Error(r.error||'Sai mật khẩu.');
      $('login').classList.add('hidden'); $('admin').classList.remove('hidden'); $('logout').classList.remove('hidden'); await load();
    }catch(e){ $('loginMsg').textContent=e.message; $('loginMsg').className='msg error'; }
  }
  $('loginForm').onsubmit=e=>{e.preventDefault();login();};
  $('logout').onclick=()=>location.reload();
  $('refresh').onclick=()=>load().then(()=>msg('Đã làm mới dữ liệu.','ok')).catch(e=>msg(e.message,'error'));
  ['search','classFilter','statusFilter'].forEach(id=>$(id).addEventListener('input',render));

  $('export').onclick=async()=>{
    try{
      msg('Đang lấy mẫu Excel gốc và dữ liệu mới…');
      const r=await post({action:'exportData',secret});
      if(!r.ok) throw new Error(r.error||'Không thể lấy dữ liệu xuất.');
      const bin=atob(r.base64), bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
      const wb=XLSX.read(bytes,{type:'array',cellDates:true});
      const students=Array.isArray(r.students)?r.students:[];
      const byKey=new Map(students.map(x=>[studentKey_(x),x]));
      let updated=0;

      wb.SheetNames.forEach((sheetName, sheetIndex)=>{
        const ws=wb.Sheets[sheetName];
        const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:true});
        const headerIndex=findHeaderRow_(rows);
        if(headerIndex<0) return;

        const header=rows[headerIndex]||[];
        const cols=headerMap_(header);
        const dataRows=[];
        for(let i=headerIndex+1;i<rows.length;i++){
          const row=rows[i]||[];
          const name=cell_(row,cols.fullName);
          const cls=cell_(row,cols.className);
          if(!String(name).trim()) continue;
          dataRows.push({i,row,name,cls});
        }

        dataRows.forEach(({i,row,name,cls})=>{
          const student=byKey.get(studentKey_({fullName:name,className:cls}));
          if(!student) return;
          ensureRowLength_(row,Math.max(...Object.values(cols).filter(v=>v>=0),14)+1);
          setCell_(row,cols.fullName,student.fullName);
          setCell_(row,cols.email,student.email);
          setCell_(row,cols.birthDate,student.birthDate);
          setCell_(row,cols.gender,student.gender);
          setCell_(row,cols.grade,student.grade);
          setCell_(row,cols.address,student.address);
          setCell_(row,cols.phone,student.phone);
          setCell_(row,cols.className,student.className);
          SUBJECT_KEYS.forEach((k,idx)=>setCell_(row,cols[k],student[k]||''));
          for(let c=0;c<row.length;c++) setWsCell_(ws,i,c,row[c]);
          updated++;
        });

        // Cập nhật các dòng tổng, nhưng giữ nguyên toàn bộ định dạng và nội dung khác.
        const totalRows=rows.length-headerIndex-1;
        if(sheetIndex===0){
          setWsCell_(ws,0,0,`Danh sách đăng ký tài khoản học sinh Trường THPT Bắc Yên`);
          setWsCell_(ws,1,0,`Tổng số lớp : ${new Set(students.map(x=>String(x.className||'').trim()).filter(Boolean)).size} lớp.`);
          setWsCell_(ws,2,0,`Tổng số học sinh: ${students.length}`);
        }
      });

      const out=XLSX.write(wb,{bookType:'xlsx',type:'array'});
      const blob=new Blob([out],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download=(r.filename||'THPT_Bac_Yen.xlsx').replace(/\.xlsx$/i,'')+'_da_cap_nhat.xlsx';
      a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href),1500);
      msg(`Xuất Excel thành công. Đã cập nhật ${updated} học sinh trên mẫu gốc, giữ nguyên các thông tin/Sheet/định dạng khác.`,'ok');
    }catch(e){msg(e.message||'Có lỗi khi xuất Excel.','error');}
  };


  $('importFile').onchange=async e=>{
    const f=e.target.files[0]; if(!f) return;
    try{
      msg('Đang đọc file Excel và lưu mẫu gốc…');
      const arrayBuffer=await f.arrayBuffer();
      const wb=XLSX.read(arrayBuffer,{type:'array',cellDates:true});
      const ws=wb.Sheets[wb.SheetNames[0]];
      const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false});
      const headerIndex=findHeaderRow_(rows); if(headerIndex<0) throw new Error('Không tìm thấy dòng tiêu đề của bảng Excel.');
      const data=rows.slice(headerIndex+1).filter(r=>String(r[0]||'').trim());
      const payload=data.map(r=>({
        fullName:r[0], email:r[1], birthDate:r[2], gender:r[3], grade:r[4], address:r[5], phone:r[6], className:r[7],
        subject1:mark_(r[8]),subject2:mark_(r[9]),subject3:mark_(r[10]),subject4:mark_(r[11]),subject5:mark_(r[12]),subject6:mark_(r[13]),subject7:mark_(r[14])
      }));
      if(!payload.length) throw new Error('File Excel không có học sinh để nhập.');
      const base64=bytesToBase64_(new Uint8Array(arrayBuffer));
      const out=await post({action:'importStudents',secret,students:payload,templateBase64:base64,templateName:f.name});
      if(!out.ok) throw new Error(out.error||'Không thể nhập dữ liệu.');
      await load(); msg(`Đã nhập ${out.count} học sinh. Hệ thống đã lưu mẫu Excel gốc để lần xuất sau không mất dữ liệu/định dạng.`,'ok');
    }catch(err){msg(err.message,'error');}
    finally{e.target.value='';}
  };
  function bytesToBase64_(bytes){
    let binary=''; const chunk=0x8000;
    for(let i=0;i<bytes.length;i+=chunk) binary+=String.fromCharCode(...bytes.subarray(i,Math.min(i+chunk,bytes.length)));
    return btoa(binary);
  }

  function findHeaderRow_(rows){
    for(let i=0;i<Math.min(rows.length,40);i++){
      const h=rows[i]||[];
      const norm=h.map(v=>norm_(v));
      const hasName=norm.some(v=>v.includes('ho va ten')||v.includes('ho ten'));
      const hasEmail=norm.some(v=>v.includes('email'));
      if(hasName && hasEmail) return i;
    }
    return -1;
  }
  function norm_(v){
    return String(v??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  }
  function headerMap_(header){
    const norm=header.map(v=>norm_(v));
    const find=(patterns,fallback=-1)=>{ for(let i=0;i<norm.length;i++) if(patterns.some(p=>norm[i].includes(p))) return i; return fallback; };
    const cols={
      fullName:find(['ho va ten','ho ten'],0), email:find(['email'],1), birthDate:find(['ngay sinh'],2),
      gender:find(['gioi tinh'],3), grade:find(['khoi lop'],4), address:find(['dia chi'],5),
      phone:find(['so dien thoai'],6), className:find(['ten lop'],7)
    };
    SUBJECT_NAMES.forEach((name,idx)=>cols[SUBJECT_KEYS[idx]]=find([norm_(name)],8+idx));
    return cols;
  }
  function studentKey_(x){return `${norm_(x.fullName)}||${norm_(x.className)}`;}
  function cell_(row,i){return i>=0?row[i]:'';}
  function setCell_(row,i,v){if(i>=0)row[i]=v;}
  function ensureRowLength_(row,n){while(row.length<n)row.push('');}
  function setWsCell_(ws,r,c,v){
    if(c<0) return;
    const addr=XLSX.utils.encode_cell({r,c});
    const old=ws[addr];
    if(old){old.v=v; if(typeof v==='number') old.t='n'; else if(v instanceof Date){old.v=v;old.t='d';} else old.t='s';}
    else ws[addr]={t:'s',v:v};
  }

  function mark_(v){ return String(v||'').trim().toLowerCase()==='x'?'x':''; }
})();

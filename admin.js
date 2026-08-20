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
      msg('Đang tạo file Excel…'); const r=await post({action:'exportExcel',secret}); if(!r.ok) throw new Error(r.error||'Không thể xuất file.');
      const bin=atob(r.base64), bytes=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      const blob=new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), a=document.createElement('a');
      a.href=URL.createObjectURL(blob); a.download=r.filename||'THPT_Bac_Yen.xlsx'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); msg('Xuất Excel thành công.','ok');
    }catch(e){msg(e.message,'error');}
  };

  $('importFile').onchange=async e=>{
    const f=e.target.files[0]; if(!f) return;
    try{
      msg('Đang đọc file Excel…'); const wb=XLSX.read(await f.arrayBuffer(),{type:'array',cellDates:true});
      const ws=wb.Sheets[wb.SheetNames[0]], rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false});
      const headerIndex=findHeaderRow_(rows); if(headerIndex<0) throw new Error('Không tìm thấy dòng tiêu đề của bảng Excel.');
      const data=rows.slice(headerIndex+1).filter(r=>String(r[0]||'').trim());
      const payload=data.map(r=>({
        fullName:r[0], email:r[1], birthDate:r[2], gender:r[3], grade:r[4], address:r[5], phone:r[6], className:r[7],
        subject1:mark_(r[8]),subject2:mark_(r[9]),subject3:mark_(r[10]),subject4:mark_(r[11]),subject5:mark_(r[12]),subject6:mark_(r[13]),subject7:mark_(r[14])
      }));
      if(!payload.length) throw new Error('File Excel không có học sinh để nhập.');
      const out=await post({action:'importStudents',secret,students:payload}); if(!out.ok) throw new Error(out.error||'Không thể nhập dữ liệu.');
      await load(); msg(`Đã nhập ${out.count} học sinh và tự tính lại trạng thái hoàn thành.`,'ok');
    }catch(err){msg(err.message,'error');}
    finally{e.target.value='';}
  };
  function findHeaderRow_(rows){
    for(let i=0;i<Math.min(rows.length,30);i++){
      const a=String(rows[i][0]||'').toLowerCase(); const b=String(rows[i][1]||'').toLowerCase();
      if((a.includes('họ')||a.includes('ten')) && (a.includes('tên')||a.includes('name')) && b.includes('email')) return i;
    }
    return -1;
  }
  function mark_(v){ return String(v||'').trim().toLowerCase()==='x'?'x':''; }
})();

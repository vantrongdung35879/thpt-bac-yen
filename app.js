(() => {
  const api = (window.APP_CONFIG||{}).API_URL || '';
  const $ = id => document.getElementById(id);
  const token = new URLSearchParams(location.search).get('id');
  let currentStudent = null;

  const labels = {
    fullName:{label:'Họ và tên',type:'text',required:true},
    email:{label:'Email',type:'email',placeholder:'ten@example.com',required:true},
    birthDate:{label:'Ngày sinh',type:'text',placeholder:'dd/mm/yyyy',required:true},
    gender:{label:'Giới tính',type:'select',options:['Nam','Nữ'],required:true},
    grade:{label:'Khối lớp',type:'text',placeholder:'Ví dụ: 12',required:true},
    address:{label:'Địa chỉ',type:'textarea',placeholder:'Bản, xã...',required:true},
    phone:{label:'Số điện thoại',type:'tel',placeholder:'09xxxxxxxx',required:false},
    className:{label:'Tên lớp',type:'text',placeholder:'Ví dụ: 12A1',required:true}
  };
  const subjects=['Toán','Tiếng Anh','Vật lí','Hóa học','Sinh học','Lịch sử','Địa lý'];

  function setView(name){ ['loading','error','studentApp'].forEach(id=>$(id).classList.toggle('hidden',id!==name)); }
  function showError(msg){ $('errorText').textContent=msg; setView('error'); }
  async function getJson(params){
    if(!api || api.includes('YOUR_GOOGLE')) throw new Error('Hệ thống chưa cấu hình API.');
    const u=new URL(api); Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));
    const r=await fetch(u.toString(),{cache:'no-store'}); const data=await r.json();
    if(!data.ok) throw new Error(data.error||'Có lỗi từ máy chủ.'); return data;
  }
  async function postJson(payload){
    const r=await fetch(api,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
    const data=await r.json(); if(!data.ok) throw new Error(data.error||'Không thể lưu thông tin.'); return data;
  }

  function fieldValue(student,key){ return student[key]==null?'':student[key]; }
  function render(student){
    currentStudent=student;
    $('studentName').textContent=student.fullName||'';
    $('studentClass').textContent=`Lớp ${student.className||''}${student.grade?' · Khối '+student.grade:''}`;
    const done=!!student.completed, badge=$('statusBadge');
    badge.textContent=done?'Đã hoàn thành':'Chưa hoàn thành'; badge.className=`status ${done?'done':'pending'}`;
    const root=$('fields'); root.innerHTML='';
    const fields=[...new Set([...(student.formFields||student.missingFields||[]),'phone'])];
    fields.forEach(key=>{
      const meta=labels[key]; if(!meta) return;
      const wrap=document.createElement('div'); wrap.className='field';
      const label=document.createElement('label'); label.innerHTML=`${meta.label}${meta.required?' <span class="required-star">*</span>':''}`; wrap.appendChild(label);
      let el;
      if(meta.type==='select'){
        el=document.createElement('select'); el.innerHTML='<option value="">Chọn...</option>'+meta.options.map(v=>`<option value="${v}">${v}</option>`).join(''); el.value=fieldValue(student,key);
      }else if(meta.type==='textarea'){
        el=document.createElement('textarea'); el.rows=3; el.placeholder=meta.placeholder||''; el.value=fieldValue(student,key);
      }else{
        el=document.createElement('input'); el.type=meta.type; el.placeholder=meta.placeholder||''; el.value=fieldValue(student,key);
      }
      el.name=key; if(meta.required) el.required=true; wrap.appendChild(el); root.appendChild(wrap);
    });

    const subWrap=document.createElement('div'); subWrap.className='field';
    subWrap.innerHTML='<div class="section-title">Môn học đăng ký</div><p class="hint">Chọn đúng các môn bạn đăng ký.</p>';
    const grid=document.createElement('div'); grid.className='checkbox-grid';
    subjects.forEach((s,i)=>{
      const key=`subject${i+1}`, label=document.createElement('label'); label.className='check';
      label.innerHTML=`<input type="checkbox" name="${key}" value="x"> <span>${s}</span>`;
      label.querySelector('input').checked=String(student[key]||'').toLowerCase()==='x'; grid.appendChild(label);
    });
    subWrap.appendChild(grid); root.appendChild(subWrap);

    $('emptyState').classList.toggle('hidden',!done);
    $('submitBtn').disabled=false;
    $('submitBtn').textContent=done?'CẬP NHẬT THÔNG TIN':'LƯU VÀ HOÀN THÀNH';
    setView('studentApp');
  }

  $('studentForm').addEventListener('submit',async e=>{
    e.preventDefault();
    const button=$('submitBtn'); button.disabled=true;
    $('formMessage').className='form-message'; $('formMessage').textContent='Đang lưu…';
    const fd=new FormData(e.currentTarget), data={};
    // Chỉ các ô đang hiển thị mới được phép cập nhật.
    [...new Set([...(currentStudent.formFields||currentStudent.missingFields||[]),'phone'])].forEach(k=>{ if(fd.has(k)) data[k]=String(fd.get(k)||'').trim(); });
    // Gửi đầy đủ trạng thái môn để có thể bỏ chọn môn đã chọn trước đó.
    SUBJECT_KEYS.forEach(k=>data[k]=fd.get(k)==='x'?'x':'');
    try{
      const out=await postJson({action:'submitStudent',token,data});
      $('formMessage').className='form-message ok';
      $('formMessage').textContent=out.completed?'✓ Đã lưu. Thông tin của bạn đã được hoàn thành.':'✓ Đã lưu thành công.';
      const refreshed=await getJson({action:'getStudent',id:token}); render(refreshed.student);
      $('formMessage').className='form-message ok';
      $('formMessage').textContent=out.completed?'✓ Đã lưu. Thông tin của bạn đã được hoàn thành.':'✓ Đã lưu thành công.';
    }catch(err){
      $('formMessage').className='form-message error'; $('formMessage').textContent=err.message||'Có lỗi xảy ra.'; button.disabled=false;
    }
  });

  const SUBJECT_KEYS=['subject1','subject2','subject3','subject4','subject5','subject6','subject7'];
  if(!token){ showError('Thiếu mã nhận diện học sinh trong đường dẫn.'); return; }
  getJson({action:'getStudent',id:token}).then(r=>render(r.student)).catch(e=>showError(e.message));
})();

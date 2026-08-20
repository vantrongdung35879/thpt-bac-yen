(() => {
  const cfg = window.APP_CONFIG || {};
  const api = cfg.API_URL || "";
  const $ = id => document.getElementById(id);
  const token = new URLSearchParams(location.search).get("id");

  function setView(name) {
    ["loading","error","studentApp"].forEach(id => $(id).classList.toggle("hidden", id !== name));
  }
  function showError(msg){ $("errorText").textContent = msg; setView("error"); }
  async function getJson(params){
    if(!api || api.includes("YOUR_GOOGLE")) throw new Error("Hệ thống chưa cấu hình API.");
    const u = new URL(api); Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));
    const r = await fetch(u.toString(), {cache:"no-store"});
    const data = await r.json();
    if(!data.ok) throw new Error(data.error || "Có lỗi từ máy chủ.");
    return data;
  }
  async function postJson(payload){
    const r = await fetch(api, {method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
    return await r.json();
  }
  const labels = {
    email:{label:"Email",type:"email",placeholder:"ten@example.com",required:true},
    phone:{label:"Số điện thoại",type:"tel",placeholder:"09xxxxxxxx",required:false},
    gender:{label:"Giới tính",type:"select",options:["Nam","Nữ"],required:true},
    address:{label:"Địa chỉ",type:"textarea",placeholder:"Bản, xã...",required:true},
    birthDate:{label:"Ngày sinh",type:"text",placeholder:"dd/mm/yyyy",required:true}
  };
  const subjects=["Toán","Tiếng Anh","Vật lí","Hóa học","Sinh học","Lịch sử","Địa lý"];

  function render(student){
    $("studentName").textContent=student.fullName;
    $("studentClass").textContent=`Lớp ${student.className || ""} · Khối ${student.grade || ""}`;
    const done=!!student.completed; const b=$("statusBadge"); b.textContent=done?"Đã hoàn thành":"Chưa hoàn thành"; b.className=`status ${done?"done":"pending"}`;
    const root=$("fields"); root.innerHTML="";
    const missing=student.formFields || student.missingFields || [];
    missing.forEach(key=>{
      const meta=labels[key]; if(!meta) return;
      const wrap=document.createElement("div"); wrap.className="field";
      const label=document.createElement("label"); label.innerHTML=`${meta.label} ${meta.required?'<span class="required-star">*</span>':''}`; wrap.appendChild(label);
      if(meta.type==="select"){
        const el=document.createElement("select"); el.name=key; el.innerHTML='<option value="">Chọn...</option>'+meta.options.map(v=>`<option>${v}</option>`).join(""); wrap.appendChild(el);
      } else if(meta.type==="textarea"){
        const el=document.createElement("textarea"); el.name=key; el.rows=3; el.placeholder=meta.placeholder||""; wrap.appendChild(el);
      } else {
        const el=document.createElement("input"); el.type=meta.type; el.name=key; el.placeholder=meta.placeholder||""; wrap.appendChild(el);
      }
      root.appendChild(wrap);
    });
    const subWrap=document.createElement("div"); subWrap.className="field";
    subWrap.innerHTML='<div class="section-title">Môn học đăng ký</div><p class="hint">Chọn các môn bạn đăng ký. Có thể để trống nếu không yêu cầu.</p>';
    const grid=document.createElement("div"); grid.className="checkbox-grid";
    subjects.forEach((s,i)=>{const key=`subject${i+1}`; const label=document.createElement("label"); label.className="check"; label.innerHTML=`<input type="checkbox" name="${key}" value="x"> <span>${s}</span>`; if(student[key]) label.querySelector("input").checked=true; grid.appendChild(label)});
    subWrap.appendChild(grid); root.appendChild(subWrap);
    $("emptyState").classList.toggle("hidden", missing.length>0);
    $("submitBtn").disabled=false; if(done) $("submitBtn").textContent="CẬP NHẬT THÔNG TIN";
    setView("studentApp");
  }

  $("studentForm").addEventListener("submit", async e=>{
    e.preventDefault();
    $("formMessage").className="form-message"; $("formMessage").textContent=""; $("submitBtn").disabled=true;
    const data=Object.fromEntries(new FormData(e.currentTarget).entries());
    // checkbox values already come through as x; unchecked are absent.
    try{
      const out=await postJson({action:"submitStudent",token,data});
      if(!out.ok) throw new Error(out.error||"Không thể lưu.");
      $("formMessage").className="form-message ok"; $("formMessage").textContent="✓ Đã lưu thành công. Thông tin của bạn đã được cập nhật.";
      const refreshed=await getJson({action:"getStudent",id:token}); render(refreshed.student);
    }catch(err){ $("formMessage").className="form-message error"; $("formMessage").textContent=err.message||"Có lỗi xảy ra."; $("submitBtn").disabled=false; }
  });

  if(!token){ showError("Thiếu mã nhận diện học sinh trong đường dẫn."); return; }
  getJson({action:"getStudent",id:token}).then(r=>render(r.student)).catch(e=>showError(e.message));
})();

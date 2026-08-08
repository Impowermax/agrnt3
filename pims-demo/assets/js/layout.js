/* PIMS Demo 公共布局：侧边栏 + 顶栏 */
const MENUS = [
  { key: "index",      name: "首页工作台", icon: "⌂", url: "index.html" },
  { key: "projects",   name: "项目管理",   icon: "▤", url: "projects.html" },
  { key: "knowledge",  name: "知识库",     icon: "❖", url: "knowledge.html" },
  { key: "problems",   name: "问题库",     icon: "⚠", url: "problems.html" },
  { key: "experiences",name: "经验库",     icon: "✦", url: "experiences.html" },
  { key: "dashboard",  name: "BI 看板",    icon: "📊", url: "dashboard.html" },
  { key: "export",     name: "数据导出",   icon: "⇩", url: "export.html" },
  { key: "admin",      name: "系统管理",   icon: "⚙", url: "admin.html" }
];

function renderLayout(activeKey, crumb) {
  const sb = document.getElementById("sidebar-mount");
  if (sb) {
    sb.outerHTML = `
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">投</div>
        <div>投资项目管理辅助系统<small>PIMS · V1.0 Demo</small></div>
      </div>
      <nav class="menu">
        ${MENUS.map(m => `<a class="menu-item ${m.key === activeKey ? "active" : ""}" href="${m.url}">
          <span class="ico">${m.icon}</span><span>${m.name}</span></a>`).join("")}
      </nav>
      <div class="foot">© 2026 投资项目管理辅助系统<br>需求确认稿 V1.0 · 演示环境</div>
    </aside>`;
  }
  const tb = document.getElementById("topbar-mount");
  if (tb) {
    tb.outerHTML = `
    <header class="topbar">
      <div class="crumb">当前位置：<b>${crumb}</b></div>
      <div class="user">
        <span class="tag">${CURRENT_USER.role}</span>
        <span>${CURRENT_USER.org}</span>
        <span class="avatar">${CURRENT_USER.name[0]}</span>
        <span>${CURRENT_USER.name}</span>
        <a href="login.html" style="color:#86909c">退出</a>
      </div>
    </header>`;
  }
}

/* 通用弹窗 */
function openModal(id) { document.getElementById(id).classList.add("show"); }
function closeModal(id) { document.getElementById(id).classList.remove("show"); }
document.addEventListener("click", e => {
  if (e.target.classList && e.target.classList.contains("modal-mask")) e.target.classList.remove("show");
});

/* 简易提示 */
function toast(msg) {
  let t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = "position:fixed;top:76px;left:50%;transform:translateX(-50%);background:#1f2329;color:#fff;padding:10px 22px;border-radius:8px;font-size:13px;z-index:999;box-shadow:0 6px 20px rgba(0,0,0,.25)";
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transition = ".4s"; }, 1800);
  setTimeout(() => t.remove(), 2300);
}

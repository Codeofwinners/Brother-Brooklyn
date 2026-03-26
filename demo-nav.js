// Sitewide demo navigation bar + modern scrollbar for brobot.academy
// Inject this script into any page: <script src="/demo-nav.js"></script>
(function() {
  // Modern scrollbar (sitewide)
  if (!document.getElementById('modern-scrollbar-css')) {
    const style = document.createElement('style');
    style.id = 'modern-scrollbar-css';
    style.textContent = `
      html { scrollbar-width: thin; scrollbar-color: rgba(45,212,191,0.2) transparent; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(45,212,191,0.2); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(45,212,191,0.4); }
    `;
    document.head.appendChild(style);
  }

  // Don't double-inject
  if (document.getElementById('demo-nav-bar')) return;

  const nav = document.createElement('div');
  nav.id = 'demo-nav-bar';
  nav.innerHTML = `
    <div style="position:fixed;bottom:0;left:0;right:0;z-index:9999;background:rgba(11,17,32,0.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid rgba(45,212,191,0.15);padding:10px 0;font-family:'DM Sans',system-ui,sans-serif;">
      <div style="max-width:1200px;margin:0 auto;padding:0 16px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;">
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
          <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#2DD4BF,#0d9488);display:flex;align-items:center;justify-content:center;">
            <span style="color:#fff;font-weight:800;font-size:14px;line-height:1;">B</span>
          </div>
          <span style="color:#94a3b8;font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap;">Demo Preview</span>
        </div>
        <nav style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
          <a href="/" style="padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;color:#94a3b8;text-decoration:none;white-space:nowrap;transition:all 0.2s;" onmouseover="this.style.background='rgba(45,212,191,0.1)';this.style.color='#2DD4BF'" onmouseout="this.style.background='';this.style.color='#94a3b8'">Home</a>
          <a href="/curriculum-showcase" style="padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;color:#94a3b8;text-decoration:none;white-space:nowrap;transition:all 0.2s;" onmouseover="this.style.background='rgba(45,212,191,0.1)';this.style.color='#2DD4BF'" onmouseout="this.style.background='';this.style.color='#94a3b8'">Curriculum</a>
          <a href="/lessons/prek-week1" style="padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;color:#94a3b8;text-decoration:none;white-space:nowrap;transition:all 0.2s;" onmouseover="this.style.background='rgba(45,212,191,0.1)';this.style.color='#2DD4BF'" onmouseout="this.style.background='';this.style.color='#94a3b8'">PreK Lesson</a>
          <a href="/lessons/3rd-grade-week1-v2" style="padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;color:#94a3b8;text-decoration:none;white-space:nowrap;transition:all 0.2s;" onmouseover="this.style.background='rgba(45,212,191,0.1)';this.style.color='#2DD4BF'" onmouseout="this.style.background='';this.style.color='#94a3b8'">3rd Grade</a>
          <a href="/emotion-map" style="padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;color:#94a3b8;text-decoration:none;white-space:nowrap;transition:all 0.2s;" onmouseover="this.style.background='rgba(45,212,191,0.1)';this.style.color='#2DD4BF'" onmouseout="this.style.background='';this.style.color='#94a3b8'">Emotions</a>
          <a href="/homepage/course-superpower" style="padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;color:#94a3b8;text-decoration:none;white-space:nowrap;transition:all 0.2s;" onmouseover="this.style.background='rgba(45,212,191,0.1)';this.style.color='#2DD4BF'" onmouseout="this.style.background='';this.style.color='#94a3b8'">Course</a>
        </nav>
      </div>
    </div>
  `;
  document.body.appendChild(nav);

  // Add bottom padding to body so content isn't hidden behind the nav
  document.body.style.paddingBottom = '56px';

  // Highlight current page
  const links = nav.querySelectorAll('a');
  const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  links.forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (path === href || (href !== '/' && path.startsWith(href))) {
      link.style.background = 'rgba(45,212,191,0.15)';
      link.style.color = '#2DD4BF';
    }
  });
})();

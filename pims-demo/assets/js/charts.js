/* PIMS Demo 轻量 SVG 图表（无外部依赖） */
const PALETTE = ["#1e6fff", "#00c6ff", "#2ba471", "#e37318", "#722ed1", "#d54941", "#f7b500", "#0594fa", "#13c2c2", "#eb2f96", "#5b8ff9", "#94a3b8"];

/* 环形图 */
function donutChart(el, data, opts = {}) {
  const size = opts.size || 200, r = size / 2, ir = r * 0.62, cx = r, cy = r;
  const total = data.reduce((s, d) => s + d.value, 0);
  let angle = -90, paths = "";
  data.forEach((d, i) => {
    const a2 = angle + (d.value / total) * 360;
    const large = (a2 - angle) > 180 ? 1 : 0;
    const p1 = polar(cx, cy, r, angle), p2 = polar(cx, cy, r, a2);
    const p3 = polar(cx, cy, ir, a2), p4 = polar(cx, cy, ir, angle);
    paths += `<path d="M${p1} A${r},${r} 0 ${large} 1 ${p2} L${p3} A${ir},${ir} 0 ${large} 0 ${p4} Z" fill="${PALETTE[i % PALETTE.length]}"><title>${d.name}：${d.value}</title></path>`;
    angle = a2;
  });
  el.innerHTML = `
    <div class="flex" style="justify-content:center;gap:28px;flex-wrap:wrap">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${paths}
        <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="24" font-weight="700" fill="#1f2329">${total}</text>
        <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="12" fill="#86909c">${opts.centerLabel || "总计"}</text>
      </svg>
      <div>${data.map((d, i) => `
        <div class="flex" style="gap:8px;margin-bottom:9px;font-size:13px">
          <i style="width:10px;height:10px;border-radius:2px;background:${PALETTE[i % PALETTE.length]};display:inline-block"></i>
          <span style="color:#4e5969">${d.name}</span>
          <b style="margin-left:auto">${d.value}</b>
          <span style="color:#86909c;width:52px;text-align:right">${(d.value / total * 100).toFixed(1)}%</span>
        </div>`).join("")}
      </div>
    </div>`;
}
function polar(cx, cy, r, deg) {
  const rad = deg * Math.PI / 180;
  return `${(cx + r * Math.cos(rad)).toFixed(2)},${(cy + r * Math.sin(rad)).toFixed(2)}`;
}

/* 横向条形图 */
function hbarChart(el, data, opts = {}) {
  const max = Math.max(...data.map(d => d.value), 1);
  el.innerHTML = data.map((d, i) => `
    <div style="display:grid;grid-template-columns:${opts.labelW || 110}px 1fr ${opts.valW || 60}px;gap:10px;align-items:center;margin-bottom:12px;font-size:13px">
      <span style="color:#4e5969;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${d.name}">${d.name}</span>
      <div style="background:#edf1f7;border-radius:4px;height:16px;overflow:hidden">
        <div style="width:${(d.value / max * 100).toFixed(1)}%;height:100%;border-radius:4px;background:${opts.color || `linear-gradient(90deg,${PALETTE[i % PALETTE.length]},${PALETTE[i % PALETTE.length]}cc)`};transition:width .6s"></div>
      </div>
      <b style="font-variant-numeric:tabular-nums">${d.value}${opts.unit || ""}</b>
    </div>`).join("");
}

/* 纵向柱状图 */
function vbarChart(el, data, opts = {}) {
  const h = opts.height || 220, max = Math.max(...data.map(d => d.value), 1);
  const bw = Math.min(46, 100 / data.length * 0.5);
  el.innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:${Math.max(6, 40 - data.length * 2)}px;height:${h}px;padding:0 6px;border-bottom:1px solid #e5e9f2">
      ${data.map((d, i) => `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%" title="${d.name}：${d.value}">
          <span style="font-size:12px;font-weight:600;margin-bottom:4px">${d.value}</span>
          <div style="width:${bw}%;min-width:18px;height:${(d.value / max * 82).toFixed(1)}%;border-radius:5px 5px 0 0;background:linear-gradient(180deg,${PALETTE[i % PALETTE.length]},${PALETTE[i % PALETTE.length]}99)"></div>
        </div>`).join("")}
    </div>
    <div style="display:flex;gap:${Math.max(6, 40 - data.length * 2)}px;padding:8px 6px 0">
      ${data.map(d => `<div style="flex:1;text-align:center;font-size:11.5px;color:#86909c;line-height:1.4;word-break:break-all">${d.name}</div>`).join("")}
    </div>`;
}

/* 分组柱状图（计划/概算/实际） */
function groupBarChart(el, cats, series, opts = {}) {
  const h = opts.height || 220;
  const max = Math.max(...series.flatMap(s => s.data), 1);
  el.innerHTML = `
    <div style="display:flex;align-items:flex-end;height:${h}px;padding:0 4px;border-bottom:1px solid #e5e9f2">
      ${cats.map((c, ci) => `
        <div style="flex:1;display:flex;align-items:flex-end;justify-content:center;gap:6px;height:100%">
          ${series.map((s, si) => `
            <div style="width:22%;min-width:14px;max-width:34px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%" title="${c} · ${s.name}：${s.data[ci]}">
              <span style="font-size:11px;font-weight:600;margin-bottom:3px">${s.data[ci]}</span>
              <div style="width:100%;height:${(s.data[ci] / max * 82).toFixed(1)}%;border-radius:4px 4px 0 0;background:${s.color}"></div>
            </div>`).join("")}
        </div>`).join("")}
    </div>
    <div style="display:flex;padding:8px 4px 0">${cats.map(c => `<div style="flex:1;text-align:center;font-size:12px;color:#86909c">${c}</div>`).join("")}</div>
    <div class="legend" style="justify-content:center">${series.map(s => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join("")}</div>`;
}

/* 折线图 */
function lineChart(el, data, opts = {}) {
  const w = 560, h = opts.height || 220, pad = { l: 36, r: 16, t: 16, b: 30 };
  const max = Math.max(...data.map(d => d.value), 1) * 1.15;
  const xs = i => pad.l + (w - pad.l - pad.r) * (data.length === 1 ? 0.5 : i / (data.length - 1));
  const ys = v => h - pad.b - (h - pad.t - pad.b) * v / max;
  const pts = data.map((d, i) => `${xs(i).toFixed(1)},${ys(d.value).toFixed(1)}`).join(" ");
  const grid = [0.25, 0.5, 0.75, 1].map(f => {
    const y = ys(max * f);
    return `<line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" stroke="#eef1f6"/><text x="${pad.l - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="#b0b8c6">${Math.round(max * f)}</text>`;
  }).join("");
  el.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto">
      ${grid}
      <polyline points="${pts}" fill="none" stroke="#1e6fff" stroke-width="2.5" stroke-linejoin="round"/>
      ${data.map((d, i) => `
        <circle cx="${xs(i)}" cy="${ys(d.value)}" r="4" fill="#fff" stroke="#1e6fff" stroke-width="2.5"><title>${d.name}：${d.value}</title></circle>
        <text x="${xs(i)}" y="${ys(d.value) - 9}" text-anchor="middle" font-size="11" font-weight="600" fill="#1f2329">${d.value}</text>
        <text x="${xs(i)}" y="${h - 8}" text-anchor="middle" font-size="10.5" fill="#86909c">${d.name}</text>`).join("")}
    </svg>`;
}

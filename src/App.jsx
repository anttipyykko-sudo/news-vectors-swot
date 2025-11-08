import { useState } from "react";

const mockData = (company) => [
  { title: `${company} Q3: Kasvua 12 %`, description: "Vahva tulos kaikilla segmenteillä.", publishedAt: "2025-11-07" },
  { title: `${company} varoitus: USA-markkina heikkenee`, description: "Ohjeistus laskettu 8 %.", publishedAt: "2025-11-06" },
  { title: `${company} solmi $2 mrd kumppanuuden`, description: "Strateginen AI-diili Nvidian kanssa.", publishedAt: "2025-11-05" },
  { title: `${company} lanseeraa 6G-pilotin`, description: "Ensimmäinen Euroopassa.", publishedAt: "2025-11-04" },
  { title: `${company} investoi $1.5 mrd datakeskuksiin`, description: "Laajennus Aasiaan.", publishedAt: "2025-11-03" },
];

export default function App() {
  const [company, setCompany] = useState("Nokia Oyj");
  const [news, setNews] = useState([]);
  const [vectors, setVectors] = useState([]);
  const [swot, setSwot] = useState({ mv: "", mh: "", uv: "", uh: "" });

  const fetchNews = async () => {
    if (!company) return alert("Syötä yritys!");
    // Mock-dataa (voit lisätä NewsAPI myöhemmin)
    const data = mockData(company);
    setNews(data);
  };

  const analyze = () => {
    if (news.length === 0) return alert("Hae ensin uutiset!");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 600, 400);

    // Akselit
    ctx.strokeStyle = "#34495e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 200); ctx.lineTo(550, 200);
    ctx.moveTo(300, 50); ctx.lineTo(300, 350);
    ctx.stroke();
    ctx.fillText("Vaikutus (-5 … +5)", 200, 390);
    ctx.fillText("Tyyppi (-5 … +5)", 10, 200);

    const posWords = ["kasvu", "surge", "kumppanuus", "sopimus", "sijoittaa", "vahva", "boost"];
    const negWords = ["varoitus", "laskettu", "paineet", "vaikutus", "miss", "alennettu"];
    const stratWords = ["osake", "sijoitus", "kumppanuus", "diili", "laajennus"];
    const operWords = ["myynti", "verkot", "tulot", "q3", "liikevaihto"];

    const vecs = news.map((n, i) => {
      const text = (n.title + " " + (n.description || "")).toLowerCase();
      let x = 0, y = 0;
      posWords.forEach(w => text.includes(w) && (x += 1));
      negWords.forEach(w => text.includes(w) && (x -= 1));
      stratWords.forEach(w => text.includes(w) && (y += 1));
      operWords.forEach(w => text.includes(w) && (y -= 1));
      x = Math.max(-5, Math.min(5, x * 1.2));
      y = Math.max(-5, Math.min(5, y * 1.2));
      const len = Math.min(10, Math.abs(x) + Math.abs(y) + 3);

      // Piirrä vektori
      const endX = 300 + x * 20;
      const endY = 200 - y * 20;
      ctx.strokeStyle = `hsl(${i * 72}, 70%, 50%)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(300, 200);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = "12px Arial";
      ctx.fillText(`${n.title.slice(0, 20)}... (${len.toFixed(1)})`, endX + 5, endY - 5);

      return { x, y, len, title: n.title };
    });

    // SWOT
    const s = { mv: "", mh: "", uv: "", uh: "" };
    vecs.forEach(v => {
      if (v.x > 0 && v.y > 0) s.mv += `${v.title.slice(0, 30)}...\n`;
      if (v.x < 0 && v.y > 0) s.mh += `${v.title.slice(0, 30)}...\n`;
      if (v.x > 0 && v.y < 0) s.uv += `${v.title.slice(0, 30)}...\n`;
      if (v.x < 0 && v.y < 0) s.uh += `${v.title.slice(0, 30)}...\n`;
    });
    setSwot({ mv: s.mv || "Ei vaikutusta", mh: s.mh || "Ei vaikutusta", uv: s.uv || "Ei vaikutusta", uh: s.uh || "Ei vaikutusta" });
    setVectors(vecs);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to br, #f0f9ff, #e0f2fe)", padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "2.5em", color: "#1e40af", marginBottom: "30px" }}>Uutisvektorit & SWOT Analyysi</h1>

        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Yritys (esim. Nokia Oyj)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "16px" }}
            />
            <div>
              <button onClick={fetchNews} style={{ background: "#3b82f6", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", marginRight: "10px", cursor: "pointer" }}>
                Hae Uutiset
              </button>
              <button onClick={analyze} style={{ background: "#10b981", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Analysoi & Piirrä
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>Uutiset</h3>
              <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #d1d5db", borderRadius: "6px", padding: "10px", background: "#f9fafb" }}>
                {news.map((n, i) => (
                  <div key={i} style={{ marginBottom: "10px", padding: "10px", background: "white", borderRadius: "6px", borderLeft: "4px solid #3b82f6" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{n.title}</div>
                    <div style={{ fontSize: "14px", color: "#6b7280" }}>{n.description}</div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>{n.publishedAt}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>Vektorit (X: Vaikutus, Y: Tyyppi)</h3>
              <canvas id="canvas" width="600" height="400" style={{ border: "1px solid #d1d5db", borderRadius: "6px", background: "white", display: "block" }}></canvas>
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: "10px", color: "#1e40af" }}>Vaikutus SWOT:hen</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div style={{ background: "#dcfce7", padding: "15px", borderRadius: "8px", border: "2px solid #22c55e" }}>
            <h4 style={{ fontWeight: "bold", color: "#166534", marginBottom: "10px" }}>MAHDOLLISUUDET + VAHVUUDET</h4>
            <textarea style={{ width: "100%", height: "120px", border: "none", background: "transparent", resize: "none", fontSize: "14px" }} readOnly value={swot.mv} />
          </div>
          <div style={{ background: "#fef3c7", padding: "15px", borderRadius: "8px", border: "2px solid #ea580c" }}>
            <h4 style={{ fontWeight: "bold", color: "#92400e", marginBottom: "10px" }}>MAHDOLLISUUDET + HEIKKOUDET</h4>
            <textarea style={{ width: "100%", height: "120px", border: "none", background: "transparent", resize: "none", fontSize: "14px" }} readOnly value={swot.mh} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div style={{ background: "#dbeafe", padding: "15px", borderRadius: "8px", border: "2px solid #2563eb" }}>
            <h4 style={{ fontWeight: "bold", color: "#1e40af", marginBottom: "10px" }}>UHAT + VAHVUUDET</h4>
            <textarea style={{ width: "100%", height: "120px", border: "none", background: "transparent", resize: "none", fontSize: "14px" }} readOnly value={swot.uv} />
          </div>
          <div style={{ background: "#fee2e2", padding: "15px", borderRadius: "8px", border: "2px solid #dc2626" }}>
            <h4 style={{ fontWeight: "bold", color: "#991b1b", marginBottom: "10px" }}>UHAT + HEIKKOUDET</h4>
            <textarea style={{ width: "100%", height: "120px", border: "none", background: "transparent", resize: "none", fontSize: "14px" }} readOnly value={swot.uh} />
          </div>
        </div>
      </div>
    </div>
  );
}

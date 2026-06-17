const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
`            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">{target.name}</h3>
                <div className="text-sm text-slate-500 mt-1">
                  {target.relation || "관계 미입력"} · 들것지기 {target.stretcherGroup || "미지정"} · 전도인 {target.evangelistName || target.ownerName}
                </div>
                {target.phone && (
                  <div className="text-xs text-slate-400 mt-1">
                    연락처 {target.phone}
                  </div>
                )}
              </div>
              <Pill>{statusEmoji[target.status]} {target.status}</Pill>
            </div>`,
`            <div className="space-y-2">
              <div>
                <h3 className="text-xl font-black text-slate-900">{target.name}</h3>
                <div className="text-sm text-slate-500 mt-1">
                  {target.relation || "관계 미입력"} · 들것지기 {target.stretcherGroup || "미지정"} · 전도인 {target.evangelistName || target.ownerName}
                </div>
                {target.phone && (
                  <div className="text-xs text-slate-400 mt-1">
                    연락처 {target.phone}
                  </div>
                )}
              </div>

              <div>
                <Pill>{statusEmoji[target.status]} {target.status}</Pill>
              </div>
            </div>`
);

fs.writeFileSync(file, s, "utf8");

console.log("상태 배지 위치 수정 완료");
console.log("space-y-2 적용:", s.includes('className="space-y-2"'));
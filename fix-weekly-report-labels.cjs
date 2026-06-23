const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
`        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input type="number" value={contactCount} onChange={(e) => setContactCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="접촉인원" />
          <input type="number" value={mealCount} onChange={(e) => setMealCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="식사/만남" />
          <input type="number" value={giftCount} onChange={(e) => setGiftCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="선물전달" />
          <input type="number" value={inviteCount} onChange={(e) => setInviteCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="초대장전달" />
          <input type="number" value={expectedCount} onChange={(e) => setExpectedCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="참석예상" />
        </div>`,
`        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">👥 접촉인원</div>
            <input type="number" value={contactCount} onChange={(e) => setContactCount(e.target.value)} className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none" placeholder="0" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">🍚 식사/만남</div>
            <input type="number" value={mealCount} onChange={(e) => setMealCount(e.target.value)} className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none" placeholder="0" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">🎁 선물전달</div>
            <input type="number" value={giftCount} onChange={(e) => setGiftCount(e.target.value)} className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none" placeholder="0" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">✉️ 초대장전달</div>
            <input type="number" value={inviteCount} onChange={(e) => setInviteCount(e.target.value)} className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none" placeholder="0" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">🙏 참석예상</div>
            <input type="number" value={expectedCount} onChange={(e) => setExpectedCount(e.target.value)} className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none" placeholder="0" />
          </div>
        </div>`
);

fs.writeFileSync(file, s, "utf8");

console.log("주간 활동보고 항목명 복구 완료");
console.log("접촉인원 라벨 있음:", s.includes("👥 접촉인원"));
console.log("초대장전달 라벨 있음:", s.includes("✉️ 초대장전달"));
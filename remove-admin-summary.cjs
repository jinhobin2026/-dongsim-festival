const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
`      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={Users} label="접촉"`,
`/* ADMIN SUMMARY REMOVED */
      {/*`
);

s = s.replace(
`        <StatCard icon={CalendarDays} label="참석예상" value={reports.reduce((a, r) => a + (r.expectedCount || 0), 0)} />
      </div>`,
`        <StatCard icon={CalendarDays} label="참석예상" value={reports.reduce((a, r) => a + (r.expectedCount || 0), 0)} />
      </div>
      */}`
);

fs.writeFileSync(file, s, "utf8");

console.log("목사님용 상단 요약 카드 제거 완료");
const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* 1. ReportsView 안의 접촉/식사/선물/초대장/참석예상 요약 카드 제거 */
s = s.replace(
  /      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">\s*<StatCard icon=\{Users\} label="접촉"[\s\S]*?<StatCard icon=\{CalendarDays\} label="참석예상" value=\{total\.expected\} \/>\s*<\/div>\s*/g,
  ""
);

/* 2. AdminView에서 ReportsView를 먼저 제거 */
const reportsViewCode = `      <ReportsView user={{ role: "admin" }} reports={reports} setReports={setReports} />`;

s = s.replace(reportsViewCode, "");

/* 3. 초청 대상자 현황 Card 뒤에 ReportsView를 다시 삽입 */
s = s.replace(
  /      <Card className="rounded-3xl border-0 shadow-sm">\s*<CardContent className="p-5">([\s\S]*?)<h3 className="text-lg font-black">초청 대상자 현황<\/h3>([\s\S]*?)<\/CardContent>\s*<\/Card>\s*<\/div>\s*\);\s*\}/,
  (match) => {
    return match.replace(
      `      </CardContent>
      </Card>
    </div>
  );
}`,
      `      </CardContent>
      </Card>

      <ReportsView user={{ role: "admin" }} reports={reports} setReports={setReports} />
    </div>
  );
}`
    );
  }
);

fs.writeFileSync(file, s, "utf8");

console.log("목사님용 화면 구성 정리 완료");
console.log("ReportsView 위치 확인:", s.includes('<ReportsView user={{ role: "admin" }} reports={reports} setReports={setReports} />'));
console.log("접촉 요약 카드 제거:", !s.includes('label="접촉" value={total.contact}'));
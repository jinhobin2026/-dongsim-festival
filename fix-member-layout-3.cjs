const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

const start = s.indexOf("      <WeeklyReportForm");
const endMarker = "      </div>\n    </div>\n  );\n}\n\nfunction WeeklyReportForm";
const end = s.indexOf(endMarker, start);

if (start === -1 || end === -1) {
  console.log("MemberView 위치 변경 구간을 찾지 못했습니다.");
  console.log("start:", start, "end:", end);
  process.exit(1);
}

const newBlock = `      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {myTargets.map((target) => (
          <TargetCard
            key={target.id}
            target={target}
            onUpdate={onUpdate}
            onInvite={onInvite}
            onDelete={onDelete}
          />
        ))}
      </div>

      <TargetForm
        onAdd={onAdd}
        currentUser={{ ...user, stretcherGroup: selectedGroup }}
        selectedGroup={selectedGroup}
      />

      <WeeklyReportForm
        user={{ ...user, stretcherGroup: selectedGroup }}
        reports={reports}
        setReports={setReports}
      />

      <PastorFeedbackList
        user={{ ...user, stretcherGroup: selectedGroup }}
        reports={reports}
      />
`;

s = s.slice(0, start) + newBlock + s.slice(end);

s = s.replaceAll("들것지기 조별 대상자 보기", "조별 전도대상자");

s = s.replaceAll(
  "현재 {selectedGroup}에 등록된 전도 대상자만 표시됩니다.",
  "{selectedGroup}에 등록된 전도 대상자를 확인하고 관리합니다."
);

fs.writeFileSync(file, s, "utf8");

console.log("조장용 위치 변경 3차 완료");
console.log("조별 전도대상자 있음:", s.includes("조별 전도대상자"));
console.log("TargetCard가 WeeklyReportForm보다 앞:", s.indexOf("<TargetCard") < s.indexOf("<WeeklyReportForm"));
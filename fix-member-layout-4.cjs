const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

const start = s.indexOf("function MemberView(");
const end = s.indexOf("function WeeklyReportForm", start);

if (start === -1 || end === -1) {
  console.log("MemberView 함수 위치를 찾지 못했습니다.");
  console.log("start:", start, "end:", end);
  process.exit(1);
}

const newMemberView = `function MemberView({ user, targets, setTargets, onInvite, reports, setReports }) {
  const selectedGroup = user.stretcherGroup || "1조";
  const myTargets = targets.filter((t) => t.stretcherGroup === selectedGroup);

  const onAdd = () => {};

  const onUpdate = async (id, patch) => {
    await updateDoc(doc(db, "targets", String(id)), patch);
  };

  const onDelete = async (target) => {
    await deleteDoc(doc(db, "targets", String(target.id)));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard icon={Users} label={\`\${selectedGroup} 대상자\`} value={myTargets.length} />
        <StatCard icon={Gift} label="1차 선물" value={myTargets.filter((t) => (t.gifts || [])[0]).length} />
        <StatCard icon={Gift} label="2차 선물" value={myTargets.filter((t) => (t.gifts || [])[1]).length} />
        <StatCard icon={Gift} label="3차 선물" value={myTargets.filter((t) => (t.gifts || [])[2]).length} />
        <StatCard icon={Mail} label="초대장" value={myTargets.filter((t) => t.invited).length} />
        <StatCard icon={CalendarDays} label="참석 예정" value={myTargets.filter((t) => t.attending === "참석예정").length} />
      </div>

      <div className="rounded-3xl bg-white/90 shadow-sm p-5 space-y-3">
        <div className="font-black text-lg">조별 전도대상자</div>
        <div className="h-12 rounded-2xl bg-orange-50 px-4 flex items-center text-sm text-orange-700 font-bold">
          {selectedGroup}에 등록된 전도 대상자를 확인하고 관리합니다.
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
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
    </div>
  );
}

`;

s = s.slice(0, start) + newMemberView + s.slice(end);

fs.writeFileSync(file, s, "utf8");

console.log("조장용 MemberView 전체 재정렬 완료");
console.log("조별 전도대상자 있음:", s.includes("조별 전도대상자"));
console.log("TargetCard가 WeeklyReportForm보다 앞:", s.indexOf("<TargetCard") < s.indexOf("<WeeklyReportForm"));
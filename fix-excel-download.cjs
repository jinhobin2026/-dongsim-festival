const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* 1. AdminView 안에 CSV 다운로드 함수 추가 */
s = s.replace(
`  const byDept = useMemo(() => {`,
`  const downloadTargetsCsv = () => {
    const headers = [
      "들것지기 조",
      "전도인",
      "대상자 이름",
      "관계",
      "연락처",
      "상태",
      "1차 선물",
      "2차 선물",
      "3차 선물",
      "초대장",
      "참석 여부",
      "최근 접촉일",
      "메모",
    ];

    const escapeCsv = (value) => {
      const text = String(value ?? "");
      return \`"\${text.replace(/"/g, '""')}"\`;
    };

    const rows = adminVisibleTargets.map((target) => [
      target.stretcherGroup || "",
      target.evangelistName || target.ownerName || "",
      target.name || "",
      target.relation || "",
      target.phone || "",
      target.status || "",
      (target.gifts || [])[0] ? "완료" : "예정",
      (target.gifts || [])[1] ? "완료" : "예정",
      (target.gifts || [])[2] ? "완료" : "예정",
      target.invited ? "발송" : "미발송",
      target.attending || "",
      target.lastContact || "",
      target.memo || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\\n");

    const bom = "\\uFEFF";
    const blob = new Blob([bom + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const groupName = selectedTargetGroup === "전체" ? "전체" : selectedTargetGroup;

    link.href = url;
    link.download = \`동심교회_새생명축제_초청대상자_\${groupName}.csv\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const byDept = useMemo(() => {`
);

/* 2. 초청 대상자 현황 제목 옆에 다운로드 버튼 추가 */
s = s.replace(
`            <Pill>{selectedTargetGroup} {adminVisibleTargets.length}명</Pill>
          </div>`,
`            <div className="flex items-center gap-2">
              <Pill>{selectedTargetGroup} {adminVisibleTargets.length}명</Pill>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={downloadTargetsCsv}
              >
                엑셀 다운로드
              </Button>
            </div>
          </div>`
);

fs.writeFileSync(file, s, "utf8");

console.log("초청대상자 엑셀 다운로드 기능 추가 완료");
console.log("downloadTargetsCsv 있음:", s.includes("downloadTargetsCsv"));
console.log("엑셀 다운로드 버튼 있음:", s.includes("엑셀 다운로드"));
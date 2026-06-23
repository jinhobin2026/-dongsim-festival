const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* 1. WeeklyReportForm 카드에 이동용 id 추가 */
s = s.replace(
  `<Card className="rounded-3xl border-0 shadow-sm">`,
  `<Card id="weekly-report-form" className="rounded-3xl border-0 shadow-sm">`
);

/* 2. 수정 버튼 클릭 시 맨 위가 아니라 주간활동보고 폼으로 이동 */
s = s.replace(
  `window.scrollTo({ top: 0, behavior: "smooth" });`,
  `setTimeout(() => {
      document.getElementById("weekly-report-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);`
);

/* 3. 제출한 보고서의 수정/삭제 버튼 디자인 강화 */
s = s.replace(
  `<Button type="button" variant="outline" className="rounded-2xl" onClick={() => editReport(report)}>수정</Button>
                  <Button type="button" variant="outline" className="rounded-2xl" onClick={() => deleteReport(report)}>삭제</Button>`,
  `<Button
                    type="button"
                    className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm px-4"
                    onClick={() => editReport(report)}
                  >
                    수정
                  </Button>
                  <Button
                    type="button"
                    className="rounded-2xl bg-white border border-red-200 text-red-600 hover:bg-red-50 shadow-sm px-4"
                    onClick={() => deleteReport(report)}
                  >
                    삭제
                  </Button>`
);

/* 4. 모바일에서 버튼이 눌러보기 쉽게 간격 보강 */
s = s.replace(
  `<div className="flex gap-2">
                  <Button`,
  `<div className="flex gap-2 shrink-0">
                  <Button`
);

fs.writeFileSync(file, s, "utf8");

console.log("주간활동보고 버튼/이동 위치 수정 완료");
console.log("weekly-report-form 있음:", s.includes('id="weekly-report-form"'));
console.log("scrollIntoView 있음:", s.includes("scrollIntoView"));
console.log("수정 버튼 색상 있음:", s.includes("bg-orange-500 hover:bg-orange-600 text-white"));
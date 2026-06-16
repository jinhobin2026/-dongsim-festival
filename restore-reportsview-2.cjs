const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

const insert = `
      <ReportsView user={{ role: "admin" }} reports={reports} setReports={setReports} />
`;

if (!s.includes('<ReportsView user={{ role: "admin" }} reports={reports} setReports={setReports} />')) {
  s = s.replace(
    /\n\s*<\/div>\s*\);\s*\}\s*\n\s*function ScheduleCard\(\)/,
    `
${insert}
    </div>
  );
}

function ScheduleCard()`
  );
}

fs.writeFileSync(file, s, "utf8");

console.log("ReportsView 복구 완료");
console.log("ReportsView 있음:", s.includes('<ReportsView user={{ role: "admin" }} reports={reports} setReports={setReports} />'));
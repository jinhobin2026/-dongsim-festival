const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

const reportsView = `

      <ReportsView user={{ role: "admin" }} reports={reports} setReports={setReports} />`;

if (!s.includes(`<ReportsView user={{ role: "admin" }} reports={reports} setReports={setReports} />`)) {
  const lastCardEnd = s.lastIndexOf(`      </Card>
    </div>
  );
}`);

  if (lastCardEnd !== -1) {
    s =
      s.slice(0, lastCardEnd + `      </Card>`.length) +
      reportsView +
      s.slice(lastCardEnd + `      </Card>`.length);
  }
}

fs.writeFileSync(file, s, "utf8");

console.log("주차별 활동보고 복구 완료");
console.log("ReportsView 있음:", s.includes("ReportsView user"));
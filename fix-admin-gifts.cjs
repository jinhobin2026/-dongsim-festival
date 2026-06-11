const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  /if \(!map\[group\]\) map\[group\] = \{ dept: group, total: 0, invited: 0, attending: 0, gifts: 0 \};[\s\S]*?map\[group\]\.gifts \+= \(t\.gifts \|\| \[\]\)\.filter\(Boolean\)\.length;/,
  `if (!map[group]) {
        map[group] = {
          dept: group,
          total: 0,
          invited: 0,
          attending: 0,
          gift1: 0,
          gift2: 0,
          gift3: 0,
        };
      }

      map[group].total += 1;
      if (t.invited) map[group].invited += 1;
      if (t.attending === "참석예정" || t.attending === "행사참석") map[group].attending += 1;
      if ((t.gifts || [])[0]) map[group].gift1 += 1;
      if ((t.gifts || [])[1]) map[group].gift2 += 1;
      if ((t.gifts || [])[2]) map[group].gift3 += 1;`
);

s = s.replace(
  /<StatCard icon=\{Gift\} label="선물 전달" value=\{targets\.reduce\(\(a, t\) => a \+ \(t\.gifts \|\| \[\]\)\.filter\(Boolean\)\.length, 0\)\} \/>/,
  `<StatCard icon={Gift} label="1차 선물" value={targets.filter((t) => (t.gifts || [])[0]).length} />
        <StatCard icon={Gift} label="2차 선물" value={targets.filter((t) => (t.gifts || [])[1]).length} />
        <StatCard icon={Gift} label="3차 선물" value={targets.filter((t) => (t.gifts || [])[2]).length} />`
);

s = s.replace(
  /<div className="grid grid-cols-2 md:grid-cols-5 gap-3">\s*<StatCard icon=\{Users\} label="전체 대상자"/,
  `<div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        <StatCard icon={Users} label="전체 대상자"`
);

s = s.replace(
  /<th className="py-3">들것지기 조<\/th><th>대상자<\/th><th>선물전달<\/th><th>초대장<\/th><th>참석예정\/참석<\/th>/,
  `<th className="py-3">들것지기 조</th>
                  <th>대상자</th>
                  <th>1차 선물</th>
                  <th>2차 선물</th>
                  <th>3차 선물</th>
                  <th>초대장</th>
                  <th>참석예정/참석</th>`
);

s = s.replace(
  /<td className="py-4 font-bold">\{d\.dept\}<\/td><td>\{d\.total\}<\/td><td>\{d\.gifts\}<\/td><td>\{d\.invited\}<\/td><td>\{d\.attending\}<\/td>/,
  `<td className="py-4 font-bold">{d.dept}</td>
                    <td>{d.total}</td>
                    <td>{d.gift1}</td>
                    <td>{d.gift2}</td>
                    <td>{d.gift3}</td>
                    <td>{d.invited}</td>
                    <td>{d.attending}</td>`
);

fs.writeFileSync(file, s, "utf8");

console.log("목사님용 선물 통계 분리 수정 완료");
console.log("1차 선물 있음:", s.includes('label="1차 선물"'));
console.log("gift1 있음:", s.includes("gift1"));
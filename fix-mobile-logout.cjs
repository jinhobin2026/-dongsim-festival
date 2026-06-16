const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  `{mobileMenu && <div className="md:hidden px-4 pb-4 grid grid-cols-2 gap-2 bg-white">{menu.map((m) => <Button key={m.id} variant={tab === m.id ? "default" : "outline"} className="rounded-2xl" onClick={() => { setTab(m.id); setMobileMenu(false); }}>{m.label}</Button>)}</div>}`,
  `{mobileMenu && (
          <div className="md:hidden px-4 pb-4 grid grid-cols-2 gap-2 bg-white">
            {menu.map((m) => (
              <Button
                key={m.id}
                variant={tab === m.id ? "default" : "outline"}
                className="rounded-2xl"
                onClick={() => {
                  setTab(m.id);
                  setMobileMenu(false);
                }}
              >
                {m.label}
              </Button>
            ))}

            <Button
              variant="outline"
              className="col-span-2 rounded-2xl"
              onClick={() => {
                setUser(null);
                setMobileMenu(false);
              }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              나가기
            </Button>
          </div>
        )}`
);

fs.writeFileSync(file, s, "utf8");

console.log("모바일 나가기 버튼 추가 완료");
console.log("모바일 나가기 포함:", s.includes("col-span-2 rounded-2xl"));
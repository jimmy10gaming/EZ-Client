(function() {
    // --- Mod State ---
    let mods = {
        keystrokes: {
            name: "Keystrokes Overlay",
            enabled: false
        },
        cps: {
            name: "CPS Overlay",
            enabled: false
        }
    };

    // --- Keystrokes Overlay ---
    const KEYS = [
        { name: "W", code: "KeyW" },
        { name: "A", code: "KeyA" },
        { name: "S", code: "KeyS" },
        { name: "D", code: "KeyD" },
        { name: "Space", code: "Space" }
    ];
    const OVERLAY_POS = { x: 30, y: 30 };
    const BOX_SIZE = 40;
    const BOX_MARGIN = 6;
    let keyState = {};
    for (const k of KEYS) keyState[k.code] = false;

    let keystrokesOverlay = document.createElement("div");
    keystrokesOverlay.id = "keystrokes-overlay";
    keystrokesOverlay.style.position = "fixed";
    keystrokesOverlay.style.left = OVERLAY_POS.x + "px";
    keystrokesOverlay.style.top = OVERLAY_POS.y + "px";
    keystrokesOverlay.style.zIndex = 99999;
    keystrokesOverlay.style.pointerEvents = "none";
    document.body.appendChild(keystrokesOverlay);

    function drawKeystrokesOverlay() {
        if (!mods.keystrokes.enabled) {
            keystrokesOverlay.style.display = "none";
            return;
        }
        keystrokesOverlay.style.display = "block";
        keystrokesOverlay.innerHTML = "";
        // [W]
        // [A][S][D]
        //    [Space]
        let boxW = makeKeyBox(KEYS[0], 1, 0);
        keystrokesOverlay.appendChild(boxW);
        for (let i = 1; i <= 3; ++i) {
            let box = makeKeyBox(KEYS[i], i-1, 1);
            keystrokesOverlay.appendChild(box);
        }
        let boxSpace = makeKeyBox(KEYS[4], 1, 2, true);
        keystrokesOverlay.appendChild(boxSpace);
    }
    function makeKeyBox(key, col, row, wide) {
        let box = document.createElement("div");
        box.textContent = key.name;
        box.style.position = "absolute";
        box.style.left = (col * (BOX_SIZE + BOX_MARGIN)) + "px";
        box.style.top = (row * (BOX_SIZE + BOX_MARGIN)) + "px";
        box.style.width = (wide ? BOX_SIZE*3 + BOX_MARGIN*2 : BOX_SIZE) + "px";
        box.style.height = BOX_SIZE + "px";
        box.style.lineHeight = BOX_SIZE + "px";
        box.style.textAlign = "center";
        box.style.fontWeight = "bold";
        box.style.background = keyState[key.code] ? "#00FF88" : "#222";
        box.style.color = keyState[key.code] ? "#111" : "#eee";
        box.style.border = "2px solid #444";
        box.style.borderRadius = "10px";
        box.style.transition = "background 0.1s, color 0.1s";
        box.style.fontSize = "20px";
        box.style.userSelect = "none";
        box.style.boxShadow = keyState[key.code] ? "0 0 8px #00FF88" : "none";
        return box;
    }

    // --- CPS Overlay ---
    const CPS_OVERLAY_POS = { x: 30, y: 120 };
    const BOX_WIDTH = 120;
    const BOX_HEIGHT = 40;
    let clicks = [];
    let lastCps = 0;

    let cpsOverlay = document.createElement("div");
    cpsOverlay.id = "cps-overlay";
    cpsOverlay.style.position = "fixed";
    cpsOverlay.style.left = CPS_OVERLAY_POS.x + "px";
    cpsOverlay.style.top = CPS_OVERLAY_POS.y + "px";
    cpsOverlay.style.zIndex = 99999;
    cpsOverlay.style.pointerEvents = "none";
    cpsOverlay.style.width = BOX_WIDTH + "px";
    cpsOverlay.style.height = BOX_HEIGHT + "px";
    cpsOverlay.style.display = "none";
    cpsOverlay.style.background = "rgba(34,34,34,0.85)";
    cpsOverlay.style.color = "#00FF88";
    cpsOverlay.style.fontWeight = "bold";
    cpsOverlay.style.fontSize = "26px";
    cpsOverlay.style.textAlign = "center";
    cpsOverlay.style.lineHeight = BOX_HEIGHT + "px";
    cpsOverlay.style.borderRadius = "12px";
    cpsOverlay.style.boxShadow = "0 0 8px #00FF88";
    document.body.appendChild(cpsOverlay);

    function updateCpsOverlay() {
        if (!mods.cps.enabled) {
            cpsOverlay.style.display = "none";
            return;
        }
        cpsOverlay.style.display = "block";
        cpsOverlay.textContent = "CPS: " + lastCps;
    }

    function calcCPS() {
        const now = Date.now();
        clicks = clicks.filter(ts => now - ts < 1000);
        lastCps = clicks.length;
        updateCpsOverlay();
    }

    setInterval(function() {
        if (!mods.cps.enabled) return;
        calcCPS();
    }, 100);

    // --- Mod Manager Overlay ---
    let managerOverlay = document.createElement("div");
    managerOverlay.id = "mod-manager-overlay";
    managerOverlay.style.position = "fixed";
    managerOverlay.style.right = "30px";
    managerOverlay.style.top = "30px";
    managerOverlay.style.background = "rgba(28,28,28,0.98)";
    managerOverlay.style.border = "2px solid #00FF88";
    managerOverlay.style.borderRadius = "15px";
    managerOverlay.style.boxShadow = "0 0 24px #00FF88";
    managerOverlay.style.padding = "22px 30px 20px 30px";
    managerOverlay.style.zIndex = 100000;
    managerOverlay.style.color = "#fff";
    managerOverlay.style.fontFamily = "sans-serif";
    managerOverlay.style.fontSize = "18px";
    managerOverlay.style.display = "none";
    managerOverlay.style.minWidth = "220px";
    managerOverlay.innerHTML = "<b>Eaglercraft Mod Manager</b><br><br>";
    document.body.appendChild(managerOverlay);

    function updateManagerOverlay() {
        if (managerOverlay.style.display === "none") return;
        let html = "<b>Eaglercraft Mod Manager</b><br><br>";
        html += "<table style='width:100%;font-size:17px'>";
        Object.keys(mods).forEach(key => {
            html += `<tr>
            <td>${mods[key].name}</td>
            <td>
                <label style="cursor:pointer">
                    <input type="checkbox" id="modtoggle_${key}" ${mods[key].enabled ? "checked" : ""} style="transform:scale(1.2);margin-right:6px;">
                    <span>${mods[key].enabled ? "<span style='color:#00FF88'>ON</span>" : "<span style='color:#ff5555'>OFF</span>"}</span>
                </label>
            </td>
            </tr>`;
        });
        html += "</table>";
        html += "<br><button id='closemodmgr' style='font-size:15px;padding:4px 18px;background:#111;color:#00FF88;border:1px solid #00FF88;border-radius:7px;cursor:pointer'>Close</button>";
        managerOverlay.innerHTML = html;

        // Attach handlers
        Object.keys(mods).forEach(key => {
            let box = managerOverlay.querySelector(`#modtoggle_${key}`);
            if (box) {
                box.onchange = function() {
                    mods[key].enabled = this.checked;
                    updateManagerOverlay();
                    // Redraw overlays
                    drawKeystrokesOverlay();
                    updateCpsOverlay();
                };
            }
        });
        let closeBtn = managerOverlay.querySelector("#closemodmgr");
        if (closeBtn) closeBtn.onclick = () => managerOverlay.style.display = "none";
    }

    // --- Keyboard Handlers ---

    // Keystrokes
    window.addEventListener('keydown', function(e) {
        // Keystroke state for overlay
        if (mods.keystrokes.enabled && keyState.hasOwnProperty(e.code)) {
            if (!keyState[e.code]) {
                keyState[e.code] = true;
                drawKeystrokesOverlay();
            }
        }

        // Mod Manager
        if (e.code === "ShiftRight" && !e.repeat) {
            managerOverlay.style.display = (managerOverlay.style.display === "none") ? "block" : "none";
            updateManagerOverlay();
        }
    });
    window.addEventListener('keyup', function(e) {
        if (mods.keystrokes.enabled && keyState.hasOwnProperty(e.code)) {
            if (keyState[e.code]) {
                keyState[e.code] = false;
                drawKeystrokesOverlay();
            }
        }
    });

    // Mouse for CPS
    window.addEventListener('mousedown', function(e) {
        if (!mods.cps.enabled) return;
        if (e.button === 0) {
            clicks.push(Date.now());
            calcCPS();
        }
    });

    // Always redraw overlays on resize
    window.addEventListener('resize', function() {
        drawKeystrokesOverlay();
        updateCpsOverlay();
    });

    // --- Initial State ---
    keystrokesOverlay.style.display = "none";
    cpsOverlay.style.display = "none";
    managerOverlay.style.display = "none";

    // --- Console Info ---
    console.log("[Eaglercraft Mod Manager] Loaded! Press Right Shift to open/close the mod manager.");

    // Optional: Escape closes manager
    window.addEventListener("keydown", function(e) {
        if (e.code === "Escape" && managerOverlay.style.display === "block") {
            managerOverlay.style.display = "none";
        }
    });
})();

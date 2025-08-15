function num(v) {
  const n = Number(String(v||"").replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

async function loadData() {
  setStatus("Loading data…");

  const sheetId = getParam("sheet");
  try {
    let rows;
    if (sheetId) {
      sourceTag.innerHTML = Source: <code>Google Sheet (${sheetId})</code>;
      rows = await fetchCsv(sheetCsvUrl(sheetId));
    } else {
      sourceTag.innerHTML = Source: <code>data/anoma.json</code>;
      const json = await fetchJson(DEFAULT_JSON_URL);
      rows = Array.isArray(json) ? json.map(normalizeRow) : [];
    }

    // Days filter is cosmetic unless rows have per-day breakdown. We just show note and last updated.
    currentData = rows;
    const latest = currentData.find(r => r.updated_at) ? 
      currentData.map(r => r.updated_at).filter(Boolean).sort().slice(-1)[0] : "N/A";
    lastUpdatedEl.textContent = latest;

    renderTable(currentData);
    setStatus(Loaded ${currentData.length} users);
  } catch (e) {
    console.error(e);
    setStatus("Error: " + e.message);
  }
}

refreshBtn.addEventListener("click", loadData);
searchBtn.addEventListener("click", searchHandle);
queryInput.addEventListener("keydown", (e) => { if (e.key === "Enter") searchHandle(); });

loadData();

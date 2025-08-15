const tbody = document.querySelector("#leaderboard tbody");
const statusEl = document.getElementById("status");
const queryInput = document.getElementById("query");
const daysSelect = document.getElementById("days");
const limitSelect = document.getElementById("limit");
const refreshBtn = document.getElementById("refreshBtn");
const searchBtn = document.getElementById("searchBtn");

let currentData = [];

async function loadLeaderboard() {
  clearTable();
  setStatus("Fetching live tweets…");

  const days = Number(daysSelect.value);
  const limit = Number(limitSelect.value);

  try {
    const res = await fetch(/api/leaderboard?days=${days}&limit=${limit});
    if (!res.ok) {
      const t = await res.text();
      throw new Error(${res.status} ${res.statusText} — ${t});
    }
    const payload = await res.json();
    currentData = payload.leaderboard;
    renderTable(currentData);
    setStatus(Loaded ${payload.tweetsFetched} tweets → ${currentData.length} users);
  } catch (err) {
    console.error(err);
    setStatus("Error: " + err.message);
  }
}

function scoreRow(u) {
  return u.likes + 2 * u.retweets + u.replies + u.quotes;
}

function renderTable(users) {
  clearTable();
  users
    .sort((a, b) => scoreRow(b) - scoreRow(a))
    .forEach((u, i) => {
      const tr = document.createElement("tr");
      tr.dataset.handle = u.handle.toLowerCase();

      tr.innerHTML = 
        <td>${i + 1}</td>
        <td style="text-align:left;">
          <a href="https://twitter.com/${u.handle.replace(/^@/, '')}" target="_blank" rel="noopener">${u.handle}</a>
        </td>
        <td>${u.posts}</td>
        <td>${u.likes}</td>
        <td>${u.retweets}</td>
        <td>${u.replies}</td>
        <td>${u.quotes}</td>
        <td><strong>${scoreRow(u)}</strong></td>
      ;
      tbody.appendChild(tr);
    });
}

function clearTable() { tbody.innerHTML = ""; }
function setStatus(t) { statusEl.textContent = t || ""; }

function searchHandle() {
  const q = queryInput.value.trim().toLowerCase();
  Array.from(tbody.querySelectorAll("tr")).forEach(tr => tr.classList.remove("highlight"));
  if (!q) return;

  // Try exact match (@handle or handle)
  const match = Array.from(tbody.querySelectorAll("tr")).find(tr => {
    const h = tr.dataset.handle;
    return h === q.replace(/^@?/, '@') || h === '@' + q.replace(/^@/, '');
  });

  if (match) {
    match.classList.add("highlight");
    match.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    setStatus("No exact match found for " + q);
  }
}

refreshBtn.addEventListener("click", loadLeaderboard);
searchBtn.addEventListener("click", searchHandle);
queryInput.addEventListener("keydown", (e) => { if (e.key === "Enter") searchHandle(); });

// Auto-load on first visit
loadLeaderboard();

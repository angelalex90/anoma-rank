const users = [
  { name: "@Alwin", posts: 12, engagement: 340 },
  { name: "@CryptoNinja", posts: 9, engagement: 280 },
  { name: "@AnomaFan", posts: 7, engagement: 190 },
  { name: "@BlockDev", posts: 5, engagement: 120 },
];

users.sort((a, b) => b.engagement - a.engagement);

const tbody = document.querySelector("#leaderboard tbody");

users.forEach((user, index) => {
  const row = document.createElement("tr");
  row.innerHTML = 
    <td>${index + 1}</td>
    <td>${user.name}</td>
    <td>${user.posts}</td>
    <td>${user.engagement}</td>
  ;
  tbody.appendChild(row);
});

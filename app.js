const STORAGE_KEY = "money-checkpoint-state-v1";

const seedUsers = [
  {
    id: "maya",
    name: "Maya",
    focus: "Fewer surprise charges",
    weeklyBudget: 325,
    savingsGoal: 1200,
    savingsSaved: 470,
    protected: false,
    expenses: [
      { week: 1, category: "Groceries", amount: 84 },
      { week: 1, category: "Eating out", amount: 42 },
      { week: 2, category: "Transport", amount: 38 },
      { week: 2, category: "Shopping", amount: 71 },
      { week: 3, category: "Groceries", amount: 96 }
    ],
    subscriptions: [
      { name: "Netflix", day: 6, amount: 15.49 },
      { name: "Spotify", day: 12, amount: 10.99 },
      { name: "Amazon Prime", day: 19, amount: 14.99 },
      { name: "Apple Music", day: 27, amount: 10.99 }
    ],
    bills: [
      { name: "Car insurance", day: 9, amount: 138, paid: true },
      { name: "Phone plan", day: 18, amount: 66, paid: false },
      { name: "Water utility", day: 24, amount: 43, paid: false }
    ]
  },
  {
    id: "jordan",
    name: "Jordan",
    focus: "Weekly logging habit",
    weeklyBudget: 280,
    savingsGoal: 1200,
    savingsSaved: 310,
    protected: false,
    expenses: [
      { week: 1, category: "Groceries", amount: 61 },
      { week: 1, category: "Entertainment", amount: 54 },
      { week: 2, category: "Eating out", amount: 88 },
      { week: 3, category: "Other", amount: 47 }
    ],
    subscriptions: [
      { name: "Hulu", day: 4, amount: 17.99 },
      { name: "Spotify", day: 15, amount: 10.99 },
      { name: "iCloud", day: 22, amount: 2.99 },
      { name: "Gym app", day: 29, amount: 12.99 }
    ],
    bills: [
      { name: "Car insurance", day: 11, amount: 122, paid: false },
      { name: "Phone plan", day: 20, amount: 58, paid: false },
      { name: "Gas utility", day: 26, amount: 52, paid: false }
    ]
  },
  {
    id: "sam",
    name: "Sam",
    focus: "Manual bill checklist",
    weeklyBudget: 360,
    savingsGoal: 1200,
    savingsSaved: 760,
    protected: true,
    expenses: [
      { week: 1, category: "Transport", amount: 118 },
      { week: 2, category: "Groceries", amount: 94 },
      { week: 2, category: "Shopping", amount: 86 },
      { week: 3, category: "Eating out", amount: 64 }
    ],
    subscriptions: [
      { name: "Netflix", day: 8, amount: 15.49 },
      { name: "Apple Music", day: 13, amount: 10.99 },
      { name: "Amazon Prime", day: 21, amount: 14.99 },
      { name: "Canva", day: 28, amount: 12.99 }
    ],
    bills: [
      { name: "Car insurance", day: 7, amount: 151, paid: true },
      { name: "Phone plan", day: 17, amount: 72, paid: true },
      { name: "Electric utility", day: 25, amount: 83, paid: false }
    ]
  },
  {
    id: "taylor",
    name: "Taylor",
    focus: "Laptop savings target",
    weeklyBudget: 300,
    savingsGoal: 1200,
    savingsSaved: 995,
    protected: false,
    expenses: [
      { week: 1, category: "Groceries", amount: 74 },
      { week: 2, category: "Entertainment", amount: 39 },
      { week: 3, category: "Shopping", amount: 112 },
      { week: 3, category: "Transport", amount: 46 }
    ],
    subscriptions: [
      { name: "Netflix", day: 3, amount: 15.49 },
      { name: "Spotify", day: 10, amount: 10.99 },
      { name: "Apple Music", day: 16, amount: 10.99 },
      { name: "Amazon Prime", day: 23, amount: 14.99 }
    ],
    bills: [
      { name: "Car insurance", day: 12, amount: 134, paid: false },
      { name: "Phone plan", day: 19, amount: 61, paid: false },
      { name: "Internet utility", day: 27, amount: 70, paid: false }
    ]
  }
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const preciseFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const today = new Date();
const currentDay = today.getDate();
const monthName = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const weekCount = Math.ceil(daysInMonth / 7);

let state = loadState();
let activeUserId = state.activeUserId || state.users[0].id;

const elements = {
  userTabs: document.querySelector("#userTabs"),
  monthLabel: document.querySelector("#monthLabel"),
  monthSummary: document.querySelector("#monthSummary"),
  activeUserLabel: document.querySelector("#activeUserLabel"),
  activeUserTitle: document.querySelector("#activeUserTitle"),
  cashflowTitle: document.querySelector("#cashflowTitle"),
  cashflowDetail: document.querySelector("#cashflowDetail"),
  calendarStrip: document.querySelector("#calendarStrip"),
  weeklyTotal: document.querySelector("#weeklyTotal"),
  expenseWeek: document.querySelector("#expenseWeek"),
  expenseCategory: document.querySelector("#expenseCategory"),
  expenseAmount: document.querySelector("#expenseAmount"),
  expenseForm: document.querySelector("#expenseForm"),
  weeklyBars: document.querySelector("#weeklyBars"),
  subscriptionTotal: document.querySelector("#subscriptionTotal"),
  subscriptionList: document.querySelector("#subscriptionList"),
  billStatus: document.querySelector("#billStatus"),
  billList: document.querySelector("#billList"),
  savingsPercent: document.querySelector("#savingsPercent"),
  progressRing: document.querySelector("#progressRing"),
  progressAmount: document.querySelector("#progressAmount"),
  goalLine: document.querySelector("#goalLine"),
  savingsForm: document.querySelector("#savingsForm"),
  savingsAmount: document.querySelector("#savingsAmount"),
  protectSavings: document.querySelector("#protectSavings"),
  resetDemo: document.querySelector("#resetDemo")
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return { users: structuredClone(seedUsers), activeUserId: seedUsers[0].id };
  }

  try {
    return JSON.parse(saved);
  } catch {
    return { users: structuredClone(seedUsers), activeUserId: seedUsers[0].id };
  }
}

function saveState() {
  state.activeUserId = activeUserId;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getActiveUser() {
  return state.users.find((user) => user.id === activeUserId) || state.users[0];
}

function sum(items, key = "amount") {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function getWeekTotals(user) {
  return Array.from({ length: weekCount }, (_, index) => {
    const week = index + 1;
    return {
      week,
      total: sum(user.expenses.filter((expense) => expense.week === week))
    };
  });
}

function daysUntil(day) {
  return day - currentDay;
}

function render() {
  const user = getActiveUser();
  const upcomingCharges = [...user.subscriptions, ...user.bills]
    .filter((item) => daysUntil(item.day) >= 0)
    .sort((a, b) => a.day - b.day);
  const unpaidBills = user.bills.filter((bill) => !bill.paid);
  const totalUpcoming = sum(upcomingCharges);

  elements.monthLabel.textContent = monthName;
  elements.monthSummary.textContent = `${state.users.length} users tracking the same money habits`;
  elements.activeUserLabel.textContent = user.focus;
  elements.activeUserTitle.textContent = `${user.name}'s month at a glance`;
  elements.cashflowTitle.textContent =
    unpaidBills.length === 0 ? "All manual bills are handled" : `${unpaidBills.length} manual bill${unpaidBills.length === 1 ? "" : "s"} still open`;
  elements.cashflowDetail.textContent = `${formatter.format(totalUpcoming)} in subscriptions and bills is still scheduled this month.`;

  renderUsers();
  renderWeekOptions();
  renderCalendar(upcomingCharges);
  renderExpenses(user);
  renderSubscriptions(user);
  renderBills(user);
  renderSavings(user);
  saveState();
}

function renderUsers() {
  elements.userTabs.innerHTML = "";
  state.users.forEach((user) => {
    const button = document.createElement("button");
    button.className = "user-tab";
    button.type = "button";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(user.id === activeUserId));
    button.innerHTML = `
      <span class="avatar" aria-hidden="true">${user.name.slice(0, 1)}</span>
      <span class="tab-text">
        <strong>${user.name}</strong>
        <span>${user.focus}</span>
      </span>
      <span class="tab-pill">${Math.round((user.savingsSaved / user.savingsGoal) * 100)}%</span>
    `;
    button.addEventListener("click", () => {
      activeUserId = user.id;
      render();
    });
    elements.userTabs.append(button);
  });
}

function renderWeekOptions() {
  const selected = elements.expenseWeek.value || String(Math.min(Math.ceil(currentDay / 7), weekCount));
  elements.expenseWeek.innerHTML = "";
  Array.from({ length: weekCount }, (_, index) => index + 1).forEach((week) => {
    const option = document.createElement("option");
    option.value = String(week);
    option.textContent = `Week ${week}`;
    elements.expenseWeek.append(option);
  });
  elements.expenseWeek.value = selected;
}

function renderCalendar(charges) {
  elements.calendarStrip.innerHTML = "";
  const tiles = charges.slice(0, 7);
  tiles.forEach((charge) => {
    const tile = document.createElement("div");
    const dueSoon = daysUntil(charge.day) <= 5;
    tile.className = `date-tile${dueSoon ? " due-soon" : ""}`;
    tile.innerHTML = `
      <strong>${charge.day}</strong>
      <span>${charge.name}</span>
      <span>${preciseFormatter.format(charge.amount)}</span>
    `;
    elements.calendarStrip.append(tile);
  });
}

function renderExpenses(user) {
  const weekTotals = getWeekTotals(user);
  const monthlyTotal = sum(user.expenses);
  const maxValue = Math.max(user.weeklyBudget, ...weekTotals.map((week) => week.total));
  elements.weeklyTotal.textContent = formatter.format(monthlyTotal);
  elements.weeklyBars.innerHTML = "";

  weekTotals.forEach(({ week, total }) => {
    const row = document.createElement("div");
    row.className = "week-row";
    const percent = Math.min((total / maxValue) * 100, 100);
    row.innerHTML = `
      <strong>Week ${week}</strong>
      <div class="bar-track" aria-label="Week ${week} total ${preciseFormatter.format(total)}">
        <div class="bar-fill" style="width: ${percent}%"></div>
      </div>
      <span class="amount">${formatter.format(total)}</span>
    `;
    elements.weeklyBars.append(row);
  });
}

function renderSubscriptions(user) {
  const subscriptions = [...user.subscriptions].sort((a, b) => a.day - b.day);
  elements.subscriptionTotal.textContent = preciseFormatter.format(sum(subscriptions));
  elements.subscriptionList.innerHTML = "";

  subscriptions.forEach((subscription) => {
    const row = document.createElement("div");
    row.className = "money-item";
    row.innerHTML = `
      <div>
        <strong>${subscription.name}</strong>
        <span>${dayLabel(subscription.day)}</span>
      </div>
      <span class="amount">${preciseFormatter.format(subscription.amount)}</span>
    `;
    elements.subscriptionList.append(row);
  });
}

function renderBills(user) {
  const bills = [...user.bills].sort((a, b) => a.day - b.day);
  const paid = bills.filter((bill) => bill.paid).length;
  elements.billStatus.textContent = `${paid}/${bills.length} done`;
  elements.billList.innerHTML = "";

  bills.forEach((bill) => {
    const row = document.createElement("div");
    row.className = `money-item${bill.paid ? " done" : ""}`;
    const late = !bill.paid && daysUntil(bill.day) < 0;
    row.innerHTML = `
      <div>
        <strong>${bill.name}</strong>
        <span class="${late ? "overdue" : ""}">${late ? "Late" : dayLabel(bill.day)} · ${preciseFormatter.format(bill.amount)}</span>
      </div>
      <button type="button">${bill.paid ? "Paid" : "Mark paid"}</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      bill.paid = !bill.paid;
      render();
    });
    elements.billList.append(row);
  });
}

function renderSavings(user) {
  const progress = Math.min(user.savingsSaved / user.savingsGoal, 1);
  const percent = Math.round(progress * 100);
  elements.savingsPercent.textContent = `${percent}%`;
  elements.progressRing.style.setProperty("--progress", `${percent}%`);
  elements.progressAmount.textContent = formatter.format(user.savingsSaved);
  elements.goalLine.textContent = `${formatter.format(user.savingsSaved)} saved toward ${formatter.format(user.savingsGoal)}. ${formatter.format(Math.max(user.savingsGoal - user.savingsSaved, 0))} left.`;
  elements.protectSavings.textContent = user.protected ? "Laptop money is protected" : "Mark laptop money protected";
  elements.protectSavings.classList.toggle("protected", user.protected);
}

function dayLabel(day) {
  const remaining = daysUntil(day);
  if (remaining === 0) return `Due today, ${monthName.split(" ")[0]} ${day}`;
  if (remaining > 0) return `Due in ${remaining} day${remaining === 1 ? "" : "s"}, ${monthName.split(" ")[0]} ${day}`;
  return `Charged ${Math.abs(remaining)} day${remaining === -1 ? "" : "s"} ago`;
}

elements.expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(elements.expenseAmount.value);
  if (!amount) return;
  getActiveUser().expenses.push({
    week: Number(elements.expenseWeek.value),
    category: elements.expenseCategory.value,
    amount
  });
  elements.expenseAmount.value = "";
  render();
});

elements.savingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(elements.savingsAmount.value);
  if (!amount) return;
  const user = getActiveUser();
  user.savingsSaved = Math.min(user.savingsSaved + amount, user.savingsGoal);
  elements.savingsAmount.value = "";
  render();
});

elements.protectSavings.addEventListener("click", () => {
  const user = getActiveUser();
  user.protected = !user.protected;
  render();
});

elements.resetDemo.addEventListener("click", () => {
  state = { users: structuredClone(seedUsers), activeUserId: seedUsers[0].id };
  activeUserId = state.activeUserId;
  render();
});

render();

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const taskQueue = [
  { id: 1, name: "Task A", arrival: 0, burst: 8 },
  { id: 2, name: "Task B", arrival: 1, burst: 4 },
  { id: 3, name: "Task C", arrival: 2, burst: 9 },
  { id: 4, name: "Task D", arrival: 3, burst: 5 },
];

function hrrn(tasks) {
  let time = 0;
  let completed = [];

  while (tasks.length > 0) {
    tasks.forEach(t => {
      t.responseRatio = ((time - t.arrival + t.burst) / t.burst).toFixed(2);
    });

    const selected = tasks.sort((a, b) => b.responseRatio - a.responseRatio)[0];
    completed.push({ ...selected, startTime: time });
    time += selected.burst;
    tasks = tasks.filter(t => t.id !== selected.id);
  }

  return completed;
}

function srt(tasks) {
    let time = 0;
    let completed = [];
    let inProgress = [...tasks];
  
    while (inProgress.length > 0) {
      const available = inProgress.filter(t => t.arrival <= time);
      if (available.length === 0) {
        time++;
        continue;
      }
  
      const selected = available.sort((a, b) => a.burst - b.burst)[0];
  
      // Assign startTime only if it hasn't been set
      if (selected.startTime === undefined) {
        selected.startTime = time;
      }
  
      time++;
      selected.burst--;
  
      if (selected.burst === 0) {
        completed.push({ ...selected, finishTime: time });
        inProgress = inProgress.filter(t => t.id !== selected.id);
      }
    }
  
    return completed;
  }
  

function sjf(tasks) {
  let time = 0;
  let completed = [];

  while (tasks.length > 0) {
    const available = tasks.filter(t => t.arrival <= time);
    if (available.length === 0) {
      time++;
      continue;
    }

    const selected = available.sort((a, b) => a.burst - b.burst)[0];
    completed.push({ ...selected, startTime: time });
    time += selected.burst;
    tasks = tasks.filter(t => t.id !== selected.id);
  }

  return completed;
}

function fifo(tasks) {
  let time = 0;
  let completed = [];

  tasks.forEach(t => {
    completed.push({ ...t, startTime: time });
    time += t.burst;
  });

  return completed;
}

function displaySchedule(schedule) {
  console.log("\nSchedule:");
  schedule.forEach(task => {
    console.log(`Task ${task.name} started at time ${task.startTime}`);
  });
}

function playGame() {
  console.log("Welcome to the Process Management Simulation Game!");
  console.log("Available scheduling algorithms:");
  console.log("1. HRRN (Highest Response Ratio Next)");
  console.log("2. SRT (Shortest Remaining Time)");
  console.log("3. SJF (Shortest Job First)");
  console.log("4. FIFO (First In, First Out)");

  rl.question("Choose a scheduling algorithm (1-4): ", choice => {
    let schedule;
    const tasks = JSON.parse(JSON.stringify(taskQueue)); // Deep copy

    switch (choice) {
      case "1":
        schedule = hrrn(tasks);
        break;
      case "2":
        schedule = srt(tasks);
        break;
      case "3":
        schedule = sjf(tasks);
        break;
      case "4":
        schedule = fifo(tasks);
        break;
      default:
        console.log("Invalid choice. Please restart the game.");
        rl.close();
        return;
    }

    displaySchedule(schedule);
    console.log("\nThanks for playing the Process Management Simulation Game!");
    rl.close();
  });
}

playGame();

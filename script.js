const attendanceData = [];

// Handle Login
function login() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();

  if (user === "admin" && pass === "admin@123") {
    showPage('adminPage');
  } else if (user === pass && /^12\d{2}$/.test(user)) {
    showPage('studentPage');
    const studentName = getStudentName(user); // Function to get the student's name based on roll
    document.getElementById('studentName').innerHTML = "Student: " + studentName; // Show student's name
    renderStudentTable(); // Generate dummy summary
  } else {
    alert("Invalid credentials.");
  }
}

// Get Student Name based on Roll Number
function getStudentName(rollNumber) {
  const students = {
    "1201": "Abhishek Band",
    "1202": "Yash Barbaile",
    // Add more roll numbers and names as necessary
  };
  return students[rollNumber] || "Unknown Student";
}

// Switch between pages
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// Mark Attendance for Students (Admin Page)
function markAttendance(button, status) {
  const studentDiv = button.closest('.student');
  const roll = studentDiv.getAttribute('data-roll');
  const name = studentDiv.getAttribute('data-name');
  const presentBtn = studentDiv.querySelector('.present-btn');
  const absentBtn = studentDiv.querySelector('.absent-btn');

  presentBtn.classList.remove('selected');
  absentBtn.classList.remove('selected');
  if (status === 'Present') presentBtn.classList.add('selected');
  else absentBtn.classList.add('selected');

  const existing = attendanceData.find(s => s.roll === roll);
  if (existing) existing.status = status;
  else attendanceData.push({ roll, name, status });
}

// Display Attendance Table on Student Page
function displayAttendance() {
  const subject = document.getElementById("subjectSelect").value;
  if (subject !== "") {
    document.getElementById("attendanceTable").style.display = "table"; // Show the table
    renderStudentTable(); // Fill table with dummy data
  } else {
    alert("Please select a subject."); // Only show alert if no subject is selected
  }
}

// Render Student Table for Attendance (31 Days)
function renderStudentTable() {
  const days = 31;
  const attendanceBody = document.getElementById("attendanceBody");

  attendanceBody.innerHTML = ""; // Clear existing table content

  for (let i = 1; i <= days; i++) {
    const tr = document.createElement("tr");

    const dateTd = document.createElement("td");
    dateTd.textContent = i;
    tr.appendChild(dateTd);

    const attendanceTd = document.createElement("td");
    attendanceTd.className = "attendance-cell";
    attendanceTd.textContent = ""; // Leave it empty initially
    tr.appendChild(attendanceTd);

    attendanceBody.appendChild(tr);
  }
}

// Submit Attendance Data (Admin Page)
function submitAttendance() {
  const dateInput = document.getElementById('attendanceDate');
  const subjectSelect = document.getElementById('subjectSelect');
  const selectedDate = dateInput.value;
  const selectedSubject = subjectSelect.value;

  if (!selectedDate || !selectedSubject) {
    alert("Please select both date and subject before submitting.");
    return;
  }

  const key = `attendance_${selectedDate}_${selectedSubject}`;
  localStorage.setItem(key, JSON.stringify(attendanceData));

  // Optionally, show a confirmation or generated report
  alert("Attendance has been saved for the selected date and subject.");

  // Reset form or table if needed
  document.getElementById("attendanceForm").reset();
  attendanceData.length = 0; // Clear the attendance data after submission
}

// Logout and Return to Login Page
function logout() {
  showPage('loginPage');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

// Load Stored Attendance (Admin Page)
function loadStoredAttendance() {
  const date = document.getElementById('attendanceDate').value;
  const subject = document.getElementById('subjectSelect').value;
  const key = `attendance_${date}_${subject}`;
  const stored = localStorage.getItem(key);

  if (stored) {
    const data = JSON.parse(stored);
    attendanceData.length = 0;
    data.forEach(entry => attendanceData.push(entry));

    // Update attendance display
    data.forEach(student => {
      const studentDiv = document.querySelector(`.student[data-roll="${student.roll}"]`);
      if (studentDiv) {
        const presentBtn = studentDiv.querySelector('.present-btn');
        const absentBtn = studentDiv.querySelector('.absent-btn');
        presentBtn.classList.remove('selected');
        absentBtn.classList.remove('selected');

        if (student.status === 'Present') {
          presentBtn.classList.add('selected');
        } else {
          absentBtn.classList.add('selected');
        }
      }
    });
  }
}

document.getElementById('attendanceDate').addEventListener('change', loadStoredAttendance);
document.getElementById('subjectSelect').addEventListener('change', loadStoredAttendance);

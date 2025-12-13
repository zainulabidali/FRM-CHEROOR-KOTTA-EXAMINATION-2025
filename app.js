import { db } from './firebase-config.js';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// DOM Elements
const studentView = document.getElementById('studentView');
const resultView = document.getElementById('resultView');
const adminDashboard = document.getElementById('adminDashboard');
const loginModal = document.getElementById('loginModal');
const loadingOverlay = document.getElementById('loadingOverlay');

// Student Form Elements
const studentForm = document.getElementById('studentForm');
const studentName = document.getElementById('studentName');
const studentClass = document.getElementById('studentClass');
const registerNumber = document.getElementById('registerNumber');

// Admin Elements
const adminLoginBtn = document.getElementById('adminLoginBtn');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const closeBtn = document.querySelector('.close');
const backToHome = document.getElementById('backToHome');

// Admin Dashboard Steps
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const successMessage = document.getElementById('successMessage');

// Class Setup Form
const classSetupForm = document.getElementById('classSetupForm');
const adminClass = document.getElementById('adminClass');
const numStudents = document.getElementById('numStudents');

// Subject Setup Form
const subjectSetupForm = document.getElementById('subjectSetupForm');
const numSubjects = document.getElementById('numSubjects');
const subjectInputs = document.getElementById('subjectInputs');
const generateSubjects = document.getElementById('generateSubjects');
const nextToMarks = document.getElementById('nextToMarks');
const selectedClass = document.getElementById('selectedClass');
const selectedStudents = document.getElementById('selectedStudents');

// Marks Entry Form
const marksEntryForm = document.getElementById('marksEntryForm');
const studentsMarksContainer = document.getElementById('studentsMarksContainer');
const selectedClass2 = document.getElementById('selectedClass2');
const selectedStudents2 = document.getElementById('selectedStudents2');
const selectedSubjects = document.getElementById('selectedSubjects');

// Manage Results Elements
const manageResults = document.getElementById('manageResults');
const manageClassSelect = document.getElementById('manageClassSelect');
const loadResultsBtn = document.getElementById('loadResultsBtn');
const resultsTableContainer = document.getElementById('resultsTableContainer');
const adminResultsTableBody = document.getElementById('adminResultsTableBody');

// Edit Student Modal Elements
const editStudentModal = document.getElementById('editStudentModal');
const closeEditModal = document.getElementById('closeEditModal');
const editStudentForm = document.getElementById('editStudentForm');
const editSubjectMarksContainer = document.getElementById('editSubjectMarksContainer');

// Success Message
const addMoreResults = document.getElementById('addMoreResults');

// Event Listeners
adminLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

backToHome.addEventListener('click', () => {
    resultView.classList.add('hidden');
    studentView.classList.remove('hidden');
});

logoutBtn.addEventListener('click', () => {
    adminDashboard.classList.add('hidden');
    studentView.classList.remove('hidden');
});

// Student Form Submission
studentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = studentName.value.trim();
    const classNum = studentClass.value;
    const regNo = registerNumber.value.trim();

    if (name && classNum && regNo) {
        displayResult(name, classNum, regNo);
    }
});

// Admin Login Form Submission
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    // Simple authentication (in real app, this should be done securely)
    if (username === 'admin' && password === 'admin123') {
        showLoading();
        setTimeout(() => {
            hideLoading();
            loginModal.classList.add('hidden');
            studentView.classList.add('hidden');
            adminDashboard.classList.remove('hidden');
            classSetupForm.reset();
        }, 1000); // Simulate network delay
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// Class Setup Form Submission
classSetupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const classNum = adminClass.value;
    const studentCount = numStudents.value;

    if (classNum && studentCount) {
        selectedClass.textContent = `Class ${classNum}`;
        selectedStudents.textContent = studentCount;
        selectedClass2.textContent = `Class ${classNum}`;
        selectedStudents2.textContent = studentCount;

        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    }
});

// Generate Subject Fields
generateSubjects.addEventListener('click', function () {
    const subjectCount = parseInt(numSubjects.value);

    if (subjectCount > 0 && subjectCount <= 15) {
        subjectInputs.innerHTML = '';

        for (let i = 1; i <= subjectCount; i++) {
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label>Subject ${i}</label>
                <input type="text" class="subject-name" placeholder="Enter subject name" required>
            `;
            subjectInputs.appendChild(div);
        }

        nextToMarks.classList.remove('hidden');
    } else {
        alert('Please enter a valid number of subjects (1-15)');
    }
});

// Subject Setup Form Submission
subjectSetupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const subjectElements = document.querySelectorAll('.subject-name');
    const subjects = [];

    subjectElements.forEach(element => {
        if (element.value.trim()) {
            subjects.push(element.value.trim());
        }
    });

    if (subjects.length > 0) {
        selectedSubjects.textContent = subjects.length;
        generateMarksFields(subjects);
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
    } else {
        alert('Please enter at least one subject name');
    }
});

// Generate Marks Entry Fields
function generateMarksFields(subjects) {
    studentsMarksContainer.innerHTML = '';
    const studentCount = parseInt(numStudents.value);
    const classNum = adminClass.value;

    for (let i = 1; i <= studentCount; i++) {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'card glass-effect';
        studentDiv.style.marginBottom = '20px';

        let subjectInputsHTML = '';
        subjects.forEach(subject => {
            subjectInputsHTML += `
                <div class="form-group">
                    <label>${subject} Marks</label>
                    <input type="number" class="subject-mark" data-subject="${subject}" min="0" max="50" placeholder="0-50" required>
                </div>
            `;
        });

        studentDiv.innerHTML = `
            <h3>Student ${i}</h3>
            <div class="form-group">
                <label>Name</label>
                <input type="text" class="student-name" placeholder="Enter student name" required>
            </div>
            <div class="form-group">
                <label>Register Number</label>
                <input type="text" class="student-reg" placeholder="Enter register number" required>
            </div>
            ${subjectInputsHTML}
            <div class="form-group">
                <label>Remarks (Optional)</label>
                <textarea class="student-remarks" placeholder="Enter remarks"></textarea>
            </div>
        `;

        studentsMarksContainer.appendChild(studentDiv);
    }
}

// Marks Entry Form Submission
marksEntryForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect all student data
    const studentCards = studentsMarksContainer.querySelectorAll('.card');
    const classNum = adminClass.value;
    const results = [];

    studentCards.forEach(card => {
        const name = card.querySelector('.student-name').value.trim();
        const regNo = card.querySelector('.student-reg').value.trim();
        const remarks = card.querySelector('.student-remarks').value.trim();

        if (!name || !regNo) {
            alert('Please fill in all student names and register numbers');
            return;
        }

        const marksElements = card.querySelectorAll('.subject-mark');
        const marks = {};

        marksElements.forEach(element => {
            const subject = element.getAttribute('data-subject');
            const mark = element.value;
            if (mark !== '') {
                marks[subject] = parseInt(mark);
            }
        });

        results.push({
            name: name,
            regNo: regNo,
            class: classNum,
            marks: marks,
            remarks: remarks
        });
    });

    if (results.length > 0) {
        // Save to Firebase
        saveResultsToFirebase(classNum, results);
        step3.classList.add('hidden');
        successMessage.classList.remove('hidden');
    }
});

// Save Results to Firebase
async function saveResultsToFirebase(classNum, results) {
    showLoading();
    try {
        for (const student of results) {
            // Create a reference to the student document
            const studentRef = doc(db, 'classes', classNum, 'students', student.regNo);

            // Save student data
            await setDoc(studentRef, {
                name: student.name,
                class: student.class,
                regNo: student.regNo,
                marks: student.marks,
                remarks: student.remarks
            });
        }

        console.log('Results saved to Firebase');
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Error saving results:', error);
        alert('Error saving results. Please try again.');
    }
}

// Display Student Result
async function displayResult(name, classNum, regNo) {
    showLoading();
    try {
        // Create a reference to the student document
        const studentRef = doc(db, 'classes', classNum, 'students', regNo);

        // Get the student data
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
            const studentData = studentSnap.data();

            // Display student info
            document.getElementById('resultStudentName').textContent = studentData.name;
            document.getElementById('resultClass').textContent = studentData.class;
            document.getElementById('resultRegNo').textContent = studentData.regNo;

            // Display marks
            const marksTableBody = document.getElementById('marksTableBody');
            marksTableBody.innerHTML = '';

            let totalMarks = 0;
            let subjectCount = 0;
            let hasFail = false; // Track if student has failed any subject

            for (const subject in studentData.marks) {
                const mark = studentData.marks[subject];
                // Check for failure condition (below 18)
                if (mark < 18) {
                    hasFail = true;
                }

                const grade = calculateGrade(mark);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${subject}</td>
                    <td>${mark}/50</td>
                    <td>${grade}</td>
                `;

                marksTableBody.appendChild(row);

                totalMarks += mark;
                subjectCount++;
            }

            // Calculate and display summary (convert to percentage based on 50)
            const maxPossibleMarks = subjectCount * 50;
            const percentage = subjectCount > 0 ? Math.round((totalMarks / maxPossibleMarks) * 100) : 0;

            // Determine Overall Result
            const resultStatus = hasFail ? "Fail" : "Pass";
            const overallGradeElement = document.getElementById('overallGrade');

            document.getElementById('totalMarks').textContent = `${totalMarks}/${maxPossibleMarks}`;
            document.getElementById('percentage').textContent = percentage + '%';

            // Update Overall Grade display
            overallGradeElement.textContent = resultStatus;
            overallGradeElement.style.color = hasFail ? '#dc3545' : '#28a745'; // Red for Fail, Green for Pass

            // Display remarks
            const remarksSection = document.getElementById('remarksSection');
            const remarksText = document.getElementById('remarksText');

            if (studentData.remarks) {
                remarksText.textContent = studentData.remarks;
                remarksSection.classList.remove('hidden');
            } else {
                remarksSection.classList.add('hidden');
            }

            // Show result view
            studentView.classList.add('hidden');
            resultView.classList.remove('hidden');
        } else {
            alert('No results found for the provided register number in this class');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching results. Please try again.');
    } finally {
        hideLoading();
    }
}

// Calculate Grade based on marks (updated for 50 marks system)
function calculateGrade(marks) {
    // For individual subject marks out of 50
    if (marks >= 45) return 'A+';  // 90% and above
    if (marks >= 40) return 'A';   // 80% and above
    if (marks >= 35) return 'B+';  // 70% and above
    if (marks >= 30) return 'B';   // 60% and above
    if (marks >= 25) return 'C+';  // 50% and above
    if (marks >= 20) return 'C';   // 40% and above
    if (marks >= 18) return 'D+';   // 30% and above
    return 'F';                    // Below 30%
}

// Add More Results Button
addMoreResults.addEventListener('click', function () {
    successMessage.classList.add('hidden');
    step1.classList.remove('hidden');
    classSetupForm.reset();
    subjectInputs.innerHTML = '';
    nextToMarks.classList.add('hidden');
    studentsMarksContainer.innerHTML = '';
});

// Close modal when clicking outside
window.addEventListener('click', function (event) {
    if (event.target === loginModal) {
        loginModal.classList.add('hidden');
    }
    if (event.target === editStudentModal) {
        editStudentModal.classList.add('hidden');
    }
});

// Load Results Button Click
loadResultsBtn.addEventListener('click', function () {
    const classNum = manageClassSelect.value;
    if (classNum) {
        loadStudentsByClass(classNum);
    } else {
        alert('Please select a class');
    }
});

// Close Edit Modal
closeEditModal.addEventListener('click', () => {
    editStudentModal.classList.add('hidden');
});

// Edit Student Form Submission
editStudentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const classNum = document.getElementById('editStudentClass').value;
    const regNo = document.getElementById('editOriginalRegNo').value;
    const name = document.getElementById('editStudentName').value;
    const remarks = document.getElementById('editRemarks').value;

    // Collect Marks
    const markInputs = editSubjectMarksContainer.querySelectorAll('.edit-subject-mark');
    const marks = {};
    markInputs.forEach(input => {
        const subject = input.dataset.subject;
        const mark = parseInt(input.value) || 0;
        marks[subject] = mark;
    });

    updateStudent(classNum, regNo, { name, marks, remarks });
});


// --- Manage Results Functions ---

// 1. Load Students
async function loadStudentsByClass(classNum) {
    // Show loading state
    showLoading();
    resultsTableContainer.classList.remove('hidden');
    adminResultsTableBody.innerHTML = ''; // Clear previous

    try {
        const studentsRef = collection(db, 'classes', classNum, 'students');
        const querySnapshot = await getDocs(studentsRef);

        const students = [];
        querySnapshot.forEach((doc) => {
            students.push({ ...doc.data(), id: doc.id });
        });

        renderAdminTable(students, classNum);
    } catch (error) {
        console.error("Error loading students:", error);
        adminResultsTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error loading data.</td></tr>';
    } finally {
        hideLoading();
    }
}

// 2. Render Table
function renderAdminTable(students, classNum) {
    adminResultsTableBody.innerHTML = '';

    if (students.length === 0) {
        adminResultsTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No students found for this class.</td></tr>';
        return;
    }

    students.forEach(student => {
        // Calculate Totals & Status on the fly to ensure accuracy
        let totalMarks = 0;
        let subjectCount = 0;
        let hasFail = false;

        for (const subject in student.marks) {
            const mark = student.marks[subject];
            totalMarks += mark;
            subjectCount++;
            if (mark < 18) hasFail = true;
        }

        const maxMarks = subjectCount * 50;
        const percentage = subjectCount > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;
        const status = hasFail ? 'Fail' : 'Pass';
        const statusColor = hasFail ? '#dc3545' : '#28a745';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.regNo}</td>
            <td>${student.name}</td>
            <td>${totalMarks}/${maxMarks}</td>
            <td>${percentage}%</td>
            <td style="color:${statusColor}; font-weight:bold;">${status}</td>
            <td>
                <button class="btn-secondary" onclick="window.openEditModal('${classNum}', '${student.regNo}')" style="padding: 5px 10px; font-size: 0.8rem;">Edit</button>
                <button class="btn-primary" onclick="window.deleteStudent('${classNum}', '${student.regNo}')" style="padding: 5px 10px; font-size: 0.8rem; background: #dc3545; color: white;">Delete</button>
            </td>
        `;
        // Attach student data to row for easy access if needed, or just fetch again/pass params
        adminResultsTableBody.appendChild(row);
    });
}

// 3. Open Edit Modal (Global helper to be called from HTML onclick)
window.openEditModal = async function (classNum, regNo) {
    try {
        const docRef = doc(db, 'classes', classNum, 'students', regNo);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            document.getElementById('editStudentName').value = data.name;
            document.getElementById('editRegNo').value = data.regNo;
            document.getElementById('editOriginalRegNo').value = data.regNo; // Hidden
            document.getElementById('editStudentClass').value = classNum; // Hidden
            document.getElementById('editRemarks').value = data.remarks || '';

            // Generate Subject Inputs
            editSubjectMarksContainer.innerHTML = '';
            for (const subject in data.marks) {
                const div = document.createElement('div');
                div.className = 'form-group';
                div.innerHTML = `
                    <label>${subject}</label>
                    <input type="number" class="edit-subject-mark" data-subject="${subject}" value="${data.marks[subject]}" min="0" max="50">
                `;
                editSubjectMarksContainer.appendChild(div);
            }

            editStudentModal.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error fetching student details:", error);
        alert("Could not load student details.");
    }
};

// 4. Update Student
async function updateStudent(classNum, regNo, updatedData) {
    showLoading();
    try {
        const studentRef = doc(db, 'classes', classNum, 'students', regNo);

        // We only update the fields that are allowed to change
        await updateDoc(studentRef, {
            name: updatedData.name,
            marks: updatedData.marks,
            remarks: updatedData.remarks
        });

        alert("Student updated successfully!");
        editStudentModal.classList.add('hidden');
        hideLoading();
        loadStudentsByClass(classNum); // Refresh table
    } catch (error) {
        hideLoading();
        console.error("Error updating student:", error);
        alert("Error updating student.");
    }
}

// 5. Delete Student (Global helper)
window.deleteStudent = async function (classNum, regNo) {
    if (confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
        showLoading();
        try {
            await deleteDoc(doc(db, 'classes', classNum, 'students', regNo));
            hideLoading();
            // Remove row from UI instantly or simple reload
            loadStudentsByClass(classNum);
        } catch (error) {
            hideLoading();
            console.error("Error deleting student:", error);
            alert("Error deleting student.");
        }
    }
};

// --- Loading Helper Functions ---
function showLoading() {
    if (loadingOverlay) loadingOverlay.classList.add('active');
}

function hideLoading() {
    if (loadingOverlay) loadingOverlay.classList.remove('active');
}
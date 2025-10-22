// Navigation (SPA style)
function showPage(pid) {
  document.querySelectorAll('.page').forEach(pg => pg.classList.remove('active'));
  document.getElementById(pid).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  let idx = pid == 'home' ? 0 : pid == 'notes' ? 1 : pid == 'ask' ? 2 : 3;
  document.querySelectorAll('.nav-btn')[idx].classList.add('active');
  if (pid === 'quiz') renderQuiz();
  if (pid === 'notes') renderNotes();
}

let notes = [
  {
    subject: 'Operating System',
    content: `Learn about OS concepts, processes, memory management, and scheduling.<br>
      <a href="https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/index.html" target="_blank" class="note-link">OS Course - University of Illinois</a><br>
      <a href="https://en.wikipedia.org/wiki/Operating_system_concept" target="_blank" class="note-link">Operating System Concepts - Wikipedia</a>`
  },
  {
    subject: 'Data Structures & Algorithms (DSA)',
    content: `Arrays, linked lists, trees, graphs, sorting, searching.<br>
      <a href="https://csd.cmu.edu/15121-introduction-to-data-structures" target="_blank" class="note-link">Intro to Data Structures - CMU</a><br>
      <a href="https://www.geeksforgeeks.org/data-structures/" target="_blank" class="note-link">GeeksforGeeks DSA Tutorials</a>`
  },
  {
    subject: 'Python Programming',
    content: `Variables, loops, functions, OOP, practical examples with code.<br>
      <a href="https://docs.python.org/3/tutorial/" target="_blank" class="note-link">Python Official Tutorial</a><br>
      <a href="https://automatetheboringstuff.com/" target="_blank" class="note-link">Automate the Boring Stuff</a>`
  },
  {
    subject: 'Computer Networks',
    content: `Basics of networking protocols, TCP/IP, LAN, WAN, routing.<br>
      <a href="https://www.geeksforgeeks.org/computer-network-tutorials/" target="_blank" class="note-link">GeeksforGeeks Networking</a><br>
      <a href="https://www.coursera.org/learn/computer-networking" target="_blank" class="note-link">Coursera Computer Networking</a>`
  },
  {
    subject: 'Database Systems',
    content: `Relational databases, SQL, normalization, transactions.<br>
      <a href="https://www.w3schools.com/sql/" target="_blank" class="note-link">W3Schools SQL Tutorial</a><br>
      <a href="https://www.tutorialspoint.com/dbms/index.htm" target="_blank" class="note-link">TutorialsPoint DBMS</a>`
  },
  {
    subject: 'Software Engineering',
    content: `Software development life cycle, methodologies, testing.<br>
      <a href="https://www.tutorialspoint.com/software_engineering/index.htm" target="_blank" class="note-link">TutorialsPoint Software Engineering</a><br>
      <a href="https://www.coursera.org/learn/software-processes" target="_blank" class="note-link">Coursera Software Processes</a>`
  }
];
function renderNotes() {
  let html = '';
  notes.forEach(n => {
    html += `<div class='note-card'>
      <h4>${n.subject}</h4>
      <div>${n.content}</div>
    </div>`;
  });
  document.getElementById('notesList').innerHTML = html;
}
function addNotePopup() {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('note-subject').value = '';
  document.getElementById('note-content').value = '';
}
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}
function saveNote() {
  let subj = document.getElementById('note-subject').value.trim();
  let content = document.getElementById('note-content').value.trim();
  if (subj && content) {
    notes.push({ subject: subj, content: content });
    closeModal();
    renderNotes();
  }
}

// --- AI Question powered by OpenRouter API ---
async function submitAIQ() {
  const questionElem = document.getElementById('ai-question');
  const question = questionElem.value.trim();
  const answerBox = document.getElementById('ai-answer');
  const askButton = document.getElementById('askBtn');
  if (!question) {
    answerBox.innerText = 'Please ask a question.';
    return;
  }
  answerBox.innerText = 'Thinking...';
  askButton.disabled = true;

  // ==== SET YOUR OPENROUTER API KEY BELOW =====
  const OPENROUTER_API_KEY = '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';
  // ============================================

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        max_tokens: 512,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      answerBox.innerText = data.choices[0].message.content.trim();
    } else {
      answerBox.innerText = "Sorry, I couldn't find a good answer.";
    }
  } catch (error) {
    answerBox.innerText = 'Error: Unable to fetch answer. Please try again later.';
  } finally {
    askButton.disabled = false;
  }
}

// Quiz Section with 6 subjects and 10 questions each:
let quizData = {
  'Operating System': [
    { q: 'What does the OS manage?', options: ['Hardware & Software', 'Network Only', 'Database Only', 'Internet Only'], ans: 'Hardware & Software' },
    { q: 'What is a process?', options: ['Program in execution', 'Data file', 'User program', 'Memory block'], ans: 'Program in execution' },
    { q: 'Which scheduling algorithm is preemptive?', options: ['FCFS', 'Round Robin', 'SJF (Non-preemptive)', 'None'], ans: 'Round Robin' },
    { q: 'What manages virtual memory?', options: ['Hardware', 'CPU', 'Operating System', 'Application'], ans: 'Operating System' },
    { q: 'What is a kernel?', options: ['Core OS component', 'User application', 'Compiler', 'File system'], ans: 'Core OS component' },
    { q: 'Page replacement occurs in?', options: ['Memory management', 'CPU scheduling', 'File system', 'Network'], ans: 'Memory management' },
    { q: 'Which is not a type of OS?', options: ['Batch', 'Distributed', 'Concurrent', 'Compiler'], ans: 'Compiler' },
    { q: 'What does a shell do?', options: ['Interface between user and OS', 'Manages files', 'Manages printers', 'Schedules CPU'], ans: 'Interface between user and OS' },
    { q: 'Which OS is open source?', options: ['Linux', 'Windows', 'MacOS', 'DOS'], ans: 'Linux' },
    { q: 'Interrupt handler is part of?', options: ['OS', 'Hardware', 'Application software', 'Compiler'], ans: 'OS' }
  ],
  'Data Structures & Algorithms (DSA)': [
    { q: 'Which data structure is FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], ans: 'Queue' },
    { q: 'What is time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], ans: 'O(log n)' },
    { q: 'Which sorting is fastest on average?', options: ['Bubble sort', 'Merge sort', 'Insertion sort', 'Selection sort'], ans: 'Merge sort' },
    { q: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], ans: 'Stack' },
    { q: 'What is a graph?', options: ['Nodes and edges', 'Sorted array', 'Tree', 'List'], ans: 'Nodes and edges' },
    { q: 'What is a hash table used for?', options: ['Sorting', 'Mapping key/value', 'Searching', 'Stack'], ans: 'Mapping key/value' },
    { q: 'A binary tree has max nodes at level k as?', options: ['2^k-1', '2^k', 'k^2', 'k+1'], ans: '2^k' },
    { q: 'Traversal of BST for sorted order?', options: ['Preorder', 'Inorder', 'Postorder', 'Level order'], ans: 'Inorder' },
    { q: 'Dijkstra Algorithm is used for?', options: ['Shortest path', 'Sorting', 'Traversal', 'Hashing'], ans: 'Shortest path' },
    { q: 'Time complexity of inserting in linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], ans: 'O(1)' }
  ],
  'Python Programming': [
    { q: 'How to print in Python?', options: ['print()', 'echo()', 'console.log()', 'printf()'], ans: 'print()' },
    { q: 'Which keyword defines a function?', options: ['func', 'def', 'function', 'define'], ans: 'def' },
    { q: 'Which is NOT a Python data type?', options: ['List', 'Tuple', 'Array', 'Loop'], ans: 'Loop' },
    { q: 'Comment in Python?', options: ['//', '#', '/* */', '--'], ans: '#' },
    { q: 'What does len() return?', options: ['Length of object', 'Value', 'Index', 'None'], ans: 'Length of object' },
    { q: 'What is a Python dictionary?', options: ['Ordered list', 'Key-value pairs', 'Function', 'String'], ans: 'Key-value pairs' },
    { q: 'Exponentiation operator?', options: ['^', '**', '%', '//'], ans: '**' },
    { q: 'Range(5) generates?', options: ['0 to 4', '1 to 5', '0 to 5', '1 to 4'], ans: '0 to 4' },
    { q: 'How to define a class?', options: ['class', 'object', 'def', 'struct'], ans: 'class' },
    { q: 'Handle exceptions?', options: ['try-except', 'if-else', 'switch-case', 'do-while'], ans: 'try-except' }
  ],
  'Computer Networks': [
    { q: 'TCP stands for?', options: ['Transmission Control Protocol', 'Transfer Control Program', 'Transport Common Protocol', 'Technical Communication Protocol'], ans: 'Transmission Control Protocol' },
    { q: 'IP address?', options: ['Network Identifier', 'Host Identifier', 'Unique network number', 'All of the above'], ans: 'All of the above' },
    { q: 'Routing layer?', options: ['Transport', 'Network', 'Physical', 'Data-link'], ans: 'Network' },
    { q: 'Data Link layer device?', options: ['Router', 'Switch', 'Hub', 'Gateway'], ans: 'Switch' },
    { q: 'Connectionless protocol?', options: ['TCP', 'UDP', 'FTP', 'HTTP'], ans: 'UDP' },
    { q: 'DNS is for?', options: ['Domain to IP translation', 'IP to domain', 'Routing', 'Security'], ans: 'Domain to IP translation' },
    { q: 'HTTP port?', options: ['20', '21', '80', '443'], ans: '80' },
    { q: 'MAC address length?', options: ['32 bits', '48 bits', '64 bits', '128 bits'], ans: '48 bits' },
    { q: 'Email protocol?', options: ['SMTP', 'SNMP', 'FTP', 'TCP'], ans: 'SMTP' },
    { q: 'Firewall layer?', options: ['Application', 'Network', 'Physical', 'All layers'], ans: 'All layers' }
  ],
  'Database Systems': [
    { q: 'SQL stands for?', options: ['Structured Query Language', 'Simple Query Language', 'Sequential Query Language', 'Standard Query Language'], ans: 'Structured Query Language' },
    { q: 'Normalization?', options: ['Removing redundancy', 'Adding data', 'Deleting records', 'None'], ans: 'Removing redundancy' },
    { q: 'Primary key?', options: ['Unique identifier', 'Foreign key', 'Duplicate key', 'Null key'], ans: 'Unique identifier' },
    { q: 'Retrieve data command?', options: ['SELECT', 'UPDATE', 'INSERT', 'DELETE'], ans: 'SELECT' },
    { q: 'ACID stands for?', options: ['Atomicity, Consistency, Isolation, Durability', 'Action, Control, Include, Delete', 'Atomicity, Connection, Input, Data', 'None of these'], ans: 'Atomicity, Consistency, Isolation, Durability' },
    { q: 'NoSQL database?', options: ['MongoDB', 'MySQL', 'Oracle', 'PostgreSQL'], ans: 'MongoDB' },
    { q: 'DDL?', options: ['Data Definition Language', 'Data Description Language', 'Data Design Language', 'Data Declaration Language'], ans: 'Data Definition Language' },
    { q: 'Foreign key?', options: ['Primary key from another table', 'Primary key', 'Unique key', 'Simple key'], ans: 'Primary key from another table' },
    { q: 'Not a SQL command?', options: ['TRUNCATE', 'DELETE', 'INSERT', 'PUBLISH'], ans: 'PUBLISH' },
    { q: 'Transaction?', options: ['Sequence of operations', 'Single operation', 'Query', 'Command'], ans: 'Sequence of operations' }
  ],
};

function renderQuiz() {
  let subjects = Object.keys(quizData);
  let tabHTML = '';
  subjects.forEach((subj, i) => {
    tabHTML += `<button class="${i == 0 ? 'active' : ''}" onclick="selectQuizTab('${subj}', this)">${subj}</button>`;
  });
  document.getElementById('quizTabs').innerHTML = tabHTML;
  selectQuizTab(subjects[0], document.querySelector('#quizTabs button'));
}

function selectQuizTab(subject, btn) {
  document.querySelectorAll('#quizTabs button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  let qArr = quizData[subject];
  if (!qArr || !qArr.length) {
    document.getElementById('quizSectionContent').innerHTML = 'No questions yet.';
    return;
  }
  let out = `<form class="quiz-mcq" onsubmit="event.preventDefault(); submitQuizAnswers('${subject}')">`;
  qArr.forEach((qObj, idx) => {
    const optionsHTML = qObj.options.map(opt =>
      `<label><input type="radio" name="q${idx}" value="${opt}" required> ${opt}</label>`
    ).join('');
    out += `<div class="quiz-q"><strong>Q${idx+1}:</strong> ${qObj.q}</div>${optionsHTML}<hr>`;
  });
  out += `<button type="submit" style="margin-top:0.6em;">Submit All</button></form><div id="quiz-result" class="quiz-result"></div>`;
  document.getElementById('quizSectionContent').innerHTML = out;
}

function submitQuizAnswers(subject) {
  let qArr = quizData[subject];
  let score = 0;
  let total = qArr.length;
  for(let i=0; i<total; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if(selected && selected.value === qArr[i].ans) score++;
  }
  document.getElementById('quiz-result').innerText = `You scored ${score} out of ${total}!`;
}

// On page load
renderNotes();


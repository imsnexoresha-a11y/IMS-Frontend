import { USE_MOCK, mockResponse } from './mockHelpers';
import apiClient from './apiClient';
import {
  mockTeachers, mockBatches, mockTopics, mockLectures,
  mockAttendance, mockQuizResults, mockStudents
} from './mockData';

// ── Profile ──
export async function getTeacherProfile() {
  if (!USE_MOCK) {
    const raw = await apiClient.get('/instructor/profile');
    return {
      ...raw,
      name: raw.userId?.name || '',
      email: raw.userId?.email || '',
      phone: raw.userId?.mobileNo || '',
    };
  }
  return mockResponse(mockTeachers[0]);
}

export async function updateTeacherProfile(data) {
  if (!USE_MOCK) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return apiClient.put('/instructor/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return mockResponse({ ...mockTeachers[0], ...data });
}

// ── Batches ──
export async function getTeacherBatches() {
  if (!USE_MOCK) {
    return apiClient.get('/instructor/batches');
  }
  return mockResponse(mockBatches.filter((b) => b.teacherId === 'teacher-001'));
}

// ── Topics ──
export async function getTopics(batchId) {
  if (!USE_MOCK) {
    const raw = await apiClient.get(`/instructor/topics/${batchId}`);
    return raw.map(topic => ({
      ...topic,
      id: topic._id || topic.id,
      notes: (topic.notesFiles || []).map((fileUrl) => {
        const parts = fileUrl.split('/');
        const filename = parts[parts.length - 1] || 'Document.pdf';
        return {
          id: filename,
          filename,
          uploadedAt: null
        };
      }),
      notesCount: (topic.notesFiles || []).length,
      completed: false
    }));
  }
  const topics = mockTopics.filter((t) => t.batchId === batchId);
  topics.forEach(t => {
    if (!t.notes) {
      t.notes = Array.from({ length: t.notesCount || 0 }, (_, i) => ({
        id: `note-${t.id}-${i}`,
        filename: i === 0 ? 'Lecture-Slides.pdf' : 'Reading-Materials.docx',
        uploadedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      }));
    }
  });
  return mockResponse(topics);
}

export async function createTopic(batchId, data) {
  if (!USE_MOCK) {
    const formData = new FormData();
    formData.append('batchId', batchId);
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('estimatedHours', String(data.estimatedHours || 0));
    if (data.learningObjectives) {
      formData.append('learningObjectives', JSON.stringify(data.learningObjectives));
    }
    return apiClient.post('/instructor/topics', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  const newTopic = {
    id: 'topic-' + Date.now(),
    batchId,
    title: data.title,
    description: data.description || '',
    estimatedHours: data.estimatedHours || 0,
    learningObjectives: data.learningObjectives || [],
    order: mockTopics.filter(t => t.batchId === batchId).length + 1,
    lectureCount: 0,
    notesCount: 0,
    notes: [],
    completed: false
  };
  mockTopics.push(newTopic);
  return mockResponse(newTopic);
}

export async function updateTopic(batchId, topicId, data) {
  if (!USE_MOCK) {
    return apiClient.put(`/instructor/topics/${topicId}`, data);
  }
  const topic = mockTopics.find((t) => t.id === topicId);
  if (topic) {
    topic.title = data.title;
    topic.description = data.description || '';
    topic.estimatedHours = data.estimatedHours || 0;
    topic.learningObjectives = data.learningObjectives || [];
  }
  return mockResponse(topic);
}

export async function deleteTopic(batchId, topicId) {
  if (!USE_MOCK) {
    return apiClient.delete(`/instructor/topics/${topicId}`);
  }
  const index = mockTopics.findIndex((t) => t.id === topicId);
  if (index !== -1) {
    mockTopics.splice(index, 1);
  }
  return mockResponse({ success: true });
}

export async function reorderTopics(batchId, orderedIds) {
  if (!USE_MOCK) {
    return apiClient.patch('/instructor/topics/reorder', { topicIds: orderedIds });
  }
  orderedIds.forEach((id, idx) => {
    const topic = mockTopics.find((t) => t.id === id);
    if (topic) {
      topic.order = idx + 1;
    }
  });
  return mockResponse({ success: true });
}

export async function uploadTopicNotes(batchId, topicId, formData) {
  if (!USE_MOCK) {
    return apiClient.post(`/instructor/topics/${topicId}/notes`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  const topic = mockTopics.find((t) => t.id === topicId);
  if (topic) {
    if (!topic.notes) topic.notes = [];
    const newNote = {
      id: 'note-' + Date.now(),
      filename: formData?.get?.('file')?.name || 'notes-document.pdf',
      uploadedAt: new Date().toISOString()
    };
    topic.notes.push(newNote);
    topic.notesCount = topic.notes.length;
    return mockResponse(newNote);
  }
  return mockResponse(null);
}

export async function deleteTopicNote(batchId, topicId, fileId) {
  if (!USE_MOCK) {
    return apiClient.delete(`/instructor/topics/${topicId}/notes/${fileId}`);
  }
  const topic = mockTopics.find((t) => t.id === topicId);
  if (topic && topic.notes) {
    topic.notes = topic.notes.filter(n => n.id !== fileId);
    topic.notesCount = topic.notes.length;
  }
  return mockResponse({ success: true });
}

// Timezone conversion helpers to normalize local inputs to UTC equivalents for backend comparison checks
function convertLocalToUtcTime(isoDateTimeStr, timeStr) {
  if (!timeStr || !isoDateTimeStr) return timeStr || '';
  const datePart = isoDateTimeStr.split('T')[0];
  const localDate = new Date(`${datePart}T${timeStr}:00`);
  if (isNaN(localDate.getTime())) return timeStr;

  const utcHours = String(localDate.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, '0');
  return `${utcHours}:${utcMinutes}`;
}

function convertUtcToLocalTime(isoDateTimeStr, utcTimeStr) {
  if (!utcTimeStr || !isoDateTimeStr) return utcTimeStr || '';
  const datePart = isoDateTimeStr.split('T')[0];
  const parts = datePart.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);

  const [utcHours, utcMinutes] = utcTimeStr.split(':').map(Number);
  const dateUtc = new Date(Date.UTC(year, month, day, utcHours, utcMinutes, 0));
  if (isNaN(dateUtc.getTime())) return utcTimeStr;

  const localHours = String(dateUtc.getHours()).padStart(2, '0');
  const localMinutes = String(dateUtc.getMinutes()).padStart(2, '0');
  return `${localHours}:${localMinutes}`;
}

// ── Lectures ──
export async function getLectures(batchId) {
  if (!USE_MOCK) {
    const raw = await apiClient.get(`/instructor/sessions/${batchId}`);
    return raw.map(session => {
      const datePart = session.sessionDateAndTime || session.date;
      return {
        ...session,
        id: session._id || session.id,
        topicId: session.topicIds?.[0] || '',
        status: session.status === 'In Progress' ? 'in_progress' : session.status,
        startTime: convertUtcToLocalTime(datePart, session.startTime),
        endTime: convertUtcToLocalTime(datePart, session.endTime),
        half1EndTime: convertUtcToLocalTime(datePart, session.half1EndTime),
      };
    });
  }
  const lectures = mockLectures.filter((l) => l.batchId === batchId);
  lectures.forEach(l => {
    if (!l.startTime) l.startTime = '09:00';
    if (!l.endTime) l.endTime = '11:00';
    if (!l.half1EndTime) l.half1EndTime = '10:00';
    if (!l.meetUrl) l.meetUrl = 'https://meet.google.com/abc-defg-hij';
    if (!l.assignmentTitle) l.assignmentTitle = 'Assignment: ' + l.title;
    if (!l.assignmentDescription) l.assignmentDescription = 'Please complete the task detailed during the lecture.';
    if (!l.assignmentDeadline) {
      const d = new Date(l.date || l.sessionDateAndTime);
      d.setHours(d.getHours() + 24); // default deadline +24 hours
      l.assignmentDeadline = d.toISOString().slice(0, 16);
    }
  });
  return mockResponse(lectures);
}

export async function createLecture(batchId, data) {
  if (!USE_MOCK) {
    const datePart = data.sessionDateAndTime;
    const payload = {
      ...data,
      batchId,
      startTime: convertLocalToUtcTime(datePart, data.startTime),
      endTime: convertLocalToUtcTime(datePart, data.endTime),
      half1EndTime: convertLocalToUtcTime(datePart, data.half1EndTime),
    };
    return apiClient.post('/instructor/sessions', payload);
  }
  const newLec = {
    id: 'lec-' + Date.now(),
    batchId,
    status: 'scheduled',
    attendanceCount: null,
    avgQuizScore: null,
    avgAssignmentScore: null,
    date: data.sessionDateAndTime, // set fallback date key
    ...data,
  };
  mockLectures.push(newLec);
  return mockResponse(newLec);
}

export async function updateLecture(batchId, lectureId, data) {
  if (!USE_MOCK) {
    const datePart = data.sessionDateAndTime;
    const payload = {
      ...data,
      status: data.status === 'in_progress' ? 'In Progress' : data.status,
      startTime: convertLocalToUtcTime(datePart, data.startTime),
      endTime: convertLocalToUtcTime(datePart, data.endTime),
      half1EndTime: convertLocalToUtcTime(datePart, data.half1EndTime),
    };
    return apiClient.put(`/instructor/sessions/${lectureId}`, payload);
  }
  const idx = mockLectures.findIndex((l) => l.id === lectureId);
  if (idx !== -1) {
    mockLectures[idx] = { ...mockLectures[idx], ...data };
    return mockResponse(mockLectures[idx]);
  }
  return mockResponse(null);
}

export async function updateLectureStatus(batchId, lectureId, status) {
  if (!USE_MOCK) {
    const backendStatus = status === 'in_progress' ? 'In Progress' : status;
    return apiClient.patch(`/instructor/sessions/${lectureId}/status`, { status: backendStatus });
  }
  const lec = mockLectures.find((l) => l.id === lectureId);
  if (lec) {
    lec.status = status;
  }
  return mockResponse(lec);
}

export async function deleteLecture(batchId, lectureId) {
  if (!USE_MOCK) {
    return apiClient.delete(`/instructor/sessions/${lectureId}`);
  }
  const idx = mockLectures.findIndex((l) => l.id === lectureId);
  if (idx !== -1) {
    mockLectures.splice(idx, 1);
  }
  return mockResponse({ success: true });
}

// ── Attendance & Quiz JSON Upload ──
export async function uploadAttendanceCSV(batchId, lectureId, attendanceData) {
  if (!USE_MOCK) {
    if (attendanceData === null) {
      return apiClient.get(`/teacher/lectures/${lectureId}/attendance`);
    }
    return apiClient.post(`/teacher/lectures/${lectureId}/attendance`, attendanceData);
  }
  if (attendanceData && Array.isArray(attendanceData.attendance)) {
    // Clear existing attendance for this lecture
    const cleanMock = mockAttendance.filter(a => a.lectureId !== lectureId);
    mockAttendance.length = 0;
    mockAttendance.push(...cleanMock);

    // Map new attendance
    attendanceData.attendance.forEach(row => {
      const email = row.student_email || row.email;
      const student = mockStudents.find(s => s.email === email);
      const status = row.first_half && row.second_half ? 'present' : (row.first_half || row.second_half ? 'late' : 'absent');
      if (student) {
        mockAttendance.push({
          studentId: student.id,
          studentName: student.name,
          lectureId,
          status
        });
      }
    });

    // Update lecture attendance count
    const lecture = mockLectures.find(l => l.id === lectureId);
    if (lecture) {
      lecture.attendanceCount = mockAttendance.filter(a => a.lectureId === lectureId && a.status !== 'absent').length;
    }
  }

  return mockResponse({
    processed: mockAttendance.filter(a => a.lectureId === lectureId).length,
    results: mockAttendance.filter(a => a.lectureId === lectureId),
    errors: [],
  });
}

export async function uploadQuizCSV(batchId, lectureId, quizData) {
  if (!USE_MOCK) {
    if (quizData === null) {
      return apiClient.get(`/teacher/lectures/${lectureId}/quiz`);
    }
    return apiClient.post(`/teacher/lectures/${lectureId}/quiz`, quizData);
  }
  if (quizData && Array.isArray(quizData.quiz)) {
    // Clear existing quiz results for this lecture
    const cleanMock = mockQuizResults.filter(q => q.lectureId !== lectureId);
    mockQuizResults.length = 0;
    mockQuizResults.push(...cleanMock);

    quizData.quiz.forEach(row => {
      const email = row.student_email || row.email;
      const student = mockStudents.find(s => s.email === email);
      if (student) {
        mockQuizResults.push({
          studentId: student.id,
          studentName: student.name,
          lectureId,
          score: row.score,
          maxScore: 5
        });
      }
    });

    // Update lecture quiz average
    const lecture = mockLectures.find(l => l.id === lectureId);
    if (lecture) {
      const results = mockQuizResults.filter(q => q.lectureId === lectureId);
      if (results.length > 0) {
        const sum = results.reduce((acc, q) => acc + q.score, 0);
        lecture.avgQuizScore = (sum / results.length) * 20; // scale 0-5 to 0-100 percentage
      }
    }
  }

  return mockResponse({
    processed: mockQuizResults.filter(q => q.lectureId === lectureId).length,
    results: mockQuizResults.filter(q => q.lectureId === lectureId),
    errors: [],
  });
}

// ── Summaries ──
export async function getBatchSummary(batchId) {
  if (!USE_MOCK) {
    return apiClient.get('/instructor/dashboard');
  }
  const batch = mockBatches.find((b) => b.id === batchId) || mockBatches[0];
  return mockResponse({
    batchName: batch.name,
    totalStudents: batch.studentCount,
    totalLectures: batch.lectureCount,
    avgAttendance: 91.5,
    avgQuizScore: 78.9,
    avgAssignmentScore: 79.0,
    completedTopics: 2,
    totalTopics: 6,
  });
}

export async function getLectureSummary(batchId, lectureId) {
  if (!USE_MOCK) {
    return apiClient.get(`/instructor/sessions/summary/${lectureId}`);
  }
  const lecture = mockLectures.find((l) => l.id === lectureId) || mockLectures[0];
  return mockResponse({
    lectureTitle: lecture.title,
    attendanceCount: lecture.attendanceCount || 0,
    totalStudents: 6,
    avgQuizScore: lecture.avgQuizScore || 0,
    avgAssignmentScore: lecture.avgAssignmentScore || 0,
  });
}

export async function getCourses() {
  if (!USE_MOCK) {
    return apiClient.get('/instructor/courses');
  }
  return mockResponse([{ id: 'course-001', name: 'Web Development', batchId: 'batch-001' }]);
}

export async function createCourse(data) {
  if (!USE_MOCK) {
    return apiClient.post('/instructor/courses', data);
  }
  const newCourse = {
    id: 'course-' + Date.now(),
    name: data.name,
    batchId: data.batchId
  };
  return mockResponse(newCourse);
}

export async function getBatchStudents(batchId) {
  if (!USE_MOCK) {
    return apiClient.get(`/instructor/students/${batchId}`);
  }
  const students = mockStudents.filter((s) => s.batchId === batchId);
  return mockResponse(students.map(s => ({ student: s, ledger: [] })));
}

export async function getTeacherDashboardStats() {
  if (!USE_MOCK) {
    return apiClient.get('/instructor/dashboard');
  }
  return mockResponse({
    upcomingSessions: mockLectures.filter(l => l.status === 'scheduled'),
    pendingAttendance: mockLectures.filter(l => l.status === 'completed' && l.attendanceCount === null),
    pendingQuiz: mockLectures.filter(l => l.status === 'completed' && l.avgQuizScore === null),
  });
}

/**
 * Automated End-to-End API Integration & Verification Suite
 * Tests all requirements against the running server at http://127.0.0.1:5173 (via Vite Proxy)
 * and http://127.0.0.1:8000 (FastAPI Backend directly).
 */

const BASE_URL = 'http://127.0.0.1:5173/api';

async function runTests() {
  console.log('--- Starting Student Management API Integration Verification ---\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  try {
    // 1. Health status check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'GET /health returns HTTP 200');
    assert(healthData.status === 'ok' && healthData.database === 'connected', 'Database is reported as connected');

    // 2. Create student
    const testId = `STU_TEST_${Date.now().toString().slice(-4)}`;
    const studentPayload = {
      student_id: testId,
      full_name: 'Ananya Sharma',
      date_of_birth: '2003-04-18',
      email: 'ananya.sharma@example.com',
      phone: '+91 98765 43210',
      course: 'Computer Science',
      address: '74 Civil Lines, Jaipur',
      enrollment_date: '2024-08-01',
    };

    const createRes = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentPayload),
    });
    const createdData = await createRes.json();
    assert(createRes.status === 201, `POST /students creates student (HTTP 201)`);
    assert(createdData.student_id === testId, `Returned student_id matches created ID '${testId}'`);
    assert(createdData.full_name === 'Ananya Sharma', `Returned full_name matches '${createdData.full_name}'`);

    // 3. Duplicate student ID check (409)
    const duplicateRes = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentPayload),
    });
    const dupData = await duplicateRes.json();
    assert(duplicateRes.status === 409, 'POST /students with duplicate ID returns HTTP 409 Conflict');
    assert(dupData.detail && dupData.detail.includes(testId), 'Conflict error specifies duplicate student ID');

    // 4. Missing contact validation (422)
    const noContactPayload = {
      student_id: `${testId}_NC`,
      full_name: 'No Contact Student',
      date_of_birth: '2004-01-01',
    };
    const noContactRes = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noContactPayload),
    });
    assert(noContactRes.status === 422, 'POST /students without email or phone returns HTTP 422');

    // 5. Retrieve created student
    const getRes = await fetch(`${BASE_URL}/students/${testId}`);
    const getData = await getRes.json();
    assert(getRes.status === 200, `GET /students/${testId} returns HTTP 200`);
    assert(getData.email === 'ananya.sharma@example.com', 'Retrieved student has accurate email');

    // 6. Partial update (PATCH)
    const patchRes = await fetch(`${BASE_URL}/students/${testId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course: 'Data Science & Machine Learning' }),
    });
    const patchData = await patchRes.json();
    assert(patchRes.status === 200, `PATCH /students/${testId} returns HTTP 200`);
    assert(patchData.course === 'Data Science & Machine Learning', 'Course updated successfully');
    assert(patchData.email === 'ananya.sharma@example.com', 'Existing email was preserved during patch');
    assert(patchData.phone === '+91 98765 43210', 'Existing phone was preserved during patch');

    // 7. Filtering by name and course
    const filterNameRes = await fetch(`${BASE_URL}/students?name=Ananya`);
    const filterNameData = await filterNameRes.json();
    assert(filterNameRes.status === 200, 'GET /students?name=Ananya returns HTTP 200');
    assert(filterNameData.some((s) => s.student_id === testId), 'Filtered list contains created student');

    const filterCourseRes = await fetch(`${BASE_URL}/students?course=Data%20Science`);
    const filterCourseData = await filterCourseRes.json();
    assert(filterCourseRes.status === 200, 'GET /students?course=Data%20Science returns HTTP 200');
    assert(filterCourseData.some((s) => s.student_id === testId), 'Course filter correctly matched student');

    // 8. Delete student
    const deleteRes = await fetch(`${BASE_URL}/students/${testId}`, {
      method: 'DELETE',
    });
    assert(deleteRes.status === 204, `DELETE /students/${testId} returns HTTP 204 No Content`);

    // 9. Confirm deletion (404)
    const notFoundRes = await fetch(`${BASE_URL}/students/${testId}`);
    assert(notFoundRes.status === 404, `GET /students/${testId} returns HTTP 404 after deletion`);

    console.log(`\nResults: ${passed}/${total} checks passed successfully.`);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exitCode = 1;
  }
}

runTests();

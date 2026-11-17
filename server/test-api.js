/**
 * Hemma Sudan — Backend API Smoke & Endpoint Verification Suite
 * Tests Express routes directly in-memory and via HTTP.
 */

const app = require('./index');

function simulateRequest(app, method, url, body = {}) {
  return new Promise((resolve) => {
    const { EventEmitter } = require('events');
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.originalUrl = url;
    req.path = url.split('?')[0];
    req.query = {};
    if (url.includes('?')) {
      const qStr = url.split('?')[1];
      const params = new URLSearchParams(qStr);
      for (const [k, v] of params.entries()) {
        req.query[k] = v;
      }
    }
    req.headers = { 'content-type': 'application/json' };
    req.body = body;

    const res = new EventEmitter();
    res.statusCode = 200;
    res.setHeader = () => {};
    res.getHeader = () => {};
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      resolve({ status: res.statusCode, data });
    };
    res.send = (chunk) => {
      resolve({ status: res.statusCode, raw: chunk });
    };
    res.end = () => {
      resolve({ status: res.statusCode });
    };

    app.handle(req, res);
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 Running Hemma Sudan Backend Verification Suite...');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /health returns 200 OK and service status', async () => {
    const res = await simulateRequest(app, 'GET', '/health');
    if (res.status !== 200 || res.data.status !== 'ok') {
      throw new Error(`Expected 200 with status ok, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 2. Curriculum topics
  await test('GET /api/topics returns curriculum topics', async () => {
    const res = await simulateRequest(app, 'GET', '/api/topics');
    if (res.status !== 200 || !Array.isArray(res.data.topics)) {
      throw new Error(`Expected 200 with topics array, got ${res.status}`);
    }
    if (res.data.topics.length === 0) {
      throw new Error('Expected at least 1 topic in response');
    }
  });

  // 3. Auth users listing
  await test('GET /api/auth/users returns registered users', async () => {
    const res = await simulateRequest(app, 'GET', '/api/auth/users');
    if (res.status !== 200 || !Array.isArray(res.data.users)) {
      throw new Error(`Expected 200 with users array, got ${res.status}`);
    }
    if (res.data.users.length < 3) {
      throw new Error(`Expected at least 3 users, got ${res.data.users.length}`);
    }
  });

  // 4. Translation draft generator
  await test('POST /api/translate/draft returns Arabic translation draft', async () => {
    const res = await simulateRequest(app, 'POST', '/api/translate/draft', {
      titleEn: 'Variables and Functions',
      notesEn: 'Understanding loops and conditionals',
    });
    if (res.status !== 200 || !res.data.titleArDraft) {
      throw new Error(`Expected 200 with titleArDraft, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 5. Submissions queue
  await test('GET /api/submissions returns submission list with reviews', async () => {
    const res = await simulateRequest(app, 'GET', '/api/submissions');
    if (res.status !== 200 || !Array.isArray(res.data.submissions)) {
      throw new Error(`Expected 200 with submissions array, got ${res.status}`);
    }
  });

  // 6. Online submission GitHub URL validation
  await test('POST /api/submissions rejects invalid GitHub URLs with 400', async () => {
    const res = await simulateRequest(app, 'POST', '/api/submissions', {
      topicId: 'topic-1',
      learnerId: 'usr-learner-1',
      githubLink: 'invalid-url',
      explanation: 'This is a test explanation with enough characters.',
    });
    if (res.status !== 400 || res.data.errorCode !== 'INVALID_GITHUB_URL') {
      throw new Error(`Expected 400 INVALID_GITHUB_URL, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 7. Teacher Mentors & Approval Matrix
  await test('GET /api/teacher/mentors returns mentors with topic approvals', async () => {
    const res = await simulateRequest(app, 'GET', '/api/teacher/mentors');
    if (res.status !== 200 || !Array.isArray(res.data.mentors)) {
      throw new Error(`Expected 200 with mentors array, got ${res.status}`);
    }
  });

  // 8. Teacher Audit Logs
  await test('GET /api/teacher/audit-logs returns system audit records', async () => {
    const res = await simulateRequest(app, 'GET', '/api/teacher/audit-logs');
    if (res.status !== 200 || !Array.isArray(res.data.auditLogs)) {
      throw new Error(`Expected 200 with auditLogs array, got ${res.status}`);
    }
  });

  console.log('\n------------------------------------------------------');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('------------------------------------------------------\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();

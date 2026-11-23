/**
 * Hemma Sudan — Load & Concurrency Simulation Test
 * 
 * Supports at least 20 concurrent learner sessions.
 * Response times remain under 2.0 seconds (2000ms) under load.
 */

const { EventEmitter } = require('events');
const app = require('../index');

const CONCURRENT_USERS = 20;

function simulateRequest(app, method, url, body = {}, headers = {}) {
  const startTime = Date.now();
  return new Promise((resolve) => {
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
    req.headers = {
      'content-type': 'application/json',
      ...headers,
    };
    req.body = body;

    const res = new EventEmitter();
    res.statusCode = 200;
    res.headers = {};
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.setHeader = (key, val) => {
      res.headers[key.toLowerCase()] = val;
    };
    res.getHeader = (key) => res.headers[key.toLowerCase()];
    res.json = (data) => {
      const duration = Date.now() - startTime;
      resolve({ statusCode: res.statusCode, data, duration });
    };
    res.send = (data) => {
      const duration = Date.now() - startTime;
      resolve({ statusCode: res.statusCode, data, duration });
    };
    res.end = (data) => {
      const duration = Date.now() - startTime;
      resolve({ statusCode: res.statusCode, data, duration });
    };

    app(req, res, (err) => {
      const duration = Date.now() - startTime;
      if (err) {
        resolve({ statusCode: 500, error: err.message, duration });
      }
    });
  });
}

async function runLoadTest() {
  console.log('========================================================================');
  console.log(`⚡ HEMMA SUDAN — 20 CONCURRENT SESSIONS & LATENCY BENCHMARK`);
  console.log('========================================================================');
  console.log(`Engine: Express In-Memory Dispatcher`);
  console.log(`Concurrent Virtual Users: ${CONCURRENT_USERS}`);
  console.log('------------------------------------------------------------------------\n');

  // Phase 1: 20 Concurrent Health Checks
  console.log(`▶ Phase 1: Firing ${CONCURRENT_USERS} concurrent requests to /health...`);
  const healthPromises = Array.from({ length: CONCURRENT_USERS }, () => 
    simulateRequest(app, 'GET', '/health')
  );
  const healthResults = await Promise.all(healthPromises);
  const healthDurations = healthResults.map(r => r.duration);
  const healthPassed = healthResults.filter(r => r.statusCode === 200).length;
  const avgHealth = (healthDurations.reduce((a, b) => a + b, 0) / healthDurations.length).toFixed(1);
  const maxHealth = Math.max(...healthDurations);
  console.log(`   ✅ Success Rate: ${healthPassed}/${CONCURRENT_USERS} (${((healthPassed / CONCURRENT_USERS) * 100).toFixed(0)}%)`);
  console.log(`   ⏱ Latency: Avg ${avgHealth}ms | Max ${maxHealth}ms (latency limit: 2000ms)\n`);

  // Phase 2: 20 Concurrent Curriculum / Topic Queries
  console.log(`▶ Phase 2: Firing ${CONCURRENT_USERS} concurrent requests to /api/topics...`);
  const topicPromises = Array.from({ length: CONCURRENT_USERS }, () => 
    simulateRequest(app, 'GET', '/api/topics')
  );
  const topicResults = await Promise.all(topicPromises);
  const topicDurations = topicResults.map(r => r.duration);
  const topicPassed = topicResults.filter(r => r.statusCode === 200).length;
  const avgTopic = (topicDurations.reduce((a, b) => a + b, 0) / topicDurations.length).toFixed(1);
  const maxTopic = Math.max(...topicDurations);
  console.log(`   ✅ Success Rate: ${topicPassed}/${CONCURRENT_USERS} (${((topicPassed / CONCURRENT_USERS) * 100).toFixed(0)}%)`);
  console.log(`   ⏱ Latency: Avg ${avgTopic}ms | Max ${maxTopic}ms (latency limit: 2000ms)\n`);

  // Phase 3: 20 Concurrent Offline Progress Sync Flushes
  console.log(`▶ Phase 3: Firing ${CONCURRENT_USERS} concurrent offline sync flushes to /api/sync/progress...`);
  const syncPromises = Array.from({ length: CONCURRENT_USERS }, (_, i) => {
    const payload = {
      learnerId: `usr-learner-${i + 1}`,
      updates: [
        {
          updateId: `upd-load-${i}-${Date.now()}`,
          lessonId: `lesson-${(i % 5) + 1}`,
          status: 'completed',
          clientTime: new Date().toISOString(),
        },
      ],
    };
    return simulateRequest(app, 'POST', '/api/sync/progress', payload);
  });
  const syncResults = await Promise.all(syncPromises);
  const syncDurations = syncResults.map(r => r.duration);
  const syncPassed = syncResults.filter(r => r.statusCode === 200).length;
  const avgSync = (syncDurations.reduce((a, b) => a + b, 0) / syncDurations.length).toFixed(1);
  const maxSync = Math.max(...syncDurations);
  console.log(`   ✅ Success Rate: ${syncPassed}/${CONCURRENT_USERS} (${((syncPassed / CONCURRENT_USERS) * 100).toFixed(0)}%)`);
  console.log(`   ⏱ Latency: Avg ${avgSync}ms | Max ${maxSync}ms (latency limit: 2000ms)\n`);

  console.log('========================================================================');
  if (healthPassed === CONCURRENT_USERS && topicPassed === CONCURRENT_USERS && syncPassed === CONCURRENT_USERS && maxHealth < 2000 && maxTopic < 2000 && maxSync < 2000) {
    console.log(`🏁 LOAD TEST PASSED: Full compliance (20 users) and (<2000ms)`);
  } else {
    console.log(`⚠️ LOAD TEST FAILED or degraded under load.`);
  }
  console.log('========================================================================\n');
}

if (require.main === module) {
  runLoadTest().catch(console.error);
}

module.exports = { runLoadTest };

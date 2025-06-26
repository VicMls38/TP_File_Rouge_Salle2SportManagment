import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '2m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1200'],
    http_req_failed: ['rate<0.02'],
  },
};

// Stress test : création de comptes utilisateurs en montée progressive
export default function () {
  const payload = JSON.stringify({
    email: `user${Math.floor(Math.random()*100000)}@mail.com`,
    password: 'password',
    name: 'Test User'
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  let res = http.post('http://localhost:3000/api/auth/register', payload, params);
  check(res, { 'status 201': (r) => r.status === 201 || r.status === 409 }); // 409 si déjà existant
  sleep(0.5);
}

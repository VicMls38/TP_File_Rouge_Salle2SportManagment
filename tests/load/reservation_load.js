import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
  },
};

// Simule 100 utilisateurs qui réservent un cours en même temps
export default function () {
  const payload = JSON.stringify({
    userId: Math.floor(Math.random() * 1000),
    classId: 1,
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  let res = http.post('http://localhost:3000/api/bookings', payload, params);
  check(res, { 'status 201': (r) => r.status === 201 });
  sleep(1);
}

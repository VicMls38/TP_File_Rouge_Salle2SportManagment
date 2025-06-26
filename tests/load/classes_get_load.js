import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
  },
};

// Load test : 50 utilisateurs consultent la liste des cours en même temps
export default function () {
  let res = http.get('http://localhost:3000/api/classes');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}

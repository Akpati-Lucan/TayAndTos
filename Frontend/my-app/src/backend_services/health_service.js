// services/backend/healthService.js
import { axiosInstance, BACKEND_URL } from './config.js';

class HealthService {
  constructor() {
    this.isAvailable = false;
    this.lastCheck = null;
    this.interval = null;
  }

  async check() {
    try {
      const res = await axiosInstance.get('/health');
      this.isAvailable = res.status === 200;
      this.lastCheck = new Date();
      return this.isAvailable;
    } catch {
      this.isAvailable = false;
      return false;
    }
  }

  start(intervalMs = 30000) {
    this.stop();
    this.check();
    this.interval = setInterval(() => this.check(), intervalMs);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  getStatus() {
    return { isAvailable: this.isAvailable, lastCheck: this.lastCheck, url: BACKEND_URL };
  }

  async testBackendConnection() {
    return this.check();
  }

  startHealthChecks(intervalMs = 30000) {
    this.start(intervalMs);
  }

  stopHealthChecks() {
    this.stop();
  }
}

export default new HealthService();

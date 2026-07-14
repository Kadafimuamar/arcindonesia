import type { DashboardRepository } from "@/repositories/contracts";

export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async getStats() {
    return this.repository.getStats();
  }
}

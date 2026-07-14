import { subHours } from "date-fns";
import { normalizePagination } from "@/lib/utils/pagination";
import { commentInputSchema } from "@/lib/validation/comment";
import { getServerEnv } from "@/lib/utils/env";
import type { CommentsRepository } from "@/repositories/contracts";

export class CommentsService {
  constructor(private readonly repository: CommentsRepository) {}

  async listVisible(postId: string, page?: number | string, pageSize?: number | string) {
    const pagination = normalizePagination(page, pageSize);
    return this.repository.listVisibleForPost(postId, pagination.page, pagination.pageSize);
  }

  async listAdmin(input: {
    page?: number | string;
    pageSize?: number | string;
    q?: string;
    status?: "visible" | "hidden";
    postId?: string;
  }) {
    const pagination = normalizePagination(input.page, input.pageSize);
    return this.repository.listAdmin({
      ...pagination,
      query: input.q?.trim() || undefined,
      status: input.status,
      postId: input.postId,
    });
  }

  async create(postId: string, input: unknown, ipHash: string) {
    const payload = commentInputSchema.parse(input);

    if (payload.website) {
      throw new Error("Permintaan tidak valid.");
    }

    const limit = getServerEnv().commentRateLimitPerHour;
    const count = await this.repository.countRecentByIpHash(ipHash, subHours(new Date(), 1).toISOString());

    if (count >= limit) {
      throw new Error("Batas komentar per jam telah tercapai. Silakan coba lagi nanti.");
    }

    return this.repository.create({
      postId,
      authorName: payload.authorName.replace(/\s+/g, " ").trim(),
      authorEmail: payload.authorEmail.trim().toLowerCase(),
      content: payload.content.replace(/\s+/g, " ").trim(),
      ipHash,
    });
  }

  async setStatus(id: string, status: "visible" | "hidden") {
    return this.repository.setStatus(id, status);
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }
}

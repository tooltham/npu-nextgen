import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth-guards
vi.mock("@/lib/auth-guards", () => ({
  verifyStaff: vi.fn().mockResolvedValue({
    success: true,
    user: { id: "admin-id", role: "ADMIN", email: "admin@test.com" },
  }),
}));

// Mock Prisma
const prismaMock = vi.hoisted(() => ({
  courseModule: {
    findMany: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  lesson: {
    findMany: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({
  default: prismaMock,
}));

import {
  GET as getModules,
  POST as createModule,
} from "@/app/api/staff/courses/modules/route";
import { POST as createLesson } from "@/app/api/staff/courses/modules/[moduleId]/lessons/route";

describe("Course Builder API (Modules)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get modules", async () => {
    prismaMock.courseModule.findMany.mockResolvedValue([
      { id: "mod1", title: "Module 1", order: 0 },
    ]);

    const req = new Request("http://localhost/api/staff/courses/modules");
    const res = await getModules();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe("Module 1");
  });

  it("should create module", async () => {
    prismaMock.courseModule.create.mockResolvedValue({
      id: "mod2",
      title: "New Module",
      order: 1,
    });

    const req = new Request("http://localhost/api/staff/courses/modules", {
      method: "POST",
      body: JSON.stringify({ title: "New Module", order: 1 }),
    });
    const res = await createModule(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe("mod2");
  });

  it("should fail module creation on invalid data", async () => {
    const req = new Request("http://localhost/api/staff/courses/modules", {
      method: "POST",
      body: JSON.stringify({ order: -1 }), // missing title, invalid order
    });
    const res = await createModule(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});

describe("Course Builder API (Lessons)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create lesson", async () => {
    prismaMock.courseModule.findUnique.mockResolvedValue({ id: "mod1" });
    prismaMock.lesson.create.mockResolvedValue({
      id: "les1",
      moduleId: "mod1",
      title: "New Lesson",
      order: 0,
    });

    const req = new Request(
      "http://localhost/api/staff/courses/modules/mod1/lessons",
      {
        method: "POST",
        body: JSON.stringify({ title: "New Lesson", order: 0, type: "VIDEO" }),
      },
    );
    const res = await createLesson(req, {
      params: Promise.resolve({ moduleId: "mod1" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.title).toBe("New Lesson");
  });

  it("should create lesson with theory and practical hours", async () => {
    prismaMock.courseModule.findUnique.mockResolvedValue({ id: "mod1" });
    prismaMock.lesson.create.mockResolvedValue({
      id: "les1",
      moduleId: "mod1",
      title: "New Lesson",
      order: 0,
      theoryHours: 1.5,
      practicalHours: 4.5,
    });

    const req = new Request(
      "http://localhost/api/staff/courses/modules/mod1/lessons",
      {
        method: "POST",
        body: JSON.stringify({
          title: "New Lesson",
          order: 0,
          type: "VIDEO",
          theoryHours: 1.5,
          practicalHours: 4.5,
        }),
      },
    );
    const res = await createLesson(req, {
      params: Promise.resolve({ moduleId: "mod1" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.theoryHours).toBe(1.5);
    expect(body.data.practicalHours).toBe(4.5);
  });

  it("should return 404 if module not found when creating lesson", async () => {
    prismaMock.courseModule.findUnique.mockResolvedValue(null);

    const req = new Request(
      "http://localhost/api/staff/courses/modules/mod1/lessons",
      {
        method: "POST",
        body: JSON.stringify({ title: "New Lesson", order: 0, type: "VIDEO" }),
      },
    );
    const res = await createLesson(req, {
      params: Promise.resolve({ moduleId: "mod1" }),
    });
    expect(res.status).toBe(404);
  });
});

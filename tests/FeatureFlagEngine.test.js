const FeatureFlagEngine = require("../src/core/FeatureFlagEngine");

describe("FeatureFlagEngine", () => {
  let engine;
  let featureRepo;
  let overrideRepo;

  beforeEach(() => {
    featureRepo = { findByKey: jest.fn() };
    overrideRepo = { find: jest.fn() };
    engine = new FeatureFlagEngine(featureRepo, overrideRepo);
  });

  test("returns default when no overrides", async () => {
    featureRepo.findByKey.mockResolvedValue({ default_enabled: 1 });
    overrideRepo.find.mockResolvedValue(null);

    const result = await engine.evaluate("feature", {});
    expect(result).toBe(true);
  });

  test("user override takes precedence", async () => {
    featureRepo.findByKey.mockResolvedValue({ default_enabled: 0 });
    overrideRepo.find
      .mockResolvedValueOnce({ enabled: 1 }) // USER
      .mockResolvedValueOnce(null);

    const result = await engine.evaluate("feature", { userId: "u1" });
    expect(result).toBe(true);
  });

  test("group override used if no user override", async () => {
    featureRepo.findByKey.mockResolvedValue({ default_enabled: 0 });
    overrideRepo.find
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ enabled: 1 });

    const result = await engine.evaluate("feature", { groupId: "g1" });
    expect(result).toBe(true);
  });

  test("throws error if feature not found", async () => {
    featureRepo.findByKey.mockResolvedValue(null);
    await expect(engine.evaluate("unknown")).rejects.toThrow();
  });
});

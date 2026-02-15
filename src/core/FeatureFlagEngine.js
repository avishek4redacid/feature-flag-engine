class FeatureFlagEngine {
  constructor(featureRepo, overrideRepo) {
    this.featureRepo = featureRepo;
    this.overrideRepo = overrideRepo;
  }

  async evaluate(featureKey, context = {}) {
    const feature = await this.featureRepo.findByKey(featureKey);
    if (!feature) {
      throw new Error("Feature not found");
    }

    // 1. USER override
    if (context.userId) {
      const userOverride = await this.overrideRepo.find(
        featureKey,
        "USER",
        context.userId
      );
      if (userOverride) return Boolean(userOverride.enabled);
    }

    // 2. GROUP override
    if (context.groupId) {
      const groupOverride = await this.overrideRepo.find(
        featureKey,
        "GROUP",
        context.groupId
      );
      if (groupOverride) return Boolean(groupOverride.enabled);
    }

    // 3. DEFAULT
    return Boolean(feature.default_enabled);
  }
}

module.exports = FeatureFlagEngine;

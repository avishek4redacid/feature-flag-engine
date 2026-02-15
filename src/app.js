const express = require("express");
const FeatureRepository = require("./repositories/FeatureRepository");
const OverrideRepository = require("./repositories/OverrideRepository");
const FeatureFlagEngine = require("./core/FeatureFlagEngine");

const app = express();
app.use(express.json());

const featureRepo = new FeatureRepository();
const overrideRepo = new OverrideRepository();
const engine = new FeatureFlagEngine(featureRepo, overrideRepo);

app.post("/features", async (req, res) => {
  try {
    const { key, defaultEnabled, description } = req.body;
    const feature = await featureRepo.create(key, defaultEnabled, description);
    res.json(feature);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/features", async (req, res) => {
  const features = await featureRepo.findAll();
  res.json(features);
});

app.get("/evaluate/:key", async (req, res) => {
  try {
    const result = await engine.evaluate(req.params.key, {
      userId: req.query.userId,
      groupId: req.query.groupId,
    });

    res.json({ enabled: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

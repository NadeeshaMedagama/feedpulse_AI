const { Feedback } = require("../models/Feedback");
const { analyzeFeedback } = require("./aiClient.service");

function toSort(sortBy, sortOrder) {
  const direction = sortOrder === "asc" ? 1 : -1;
  if (sortBy === "priority") {
    return { ai_priority: direction };
  }
  if (sortBy === "sentiment") {
    return { ai_sentiment: direction };
  }
  return { createdAt: direction };
}

async function createFeedback(input) {
  const feedback = await Feedback.create(input);

  try {
    const ai = await analyzeFeedback(feedback.title, feedback.description);
    feedback.ai_category = ai.category;
    feedback.ai_sentiment = ai.sentiment;
    feedback.ai_priority = ai.priority_score;
    feedback.ai_summary = ai.summary;
    feedback.ai_tags = ai.tags;
    feedback.ai_processed = true;
    await feedback.save();
  } catch (error) {
    feedback.ai_processed = false;
    await feedback.save();
  }

  return feedback;
}

async function getFeedbackList(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.category) {
    filter.category = query.category;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { ai_summary: { $regex: query.search, $options: "i" } }
    ];
  }

  const [items, total] = await Promise.all([
    Feedback.find(filter)
      .sort(toSort(query.sortBy, query.sortOrder))
      .skip(skip)
      .limit(limit)
      .lean(),
    Feedback.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

async function getFeedbackById(id) {
  return Feedback.findById(id).lean();
}

async function updateFeedbackStatus(id, status) {
  return Feedback.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
}

async function deleteFeedback(id) {
  return Feedback.findByIdAndDelete(id).lean();
}

async function getWeeklySummary() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const feedback = await Feedback.find({ createdAt: { $gte: sevenDaysAgo } }).lean();

  const tagCount = new Map();
  feedback.forEach((item) => {
    (item.ai_tags || []).forEach((tag) => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  const topThemes = [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, count]) => ({ theme: tag, count }));

  return {
    window: "last_7_days",
    totalFeedback: feedback.length,
    topThemes,
    summaryText: topThemes.length
      ? `Top themes: ${topThemes.map((theme) => `${theme.theme} (${theme.count})`).join(", ")}.`
      : "No tagged feedback in last 7 days."
  };
}

async function triggerReanalysis(id) {
  const feedback = await Feedback.findById(id);
  if (!feedback) {
    return null;
  }

  const ai = await analyzeFeedback(feedback.title, feedback.description);
  feedback.ai_category = ai.category;
  feedback.ai_sentiment = ai.sentiment;
  feedback.ai_priority = ai.priority_score;
  feedback.ai_summary = ai.summary;
  feedback.ai_tags = ai.tags;
  feedback.ai_processed = true;

  await feedback.save();
  return feedback.toObject();
}

async function getStats() {
  const [total, open, avgPriority, commonTagAgg] = await Promise.all([
    Feedback.countDocuments(),
    Feedback.countDocuments({ status: { $ne: "Resolved" } }),
    Feedback.aggregate([{ $match: { ai_priority: { $exists: true } } }, { $group: { _id: null, avg: { $avg: "$ai_priority" } } }]),
    Feedback.aggregate([
      { $unwind: { path: "$ai_tags", preserveNullAndEmptyArrays: false } },
      { $group: { _id: "$ai_tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ])
  ]);

  return {
    totalFeedback: total,
    openItems: open,
    averagePriorityScore: avgPriority[0] ? Number(avgPriority[0].avg.toFixed(2)) : 0,
    mostCommonTag: commonTagAgg[0]?._id || null
  };
}

module.exports = {
  createFeedback,
  getFeedbackList,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  getWeeklySummary,
  triggerReanalysis,
  getStats
};


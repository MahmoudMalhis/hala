// server/middleware/cache.js
const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 600, // 10 دقائق default
  checkperiod: 120, // فحص كل دقيقتين للـ expired keys
});

/**
 * Cache Middleware محسّن مع مسح تلقائي عند التحديث
 */
const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    // تخطي كل شيء غير GET
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`Cache hit for: ${key}`);
      return res.json(cachedResponse);
    }

    // حفظ الـ response الأصلي
    res.originalJson = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      console.log(`Cache set for: ${key} (${duration}s)`);
      res.originalJson(body);
    };

    next();
  };
};

/**
 * Middleware لمسح الـ Cache عند التحديث
 */
const clearCacheMiddleware = (patterns = []) => {
  return (req, res, next) => {
    // احفظ الـ send الأصلي
    const originalSend = res.send;
    const originalJson = res.json;

    // Override للـ response methods
    res.send = function (data) {
      // إذا كان الـ response ناجح، امسح الـ cache
      if (res.statusCode >= 200 && res.statusCode < 300) {
        clearRelatedCache(req, patterns);
      }
      originalSend.call(this, data);
    };

    res.json = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        clearRelatedCache(req, patterns);
      }
      originalJson.call(this, data);
    };

    next();
  };
};

/**
 * مسح Cache ذات الصلة
 */
function clearRelatedCache(req, patterns = []) {
  const method = req.method;
  const baseUrl = req.baseUrl || "";
  const path = req.path || "";

  // لا تمسح cache إلا للعمليات التي تغير البيانات
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    return;
  }

  console.log(`🗑️ Clearing cache for ${method} ${baseUrl}${path}`);

  // امسح الـ cache patterns المحددة
  if (patterns.length > 0) {
    patterns.forEach((pattern) => {
      const keys = cache.keys();
      keys.forEach((key) => {
        if (key.includes(pattern)) {
          cache.del(key);
          console.log(`  ✅ Cleared: ${key}`);
        }
      });
    });
  } else {
    // امسح cache نفس الـ endpoint
    const keys = cache.keys();
    keys.forEach((key) => {
      if (key.includes(baseUrl)) {
        cache.del(key);
        console.log(`  ✅ Cleared: ${key}`);
      }
    });
  }
}

/**
 * مسح cache يدوي
 */
function clearCache(pattern) {
  if (!pattern) {
    // امسح كل شيء
    cache.flushAll();
    console.log("🗑️ All cache cleared");
    return { cleared: "all" };
  }

  // امسح بناءً على pattern
  const keys = cache.keys();
  let cleared = 0;

  keys.forEach((key) => {
    if (key.includes(pattern)) {
      cache.del(key);
      cleared++;
    }
  });

  console.log(`🗑️ Cleared ${cleared} keys matching: ${pattern}`);
  return { cleared, pattern };
}

/**
 * احصائيات الـ Cache
 */
function getCacheStats() {
  return {
    keys: cache.keys().length,
    stats: cache.getStats(),
    entries: cache.keys().map((key) => ({
      key,
      ttl: cache.getTtl(key),
    })),
  };
}

module.exports = {
  cacheMiddleware,
  clearCacheMiddleware,
  clearCache,
  getCacheStats,
};

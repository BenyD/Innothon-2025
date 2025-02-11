interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

export function rateLimit({
  interval,
  uniqueTokenPerInterval,
}: RateLimitConfig) {
  const tokenCache = new Map();

  // Clean up old tokens periodically
  setInterval(() => {
    const now = Date.now();
    for (const [token, [, timestamp]] of tokenCache.entries()) {
      if (now - timestamp > interval) {
        tokenCache.delete(token);
      }
    }
    // Keep cache size under control
    if (tokenCache.size > uniqueTokenPerInterval) {
      const entriesToDelete = Array.from(tokenCache.entries())
        .sort(([, [, a]], [, [, b]]) => a - b)
        .slice(0, tokenCache.size - uniqueTokenPerInterval);
      for (const [token] of entriesToDelete) {
        tokenCache.delete(token);
      }
    }
  }, interval);

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1, Date.now()]);
          resolve();
        } else {
          const currentTime = Date.now();
          const timeInterval = currentTime - tokenCount[1];

          if (timeInterval < interval) {
            if (tokenCount[0] >= limit) {
              reject(new Error("Rate limit exceeded"));
            } else {
              tokenCount[0]++;
              resolve();
            }
          } else {
            tokenCache.set(token, [1, Date.now()]);
            resolve();
          }
        }
      }),
  };
}

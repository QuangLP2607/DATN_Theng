import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,

  lazyConnect: true,
  enableReadyCheck: false,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  connectTimeout: 10000,

  retryStrategy(times) {
    return Math.min(times * 500, 3000);
  },
});

redis.on("connect", () => {
  console.log("[Redis] Connected");
});

redis.on("ready", () => {
  console.log("[Redis] Ready");
});

redis.on("error", (error) => {
  console.error("[Redis] Error:", error.message);
});

redis.on("close", () => {
  console.log("[Redis] Connection closed");
});

export const connectRedis = async (): Promise<void> => {
  try {
    console.log("[Redis] Connecting...");

    await redis.connect();

    console.log("[Redis] Sending PING...");

    const result = await redis.ping();

    if (result !== "PONG") {
      throw new Error("Unexpected Redis PING response");
    }

    console.log("[Redis] Connection successful");
  } catch (error) {
    console.error("[Redis] Connection failed:", error);
    throw error;
  }
};

export default redis;

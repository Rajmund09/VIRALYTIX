"""
VIRALYTIX — IP-Based Sliding Window Rate Limiter Middleware
Protects against DoS, brute-force, and computational resource exhaustion.
"""
import time
from collections import defaultdict
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        # Store request timestamps: { ip: [timestamp1, timestamp2, ...] }
        self.upload_requests = defaultdict(list)
        self.general_requests = defaultdict(list)

    def _clean_old_requests(self, timestamps: list, window: float = 60.0):
        now = time.time()
        return [t for t in timestamps if now - t < window]

    async def dispatch(self, request: Request, call_next):
        # Allow OPTIONS preflight checks
        if request.method == "OPTIONS":
            return await call_next(request)

        # Extract client IP (handle proxies like Render, Cloudflare, Vercel)
        client_ip = (
            request.headers.get("x-forwarded-for", "").split(",")[0].strip()
            or (request.client.host if request.client else "unknown")
        )

        now = time.time()
        path = request.url.path

        # 1. Strict limit on video upload and heavy processing (Max 10 per minute per IP)
        if "/api/videos/upload" in path or "/process" in path:
            self.upload_requests[client_ip] = self._clean_old_requests(
                self.upload_requests[client_ip], window=60.0
            )
            if len(self.upload_requests[client_ip]) >= 10:
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": "Too Many Requests. Video upload/analysis rate limit exceeded (Max 10 per minute). Please wait."
                    },
                    headers={"Retry-After": "60"},
                )
            self.upload_requests[client_ip].append(now)

        # 2. General API rate limit (Max 120 per minute per IP)
        elif path.startswith("/api/"):
            self.general_requests[client_ip] = self._clean_old_requests(
                self.general_requests[client_ip], window=60.0
            )
            if len(self.general_requests[client_ip]) >= 120:
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": "Too Many Requests. API rate limit exceeded. Please try again later."
                    },
                    headers={"Retry-After": "60"},
                )
            self.general_requests[client_ip].append(now)

        return await call_next(request)

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRefreshTokenFromCookies = exports.cookieConfig = void 0;
exports.cookieConfig = {
    refreshToken: {
        name: 'refreshToken',
        options: {
            path: '/', // For production, use '/auth/api/refresh-tokens'. We use '/' for localhost in order to work on Chrome.
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days; must match Refresh JWT expiration.
        },
    },
};
var extractRefreshTokenFromCookies = function (req) {
    var _a;
    console.log('\n\n ---> apps/server/lib/cookies.util.ts:16 -> req: ', req);
    var cookies = (_a = req.headers.cookie) === null || _a === void 0 ? void 0 : _a.split('; ');
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.length)) {
        return null;
    }
    var refreshTokenCookie = cookies.find(function (cookie) {
        return cookie.startsWith("".concat(exports.cookieConfig.refreshToken.name, "="));
    });
    if (!refreshTokenCookie) {
        return null;
    }
    console.log("\n\n ---> apps/server/lib/cookies.util.ts:29 -> refreshTokenCookie.split('='): ", refreshTokenCookie.split('='));
    return refreshTokenCookie.split('=')[1];
};
exports.extractRefreshTokenFromCookies = extractRefreshTokenFromCookies;

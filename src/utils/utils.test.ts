import { beforeEach, describe, expect, test, vi } from "vitest";
import { decodeJWT, getRelativeTime, isTokenExpiringSoon } from "./utils.ts";

describe("utils", () => {
	describe("decodeJWT", () => {
		test("decodes a JWT token into a json-like object", () => {
			expect(
				decodeJWT(
					"eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTczNjI5MjEyNH0."
				)
			).toStrictEqual({
				sub: "1234567890",
				name: "John Doe",
				admin: true,
				iat: 1736292124,
			});
		});

		test("returns null when input is empty", () => {
			expect(decodeJWT("")).toEqual(null);
		});
	});
	describe("isTokenExpiringSoon", () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date("2025-11-22T21:24:23.000Z"));
		});
		// token has exp set to 2025-11-22T21:25:23.000Z
		const token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTc2MjExODcyMywiZXhwIjoxNzYzODQ2NzIzfQ.0PwfSE7Mt7w9VQDvDQ7Nc0sEo_fJPI6WloKgeORwjgc";

		test("return true if exp is within the expiration buffer", () => {
			expect(isTokenExpiringSoon(token, 60)).toBe(true);
		});

		test("return false if exp is outside the expiration buffer", () => {
			expect(isTokenExpiringSoon(token, 30)).toBe(false);
		});

		test("returns false when the token is invalid", () => {
			expect(isTokenExpiringSoon("invalid token")).toBe(false);
		});
	});
	describe("getRelativeTime", () => {
		test("returns 'just now'", () => {
			expect(getRelativeTime("2025-11-22T21:24:23.000Z")).toBe("just now");
		});

		test("returns 'x minutes ago'", () => {
			expect(getRelativeTime("2025-11-22T21:22:23.000Z")).toBe("2 minutes ago");
		});

		test("returns 'x hours ago'", () => {
			expect(getRelativeTime("2025-11-22T18:22:23.000Z")).toBe("3 hours ago");
		});

		test("returns 'x days ago'", () => {
			expect(getRelativeTime("2025-11-18T18:22:23.000Z")).toBe("4 days ago");
		});

		test("returns 'x years ago'", () => {
			expect(getRelativeTime("1982-11-18T18:22:23.000Z")).toBe("43 years ago");
		});
	});
});

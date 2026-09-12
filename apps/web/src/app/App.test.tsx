import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

describe("foundation bootstrap", () => {
  afterEach(() => vi.restoreAllMocks());
  it("renders in Arabic and reports API connectivity", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "ok",
          service: "talent-dna-api",
          version: "v1",
        }),
      }),
    );
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "تم تجهيز الأساس التقني" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("متاحة")).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
  });
});

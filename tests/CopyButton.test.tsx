import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CopyButton from "@/components/CopyButton";

const writeText = vi.fn();

vi.stubGlobal(
  "navigator",
  new Proxy(globalThis.navigator, {
    get(target, prop) {
      if (prop === "clipboard") return { writeText };
      return Reflect.get(target, prop);
    },
  }),
);

beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined);
});

describe("CopyButton", () => {
  it("a un label initial 'Copier le code'", () => {
    render(<CopyButton text="hello" />);
    expect(screen.getByRole("button", { name: /copier le code/i })).toBeInTheDocument();
  });

  it("copie le texte et bascule en état 'copié'", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="payload" />);

    await user.click(screen.getByRole("button"));

    expect(writeText).toHaveBeenCalledWith("payload");
    await waitFor(() => expect(screen.getByRole("button", { name: /copié/i })).toBeInTheDocument());
  });

  it("ne casse pas si clipboard échoue", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    const user = userEvent.setup();
    render(<CopyButton text="x" />);

    await user.click(screen.getByRole("button"));

    expect(writeText).toHaveBeenCalledWith("x");
    expect(screen.getByRole("button", { name: /copier le code/i })).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BackToTopButton from "@/components/BackToTopButton";

describe("BackToTopButton", () => {
  it("rend un bouton accessible", () => {
    render(<BackToTopButton />);
    expect(screen.getByRole("button", { name: /retour en haut/i })).toBeInTheDocument();
  });

  it("appelle window.scrollTo au clic", async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;

    const user = userEvent.setup();
    render(<BackToTopButton />);
    await user.click(screen.getByRole("button"));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});

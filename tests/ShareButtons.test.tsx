import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareButtons from "@/components/ShareButtons";

const URL = "https://vincenthirtz.fr/notes/foo";
const TITLE = "Mon article";

const writeText = vi.fn();
const share = vi.fn();
let shareEnabled = false;

vi.stubGlobal(
  "navigator",
  new Proxy(globalThis.navigator, {
    get(target, prop) {
      if (prop === "clipboard") return { writeText };
      if (prop === "share") return shareEnabled ? share : undefined;
      return Reflect.get(target, prop);
    },
  }),
);

beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined);
  share.mockReset().mockResolvedValue(undefined);
  shareEnabled = false;
});

describe("ShareButtons", () => {
  it("n'affiche pas le bouton natif si navigator.share absent", () => {
    render(<ShareButtons url={URL} title={TITLE} />);
    expect(screen.queryByRole("button", { name: /partager cet article/i })).toBeNull();
  });

  it("affiche le bouton natif et appelle navigator.share avec title+url", async () => {
    shareEnabled = true;
    const user = userEvent.setup();
    render(<ShareButtons url={URL} title={TITLE} />);

    await user.click(screen.getByRole("button", { name: /partager cet article/i }));
    expect(share).toHaveBeenCalledWith({ title: TITLE, url: URL });
  });

  it("expose les liens sociaux encodés", () => {
    render(<ShareButtons url={URL} title={TITLE} />);
    const twitter = screen.getByRole("link", { name: /twitter/i }) as HTMLAnchorElement;
    expect(twitter.href).toContain(encodeURIComponent(TITLE));
    expect(twitter.href).toContain(encodeURIComponent(URL));

    const linkedin = screen.getByRole("link", { name: /linkedin/i }) as HTMLAnchorElement;
    expect(linkedin.href).toContain(encodeURIComponent(URL));

    const email = screen.getByRole("link", { name: /email/i }) as HTMLAnchorElement;
    expect(email.href.startsWith("mailto:")).toBe(true);
  });

  it("copie le lien au clic sur le bouton copier", async () => {
    const user = userEvent.setup();
    render(<ShareButtons url={URL} title={TITLE} />);

    await user.click(screen.getByRole("button", { name: /copier le lien/i }));
    expect(writeText).toHaveBeenCalledWith(URL);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /lien copié/i })).toBeInTheDocument(),
    );
  });
});

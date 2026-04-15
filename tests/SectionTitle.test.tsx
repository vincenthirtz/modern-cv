import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionTitle from "@/components/SectionTitle";

vi.mock("@/hooks/useInView", () => ({
  useInView: () => true,
}));

describe("SectionTitle", () => {
  it("rend le numéro, le label et le titre", () => {
    render(<SectionTitle number="01" label="Section" title="Mon titre" />);
    // "01" apparaît en grand (background) + en petit (entête)
    expect(screen.getAllByText("01").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/Mon\s+titre/);
  });

  it("affiche la description si fournie", () => {
    render(<SectionTitle number="02" label="Intro" title="T" description="Petite description." />);
    expect(screen.getByText("Petite description.")).toBeInTheDocument();
  });

  it("n'affiche pas le numéro géant si bigNumber=false", () => {
    const { container } = render(
      <SectionTitle number="03" label="X" title="T" bigNumber={false} />,
    );
    // Le bloc aria-hidden avec le symbole géant est absent
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("affiche bigSymbol à la place du numéro quand fourni", () => {
    render(<SectionTitle number="04" label="X" title="T" bigSymbol="</>" />);
    expect(screen.getByText("</>")).toBeInTheDocument();
  });
});

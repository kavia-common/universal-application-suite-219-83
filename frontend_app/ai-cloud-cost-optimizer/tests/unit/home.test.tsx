import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders App Shell OK text", () => {
    render(<HomePage />);
    expect(screen.getByText("App Shell OK")).toBeInTheDocument();
  });
});

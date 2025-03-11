import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home Page", () => {
    it("renders the welcome message", () => {
        render(<Home />);
        const heading = screen.getByText("Shadcn/ui Card");
        expect(heading).toBeInTheDocument();
    });
});
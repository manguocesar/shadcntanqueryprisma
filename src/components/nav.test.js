import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../app/page";
import { MainNav } from "./nav";
import { useRouter } from "next/router";
import { mockRouter } from "next-router-mock";

// Mock the next/router module
jest.mock("next/router", () => require("next-router-mock"));

describe("MainNav Component", () => {
    it("renders the correct text", () => {
        render(<MainNav />);
        fireEvent.click(screen.getByText("Dashboard"));
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
});
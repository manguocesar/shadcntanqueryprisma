const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testEnvironment: "jest-environment-jsdom", // Ensure this is set correctly
    testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
};

module.exports = createJestConfig(customJestConfig);
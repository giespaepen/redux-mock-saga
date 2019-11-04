module.exports = {
    "globals": {
        "ts-jest": {
            "tsConfig": "tsconfig.json",
            "babelConfig": false
        }
    },
    "collectCoverage": true,
    "collectCoverageFrom": [
        "**/*.{ts,tsx}",
        "!**/node_modules/**",
        "!**/__tests__/**"
    ],
    "coverageDirectory": "coverage",
    "coveragePathIgnorePatterns": [
        "/node_modules/",
        "\\.d\\.ts"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "testPathIgnorePatterns": [
        "/node_modules/",
        "/typings/",
        "/flow-typed/",
        "/lib/"
    ],
    "testRegex": "/__tests__/.*\\.spec\\.(ts|tsx)$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ]
};

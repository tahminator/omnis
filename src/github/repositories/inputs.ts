import type { RepositoryArgs } from "@pulumi/github";
import type { RepositoryRulesetRules } from "@pulumi/github/types/input";

import { GITHUB_APP_ID } from "@/github/repositories/const";

/**
 * Can be `public` or `private`.
 * If your organization is associated with an enterprise account
 * using GitHub Enterprise Cloud or GitHub Enterprise Server 2.20+,
 * visibility can also be `internal`.
 * The `visibility` parameter overrides the `private` parameter.
 */
type RepositoryVisibility = "public" | "private" | "internal";

/**
 * An actor allowed to bypass a repository ruleset. On a personal account only two
 * actor types are valid: the built-in `RepositoryRole` (e.g. Admin) and a GitHub
 * App via `Integration` (`Team` / `OrganizationAdmin` are org-only). `bypassMode`
 * defaults to `"always"`.
 */
type RepositoryRulesetBypassActor = {
  actorType: "RepositoryRole" | "Integration";
  /**
   * For `RepositoryRole`: built-in role id (5 = Admin, 4 = Maintain, 2 = Write, 1 = Read).
   * For `Integration`: the GitHub App id (see `GITHUB_APP_ID` in `const.ts`).
   */
  actorId: number;
  bypassMode?: "always" | "pull_request";
};

type GithubRepository = {
  /** set to `true` when repository has not been seen by Pulumi yet. Set to `false` after Pulumi has successfully reconciled state __AFTER MERGING SAID CHANGE__. */
  bootstrap: boolean;
  /** The actual GitHub repository name. Defaults to the config key when omitted. You should only use this when renaming a repository without having it being deleted. */
  oldName?: string;
  /** GitHub usernames invited to this repository. Personal repos only support write-level collaborators, so every listed user gets push access. */
  collaborators: readonly string[];
  description?: RepositoryArgs["description"];
  visibility: RepositoryVisibility;
  repositorySettingOverrides: Partial<RepositoryArgs>;
  mainBranchProtectionOverrides: Partial<RepositoryRulesetRules>;
  /** Actors allowed to bypass this repository's main-branch ruleset, in addition to the owner (admin) bypass applied to every repository. */
  mainBranchProtectionBypass: readonly RepositoryRulesetBypassActor[];
  /** if set to `true`, will exclude default `SonarCloud Code Analysis` status check. You are expected to register your own multi-scanner status checks instead. */
  monorepo: boolean;
};

type RepositoryName = string;

export const DEFAULT_REPOSITORY_SETTINGS: RepositoryArgs = {
  allowMergeCommit: false,
  allowRebaseMerge: true,
  allowSquashMerge: false,
  deleteBranchOnMerge: true,
  allowAutoMerge: true,
} as const;

export const DEFAULT_MAIN_BRANCH_PROTECTIONS: RepositoryRulesetRules = {
  requiredLinearHistory: true,
  nonFastForward: true,
  deletion: false,
  update: false,
  pullRequest: {
    requiredApprovingReviewCount: 0,
    dismissStaleReviewsOnPush: false,
    requireLastPushApproval: true,
    requireCodeOwnerReview: true,
    requiredReviewThreadResolution: true,
  },
  requiredStatusChecks: {
    requiredChecks: [],
    strictRequiredStatusChecksPolicy: true,
  },
};

export const REPOSITORIES = {
  abclang: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  aerospace: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Aerospace config",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  borders: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Borders config",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "ccny-byte-hacks-2025": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "WINNER: BYTE Hacks 2025",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  codeforces: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "Coolify-TypeScript-SDK": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description:
      "Developer-friendly & type-safe Typescript SDK specifically catered to leverage the Coolify API.",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "csci-39548-final": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  dotfiles: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "My config files",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  dots: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description:
      "Official DigitalOcean Typescript Client based on the DO OpenAPIv3 specification",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  ginny: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "go-example": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "go-live-example": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "hackrpi-project": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "HackRPI | Odyssey - To help you enjoy your daily commute",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "healing-hand": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Healing Hand Initiative Webpage",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  hunterhacks2025: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Hunter Hacks 2025 | AllerFree",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "instalock-web": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description:
      "The web app that interacts with Valorant APIs, built with Express.js and React + Vite",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Analyze (javascript-typescript)",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Analyze (go)",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Analyze (actions)",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Build Web Docker image and deploy to Docker Hub",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Build Cron Docker image and deploy to Docker Hub",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Run Acceptance Tests",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          { context: "Run Tests", integrationId: GITHUB_APP_ID.githubActions },
        ],
      },
    },
  },
  "k8s-personal": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  leetcode: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "none-ls.nvim": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description:
      "null-ls.nvim reloaded / Use Neovim as a language server to inject LSP diagnostics, code actions, and more via Lua.",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  nvim: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "My Neovim config",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  omnis: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Infrastructure-as-code via Pulumi",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Preview Pulumi changes",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          {
            context: "Create new tag",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          { context: "Run Tests", integrationId: GITHUB_APP_ID.githubActions },
        ],
      },
    },
  },
  "open-api": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "A Monorepo of various packages to power OpenAPI in node",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "pantry-pal": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Pantry Pal",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "pg-aws": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  pipeline: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "CICD pipeline script library",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          { context: "Run Tests", integrationId: GITHUB_APP_ID.githubActions },
          {
            context:
              "Test package, build @tahminator/pipeline and deploy beta version to NPM",
            integrationId: GITHUB_APP_ID.githubActions,
          },
        ],
      },
    },
  },
  portfolio: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "My portfolio site built in Next.js",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "Build Test Docker Image",
            integrationId: GITHUB_APP_ID.githubActions,
          },
          { context: "Run Tests", integrationId: GITHUB_APP_ID.githubActions },
        ],
      },
    },
  },
  "ramp-fe-challenge-solved": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Ramp Frontend Challenge (Solved)",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "rift.lua": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "lua client for rift-wm",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  sapling: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description:
      "A lightweight Express.js dependency injection & route abstraction library",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {
      requiredStatusChecks: {
        requiredChecks: [
          {
            context: "SonarCloud Code Analysis",
            integrationId: GITHUB_APP_ID.sonarCloud,
          },
          { context: "Run Tests", integrationId: GITHUB_APP_ID.githubActions },
        ],
      },
    },
  },
  "simple-bar": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description:
      "A yabai, AeroSpace or FlashSpace status bar widget for \u00dcbersicht",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  spotatui: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description:
      "A fully standalone Spotify client for the terminal. Native streaming included, no daemon required.",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "springboot-react-example": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Todo App built with SpringBoot and React",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  tahminator: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: undefined,
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  templater: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "0-dependency Python script to create & use templates",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "todo-sq": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "A Todo App Integrated with Discord built with Next.js",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "type-fest": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "A collection of essential TypeScript types",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  ui: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description:
      "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  "vitest-bug": {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Vitest Reproducible bug with pnpm",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
  wezterm: {
    bootstrap: true,
    oldName: undefined,
    visibility: "public",
    description: "Wezterm config",
    monorepo: false,
    collaborators: [],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
} as const satisfies Record<RepositoryName, GithubRepository>;

export type GithubRepositoryName = keyof typeof REPOSITORIES;
export type { RepositoryRulesetBypassActor };

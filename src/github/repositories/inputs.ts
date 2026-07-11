import type { RepositoryArgs } from "@pulumi/github";
import type { RepositoryRulesetRules } from "@pulumi/github/types/input";

import {
  DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME,
  GITHUB_APP_ID,
} from "@/github/repositories/const";

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
  allowRebaseMerge: false,
  allowSquashMerge: true,
  deleteBranchOnMerge: true,
  allowAutoMerge: true,
} as const;

export const DEFAULT_MAIN_BRANCH_PROTECTIONS: RepositoryRulesetRules = {
  requiredLinearHistory: true,
  nonFastForward: true,
  deletion: false,
  update: false,
  pullRequest: {
    requiredApprovingReviewCount: 1,
    dismissStaleReviewsOnPush: false,
    requireLastPushApproval: true,
    requireCodeOwnerReview: true,
    requiredReviewThreadResolution: true,
  },
  requiredStatusChecks: {
    requiredChecks: [
      // this check will be excluded if `monorepo: true` in repository config
      {
        context: DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME,
        integrationId: GITHUB_APP_ID.sonarCloud,
      },
    ],
    strictRequiredStatusChecksPolicy: true,
  },
};

export const REPOSITORIES = {
  "test-repo": {
    description: "test",
    bootstrap: false,
    oldName: undefined,
    visibility: "public",
    monorepo: false,
    collaborators: ["az2924"],
    mainBranchProtectionBypass: [],
    repositorySettingOverrides: {},
    mainBranchProtectionOverrides: {},
  },
} as const satisfies Record<RepositoryName, GithubRepository>;

export type GithubRepositoryName = keyof typeof REPOSITORIES;
export type { RepositoryRulesetBypassActor };

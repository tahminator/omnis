import "@/github/repositories/secrets";

import * as github from "@pulumi/github";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";
import { DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME } from "@/github/repositories/const";
import {
  DEFAULT_MAIN_BRANCH_PROTECTIONS,
  DEFAULT_REPOSITORY_SETTINGS,
  REPOSITORIES,
  type GithubRepositoryName,
  type RepositoryRulesetBypassActor,
} from "@/github/repositories/inputs";
import { mergeWithConcatArrays } from "@/utils";

type GithubRepositoryMap = Record<GithubRepositoryName, github.Repository>;

/**
 * GitHub rulesets have no per-user bypass actor. On a personal account the owner
 * is a repository admin, so granting the built-in Admin role (`actorId: 5`) an
 * always-on bypass is the equivalent of "let me override this ruleset". This is
 * applied to every repository; additional per-repo actors come from
 * `mainBranchProtectionBypass`.
 */
const OWNER_BYPASS_ACTOR = {
  actorType: "RepositoryRole",
  actorId: 5,
  bypassMode: "always",
} as const;

const resolveBypassActors = (
  extra: readonly RepositoryRulesetBypassActor[],
) => [
  OWNER_BYPASS_ACTOR,
  ...extra.map((actor) => ({
    ...actor,
    bypassMode: actor.bypassMode ?? "always",
  })),
];

const getRepositoryResourceName = (repositoryName: string) =>
  `${GITHUB_OWNER}-repository-${repositoryName}`;

const getRepositoryCollaboratorResourceName = (
  repositoryName: string,
  username: string,
) => `${GITHUB_OWNER}-repository-${repositoryName}-collaborator-${username}`;

const getDefaultBranchRulesetResourceName = (repositoryName: string) =>
  `${GITHUB_OWNER}-repository-${repositoryName}-default-branch-ruleset`;

const getAllOtherBranchRulesetResourceName = (repositoryName: string) =>
  `${GITHUB_OWNER}-repository-${repositoryName}-all-other-branch-ruleset`;

export const githubRepositories: GithubRepositoryMap = Object.fromEntries(
  Object.entries(REPOSITORIES).map(([repositoryName, repositoryConfig]) => {
    const actualRepositoryName = repositoryConfig.oldName ?? repositoryName;

    return [
      repositoryName,
      new github.Repository(
        getRepositoryResourceName(repositoryName),
        {
          name: actualRepositoryName,
          visibility: repositoryConfig.visibility,
          description: repositoryConfig.description,
          ...mergeWithConcatArrays(
            DEFAULT_REPOSITORY_SETTINGS,
            repositoryConfig.repositorySettingOverrides,
          ),
        },
        {
          provider,
          import: repositoryConfig.bootstrap ? actualRepositoryName : undefined,
          aliases:
            repositoryConfig.oldName ?
              [
                {
                  name: getRepositoryResourceName(repositoryConfig.oldName),
                },
              ]
            : undefined,
        },
      ),
    ] as const;
  }),
) as GithubRepositoryMap;

export const githubRepositoryCollaborators = Object.entries(
  REPOSITORIES,
).flatMap(([repositoryName, repositoryConfig]) => {
  const collaborators: readonly string[] = repositoryConfig.collaborators;

  return collaborators.map(
    (username) =>
      new github.RepositoryCollaborator(
        getRepositoryCollaboratorResourceName(repositoryName, username),
        {
          repository: repositoryConfig.oldName ?? repositoryName,
          username,
        },
        { provider },
      ),
  );
});

export const githubRepositoryDefaultBranchRulesets = Object.entries(
  REPOSITORIES,
).map(([repositoryName, repositoryConfig]) => {
  const repository = githubRepositories[repositoryName];

  const branchProtections = (() => {
    const protections = mergeWithConcatArrays(
      DEFAULT_MAIN_BRANCH_PROTECTIONS,
      repositoryConfig.mainBranchProtectionOverrides,
    ) as github.types.output.RepositoryRulesetRules;

    if (repositoryConfig.monorepo) {
      if (protections.requiredStatusChecks) {
        protections.requiredStatusChecks = {
          ...protections.requiredStatusChecks,
          requiredChecks:
            protections.requiredStatusChecks.requiredChecks.filter(
              ({ context }) => context !== DEFAULT_SONARCLOUD_ANALYSIS_JOB_NAME,
            ),
        };
      }
    }

    return protections;
  })();

  return [
    new github.RepositoryRuleset(
      getDefaultBranchRulesetResourceName(repositoryName),
      {
        name: "default-branch",
        enforcement: "active",
        target: "branch",
        bypassActors: resolveBypassActors(
          repositoryConfig.mainBranchProtectionBypass,
        ),
        repository: repository.name,
        conditions: {
          refName: {
            includes: ["~DEFAULT_BRANCH"],
            excludes: [],
          },
        },
        rules: {
          ...branchProtections,
        },
      },
      {
        provider,
        aliases:
          repositoryConfig.oldName ?
            [
              {
                name: getDefaultBranchRulesetResourceName(
                  repositoryConfig.oldName,
                ),
              },
            ]
          : undefined,
      },
    ),
    new github.RepositoryRuleset(
      getAllOtherBranchRulesetResourceName(repositoryName),
      {
        name: "all-other-branch",
        enforcement: "active",
        target: "branch",
        bypassActors: [OWNER_BYPASS_ACTOR],
        repository: repository.name,
        conditions: {
          refName: {
            includes: ["~ALL"],
            excludes: ["~DEFAULT_BRANCH"],
          },
        },
        rules: {
          requiredLinearHistory: true,
        },
      },
      {
        provider,
        aliases:
          repositoryConfig.oldName ?
            [
              {
                name: getAllOtherBranchRulesetResourceName(
                  repositoryConfig.oldName,
                ),
              },
            ]
          : undefined,
      },
    ),
  ];
});

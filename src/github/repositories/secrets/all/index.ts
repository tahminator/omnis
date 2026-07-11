import * as github from "@pulumi/github";
import { EnvClient, EnvClientStrategy } from "@tahminator/pipeline";

import { GITHUB_OWNER } from "@/github/inputs";
import { provider } from "@/github/provider";
import { REPOSITORIES } from "@/github/repositories/inputs";

const envClient = EnvClient.create(EnvClientStrategy.SOPS, {
  skipMasking: true,
});

const getSharedActionsSecretResourceName = (
  repositoryName: string,
  secretName: string,
) =>
  `${GITHUB_OWNER}-repository-${repositoryName}-shared-actions-secret-${secretName}`;

const sharedSecrets = await envClient.readFromEnv("secrets.yaml", {
  baseDir: import.meta.dir,
});

/**
 * Personal accounts have no organization-wide Actions secrets, so each "shared"
 * secret is fanned out to every repository as a per-repository Actions secret.
 */
export const githubSharedRepositoryActionsSecrets = Object.keys(
  REPOSITORIES,
).flatMap((repositoryName) =>
  Object.entries(sharedSecrets).map(
    ([secretName, value]) =>
      new github.ActionsSecret(
        getSharedActionsSecretResourceName(repositoryName, secretName),
        {
          repository: repositoryName,
          secretName,
          value,
        },
        { provider },
      ),
  ),
);

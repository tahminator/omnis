# Point Pulumi at the Cloudflare R2 (S3-compatible) state backend and create the stack.
# Reads AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (your R2 API token) from secrets.yaml.
# Usage: just init <bucket> <account-id> [extra pulumi stack init flags]
init bucket account *args:
    sops exec-env secrets.yaml 'pulumi login "s3://{{ bucket }}?endpoint={{ account }}.r2.cloudflarestorage.com&region=auto&s3ForcePathStyle=true"'
    sops exec-env secrets.yaml "pulumi stack init main {{ args }}"

preview *args:
    sops exec-env secrets.yaml "pulumi preview {{ args }}"

encrypt file *args:
    just install-pre-scripts && sops --encrypt --in-place {{ file }} {{ args }}

edit file *args:
    just install-pre-scripts && sops edit {{ file }} {{ args }}

install-pre-scripts:
    just install-pre-commit && just install-pre-push

install-pre-commit:
    cp pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

install-pre-push:
    cp pre-commit .git/hooks/pre-push && chmod +x .git/hooks/pre-push

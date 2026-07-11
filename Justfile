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

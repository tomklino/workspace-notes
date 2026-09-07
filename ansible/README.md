# Workspace Notes deployment

Variable-driven Ansible automation for deploying Workspace Notes at `katavti.klino.me`.

It supports two modes through `workspace_notes_create_azure_vm`:

- `false`: deploy to an existing host (designed for the Bifrost VM) and share its Caddy proxy.
- `true`: provision a dedicated Azure VM and deploy a standalone Caddy proxy.

Docker package management is controlled separately by `workspace_notes_manage_docker`. The example derives it from `workspace_notes_create_azure_vm`, so shared hosts are left untouched while new dedicated VMs receive Docker. Set it explicitly if your environment differs.

Caddy obtains and automatically renews the TLS certificate. Notes are bind-mounted from the persistent host path configured by `workspace_notes_data_dir`, independently of image updates and container replacement.

Image publication is a separate play. `playbooks/build-image.yml` reads the repository's most recent Git tag and checks for that tag in `notes_image_repository`. If it is missing, the controller ensures the Docker Hub repository exists, builds the root `Dockerfile` locally with Buildx, and pushes the tagged image. If the tagged image already exists, no repository API call, build, or push occurs.

`playbooks/site.yml` never builds or pushes. It checks that the latest tagged image exists and fails with instructions if the image has not been published. Deployment hosts only pull the immutable tagged image; they do not download or build source.

## Configure

Copy `inventories/example` and edit all environment-specific values. Set `notes_image_repository` to a writable Docker Hub repository in `docker.io/NAMESPACE/REPOSITORY` form. By default, publication reuses the active `docker login` credentials for repository creation and image push. `notes_image_registry_username` and `notes_image_registry_password` can override them; if used, store them with Ansible Vault and prefer a Docker Hub access token. Set `notes_image_create_repository: false` only when repository lifecycle is managed separately. Store `workspace_notes_auth_secret`, registry credentials, and OAuth credentials with Ansible Vault; do not commit real secrets. For Google OAuth, authorize:

```text
https://katavti.klino.me/api/auth/callback/google
```

When using an existing non-Azure host, set `workspace_notes_existing_host`. Leaving it empty discovers the existing VM through `workspace_notes_existing_azure_resource_group` and `workspace_notes_existing_azure_public_ip_name`.

## Validate

From this directory:

```bash
ansible-playbook --syntax-check \
  -i inventories/example playbooks/build-image.yml

ansible-playbook --syntax-check \
  -i inventories/example playbooks/site.yml

ansible-lint playbooks/build-image.yml playbooks/site.yml
```

## Build and publish

This play only operates on the controller. It skips the build when the latest Git tag is already present in the registry:

```bash
ansible-playbook \
  -i inventories/example playbooks/build-image.yml
```

## Deploy

The playbooks have intentionally not been executed by the project setup process. After publishing and reviewing the deployment configuration:

```bash
ansible-playbook \
  -i inventories/example playbooks/site.yml
```

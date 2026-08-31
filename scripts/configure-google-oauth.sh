#!/usr/bin/env bash
# Configure the local Workspace Notes OAuth environment from a Google OAuth
# desktop/web-client JSON file downloaded from Google Cloud Console.
#
# Google does not expose a supported public API or gcloud command to create a
# general-purpose Google OAuth web client (or retrieve its secret). The OAuth
# consent screen and client must be created in Cloud Console by a project admin.

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/configure-google-oauth.sh PROJECT_ID [CLIENT_JSON]

PROJECT_ID   Google Cloud project ID.
CLIENT_JSON  Path to the OAuth client JSON downloaded from Google Cloud Console.
             If omitted, the script prints the Console URL and required redirect
             URI, then exits without changing any files.

In Cloud Console:
  1. Configure the OAuth consent screen for the project.
  2. Create a Web application OAuth 2.0 Client ID.
  3. Add this authorized redirect URI exactly:
       http://localhost:3030/api/auth/callback/google
  4. Download the client JSON and pass its path as CLIENT_JSON.
EOF
}

if [[ ${1:-} == '-h' || ${1:-} == '--help' || $# -lt 1 || $# -gt 2 ]]; then
  usage
  [[ $# -ge 1 ]] || exit 1
  exit 0
fi

project_id=$1
client_json=${2:-}
console_url="https://console.cloud.google.com/apis/credentials?project=${project_id}"
redirect_uri='http://localhost:3030/api/auth/callback/google'

printf 'Google Cloud project: %s\n' "$project_id"
printf 'Credentials page: %s\n' "$console_url"
printf 'Required redirect URI: %s\n' "$redirect_uri"

if [[ -z $client_json ]]; then
  printf '\nCreate the web OAuth client in the Console, download its JSON, then run:\n'
  printf '  %s %q %q\n' "$0" "$project_id" /path/to/client-secret.json
  exit 0
fi

if [[ ! -f $client_json ]]; then
  printf 'OAuth client JSON does not exist: %s\n' "$client_json" >&2
  exit 1
fi

if ! command -v jq >/dev/null; then
  printf 'jq is required to read the OAuth client JSON.\n' >&2
  exit 1
fi

client_id=$(jq -r '.web.client_id // empty' "$client_json")
client_secret=$(jq -r '.web.client_secret // empty' "$client_json")

if [[ -z $client_id || -z $client_secret ]]; then
  printf 'Expected a Web application OAuth client JSON with .web.client_id and .web.client_secret.\n' >&2
  exit 1
fi

output_file=.env.google
umask 077
cat > "$output_file" <<EOF
# Generated from Google Cloud project: ${project_id}
# Do not commit this file.
GOOGLE_CLIENT_ID=${client_id}
GOOGLE_CLIENT_SECRET=${client_secret}
EOF

printf '\nWrote %s (mode 600). Merge these values into .env and restart Nuxt.\n' "$output_file"

# CI/CD Setup

One-time setup for `.github/workflows/ci.yml` and `.github/workflows/cd.yml`.
Everything below happens in GitHub repo settings and on the RHEL server - no
further code changes needed.

The workflows are written so that **CI is green before any of this is
configured**. Steps that need a secret skip themselves when it is absent, so you
can provision things one at a time and watch the pipeline light up.

## Architecture

```
CI (.github/workflows/ci.yml)
  checkout -> npm ci -> lint
  -> OWASP Dependency-Check (report-only)
  -> SonarQube scan + Quality Gate   [skipped until SONAR_* secrets exist]
  -> build frontend + backend Docker images
  -> Trivy image scan  <-- THE GATE: fails on fixable CRITICAL/HIGH
  -> push the exact scanned images to Docker Hub   [push to main only]

CD (.github/workflows/cd.yml)
  triggered when CI succeeds on a *push* to main
  -> scp deploy/ to the RHEL server
  -> ssh in, run deploy/scripts/deploy.sh:
       install upstream confs -> pull images -> start idle color
       -> health check -> switch nginx symlink -> reload -> stop old color
```

## 1. GitHub Secrets

**Settings > Secrets and variables > Actions**. None of these are required for
CI to pass; each one unlocks a stage.

| Secret | Required for | Purpose |
| --- | --- | --- |
| `DOCKERHUB_USERNAME` | pushing + CD | Docker Hub account/org that owns the images |
| `DOCKERHUB_TOKEN` | pushing | Docker Hub access token (Account Settings > Personal access tokens) |
| `SONAR_TOKEN` | Sonar stage | Token from your SonarQube/SonarCloud project |
| `SONAR_HOST_URL` | Sonar stage | `https://sonarcloud.io`, or your self-hosted SonarQube URL |
| `RHEL_HOST` | CD | RHEL server's IP or hostname |
| `RHEL_USER` | CD | SSH deploy user on that server |
| `RHEL_SSH_KEY` | CD | Private key (PEM) for `RHEL_USER`; public half goes in the server's `~/.ssh/authorized_keys` |
| `NVD_API_KEY` | Dependency-Check | Strongly recommended. Without it NVD throttles the CVE feed hard and the step usually times out. Free at nvd.nist.gov/developers/request-an-api-key |

## 2. SonarQube

Easiest path: **SonarCloud** (sonarcloud.io) - no server to run.

1. Sign in to sonarcloud.io with your GitHub account.
2. "+" > Analyze new project, pick this repo.
3. It creates a project key - make sure it matches `sonar.projectKey` in
   [sonar-project.properties](../sonar-project.properties) (currently
   `howdz-dashboard`), or edit that file to match what SonarCloud generated.
4. My Account > Security > generate a token -> save as `SONAR_TOKEN`.
5. `SONAR_HOST_URL` = `https://sonarcloud.io`.

Self-hosting instead (`docker run -d -p 9000:9000 sonarqube:lts-community`)
works, but you own its upkeep: disk, upgrades, backups.

> The workflow uses `sonarqube-scan-action@v6`. Do not downgrade. `v3` is a
> **Docker** action that runs as root and leaves root-owned `.scannerwork/` in
> the workspace, which breaks the *next* run's checkout on a self-hosted runner.
> `v5` prints a warning that it "contains a security vulnerability".

## 3. RHEL server prep (one-time)

```bash
# Docker + nginx
sudo dnf install -y docker nginx curl
sudo systemctl enable --now docker nginx

# Deploy user (or reuse an existing one) needs:
#  - membership in the docker group
sudo usermod -aG docker <RHEL_USER>

#  - passwordless sudo for exactly these two commands. deploy.sh invokes them by
#    absolute path so the sudoers match is unambiguous.
echo '<RHEL_USER> ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload nginx, /usr/sbin/nginx -t' \
  | sudo tee /etc/sudoers.d/howdz-deploy
sudo visudo -cf /etc/sudoers.d/howdz-deploy   # verify before you log out

# App + nginx-includes directories.
# /etc/nginx/howdz must be OWNED BY THE DEPLOY USER: deploy.sh writes the
# upstream confs and flips the active-* symlinks there without sudo.
sudo mkdir -p /opt/howdz /etc/nginx/howdz
sudo chown <RHEL_USER>:<RHEL_USER> /opt/howdz /etc/nginx/howdz

# Seed the initial active color (blue) before the first deploy. deploy.sh
# refreshes the four colour confs on every run; only the symlinks and the site
# config below are genuinely one-time.
cp deploy/nginx/frontend-blue.conf deploy/nginx/frontend-green.conf \
   deploy/nginx/backend-blue.conf deploy/nginx/backend-green.conf \
   /etc/nginx/howdz/
ln -sfn /etc/nginx/howdz/frontend-blue.conf /etc/nginx/howdz/active-frontend-upstream.conf
ln -sfn /etc/nginx/howdz/backend-blue.conf  /etc/nginx/howdz/active-backend-upstream.conf

# Site config that ties it together
sudo cp deploy/nginx/howdz.conf /etc/nginx/conf.d/howdz.conf
sudo nginx -t && sudo systemctl reload nginx

# If your Docker Hub repos are PRIVATE, the server must be able to pull them.
# (CI's `docker login` happens on the runner, not here.)
docker login -u <DOCKERHUB_USERNAME>

# SELinux: RHEL blocks nginx from proxying to localhost ports by default.
sudo setsebool -P httpd_can_network_connect 1

# Open port 80 (and 443 if you add TLS later)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

### Self-hosted runner

Both workflows use `runs-on: self-hosted`, so jobs run on your own RHEL server.
(CD then SSHes to `RHEL_HOST` - the same box. That is intentional: the deploy
path stays identical if you later move the runner elsewhere.)

1. Repo **Settings > Actions > Runners > New self-hosted runner**, pick
   Linux/x64, and follow the generated `config.sh` commands on the server. The
   registration token expires in minutes, so paste them promptly.
2. The runner needs **Node.js 22** on the box - `npm ci`, `npm run lint` and
   `npm run build:docker` run on the runner itself, not in a container.
   Node 20 reached EOL on 2026-04-30.
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
   sudo dnf install -y nodejs
   ```
3. Docker (installed above) is required: Dependency-Check runs as a container,
   and the Buildx/Trivy steps build and scan images directly.
4. Install as a service so it survives reboots:
   `sudo ./svc.sh install <RHEL_USER> && sudo ./svc.sh start`.
5. **Security note:** a self-hosted runner executes workflow code with
   `<RHEL_USER>`'s permissions - and that user is in the `docker` group, which
   is root-equivalent. Fine for a private repo you fully control. Never attach
   this runner to a public repo, and set **Settings > Actions > General > Fork
   pull request workflows** to require approval.

Generate an SSH key pair for GitHub Actions and authorize it:

```bash
ssh-keygen -t ed25519 -f howdz_deploy_key -N ""
# copy howdz_deploy_key.pub into ~<RHEL_USER>/.ssh/authorized_keys on the server
# paste the contents of howdz_deploy_key (private key) into the RHEL_SSH_KEY secret
```

## 4. Docker Hub

Create two repos (or let the first push auto-create them, if your plan allows):
`<your-username>/howdz-frontend` and `<your-username>/howdz-backend`.

## 5. First deploy

Push to `main`. CI builds/scans/pushes images, then CD SSHes in and runs
`deploy/scripts/deploy.sh`, which starts the **green** color (blue is the seeded
initial state), health-checks it, flips nginx to green, and stops blue. Every
subsequent deploy alternates the other way.

## Supply-chain notes

- `aquasecurity/trivy-action` was **compromised in March 2026** - every tag from
  `0.0.1` through `0.34.2` was retagged to a credential stealer. Upstream re-cut
  all tags with a `v` prefix afterwards, which is why this workflow pins
  `@v0.36.0` and not `@0.36.0`. Move to a commit SHA once you have verified one.
- On a self-hosted runner a malicious action gets your Docker socket and every
  secret in the job. Prefer SHA pins over floating tags - `@main` especially -
  for anything third-party.
- The push step does `docker tag` + `docker push` on the byte-identical image
  Trivy scanned, rather than re-running `build-push-action`. A rebuild is not
  guaranteed to reproduce the digest that passed the gate.

## Scan strictness

| Scan | Behaviour | Why |
| --- | --- | --- |
| OWASP Dependency-Check | `continue-on-error`, report uploaded as an artifact | NVD availability is flaky and DC is noisy on npm trees; not a useful merge blocker |
| SonarQube Quality Gate | Blocks | Your own code, your own rules |
| Trivy (both images) | **Blocks** on CRITICAL/HIGH, with `--ignore-unfixed` | Fixable CVEs in a shipping image are actionable; unfixed ones are not |

To accept a specific Trivy finding, add it to [`.trivyignore`](../.trivyignore)
with an owner and an expiry date.

## Note on the backend

[backend/](../backend) is a placeholder (a one-route Express health check) so the
pipeline has a real second image to build, scan and deploy end to end. Replace it
with your actual backend service, or delete `backend/` and the backend-related
steps in `.github/workflows/ci.yml` / `cd.yml` and `deploy/scripts/deploy.sh` if
this project stays frontend-only.

Note `backend/.dockerignore`: the repo-root `.dockerignore` does **not** apply to
the `backend/` build context. Without it, `COPY . .` copies the host's
`node_modules` (dev deps included) over the `--omit=dev` install.

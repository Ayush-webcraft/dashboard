# CI/CD Setup

This describes the one-time setup needed for `.github/workflows/ci.yml` and
`.github/workflows/cd.yml` to run. The pipeline itself needs no further code
changes - everything below happens in GitHub repo settings and on the RHEL
server.

## Architecture

```
CI (.github/workflows/ci.yml)
  checkout -> npm install -> lint
  -> OWASP Dependency Check -> SonarQube scan -> Quality Gate
  -> build frontend + backend Docker images
  -> Trivy image scan (fails on CRITICAL/HIGH)
  -> push both images to Docker Hub   [main branch only]

CD (.github/workflows/cd.yml)
  triggered when CI succeeds on main
  -> scp deploy/ to the RHEL server
  -> ssh in, run deploy/scripts/deploy.sh:
       pull latest images -> start idle color -> health check
       -> switch nginx upstream -> reload nginx -> stop old color
```

## 1. GitHub Secrets

Add these under **Settings > Secrets and variables > Actions**:

| Secret | Purpose |
| --- | --- |
| `DOCKERHUB_USERNAME` | Docker Hub account/org that owns the images |
| `DOCKERHUB_TOKEN` | Docker Hub access token (Account Settings > Security > New Access Token) |
| `SONAR_TOKEN` | Token from your SonarQube/SonarCloud project |
| `SONAR_HOST_URL` | `https://sonarcloud.io`, or your self-hosted SonarQube URL |
| `RHEL_HOST` | RHEL server's IP or hostname |
| `RHEL_USER` | SSH deploy user on that server |
| `RHEL_SSH_KEY` | Private key (PEM) for `RHEL_USER`; public half goes in the server's `~/.ssh/authorized_keys` |
| `NVD_API_KEY` | Optional. Speeds up OWASP Dependency Check's CVE database download - request one free at nvd.nist.gov |

## 2. SonarQube (you said you're not familiar with this)

Easiest path: use **SonarCloud** (sonarcloud.io) instead of self-hosting -
no server to run.

1. Sign in to sonarcloud.io with your GitHub account.
2. "+" > Analyze new project, pick this repo.
3. It creates a project key - make sure it matches `sonar.projectKey` in
   [sonar-project.properties](../sonar-project.properties) (currently
   `howdz-dashboard`), or edit that file to match what SonarCloud generated.
4. My Account > Security > generate a token -> save as `SONAR_TOKEN`.
5. `SONAR_HOST_URL` = `https://sonarcloud.io`.

If you'd rather self-host SonarQube, `docker run -d -p 9000:9000 sonarqube:lts-community`
on any server works, but then you own its upkeep (disk, upgrades, backups) -
not recommended just to get this pipeline running.

## 3. RHEL server prep (one-time)

```bash
# Docker + nginx
sudo dnf install -y docker nginx
sudo systemctl enable --now docker nginx

# Deploy user (or reuse an existing one) needs:
#  - membership in the docker group
sudo usermod -aG docker <RHEL_USER>

#  - passwordless permission to reload nginx (deploy.sh calls this without sudo password)
echo '<RHEL_USER> ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload nginx, /usr/sbin/nginx -t' \
  | sudo tee /etc/sudoers.d/howdz-deploy

# App + nginx-includes directories
sudo mkdir -p /opt/howdz /etc/nginx/howdz
sudo chown <RHEL_USER>:<RHEL_USER> /opt/howdz

# Seed the initial active color (blue) before the first deploy
sudo cp deploy/nginx/frontend-blue.conf deploy/nginx/frontend-green.conf \
        deploy/nginx/backend-blue.conf deploy/nginx/backend-green.conf \
        /etc/nginx/howdz/
sudo ln -sfn /etc/nginx/howdz/frontend-blue.conf /etc/nginx/howdz/active-frontend-upstream.conf
sudo ln -sfn /etc/nginx/howdz/backend-blue.conf /etc/nginx/howdz/active-backend-upstream.conf

# Site config that ties it together
sudo cp deploy/nginx/howdz.conf /etc/nginx/conf.d/howdz.conf
sudo nginx -t && sudo systemctl reload nginx

# Open port 80 (and 443 if you add TLS later)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

### Self-hosted runner

Both workflows use `runs-on: self-hosted` so jobs run on your own RHEL
server instead of GitHub-hosted minutes.

1. Repo **Settings > Actions > Runners > New self-hosted runner**, pick
   Linux/x64, and follow the generated `config.sh` commands on the RHEL
   server (the registration token in those commands expires in minutes,
   so copy/paste them promptly).
2. The runner needs **Node.js 20** installed directly on the server -
   `npm ci` / `npm run lint` / `npm run build:docker` in `ci.yml` run on
   the runner itself, not inside a container:
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
   sudo dnf install -y nodejs
   ```
3. Docker (installed above) is also required here: the
   `dependency-check` and `sonarqube-scan-action` steps run as container
   actions, and the Buildx/Trivy steps build and scan images directly.
4. Install as a service so it survives reboots and reconnects
   automatically: `sudo ./svc.sh install <RHEL_USER> && sudo ./svc.sh start`.
5. Security note: a self-hosted runner executes workflow code (including
   from PRs) with `<RHEL_USER>`'s permissions. Fine for a private repo
   you fully control; don't reuse it for public repos or ones with
   untrusted contributors.

Generate an SSH key pair for GitHub Actions and authorize it:

```bash
ssh-keygen -t ed25519 -f howdz_deploy_key -N ""
# copy howdz_deploy_key.pub into ~<RHEL_USER>/.ssh/authorized_keys on the server
# paste the contents of howdz_deploy_key (private key) into the RHEL_SSH_KEY secret
```

## 4. Docker Hub

Create two repos (or let the first push auto-create them, if your plan
allows it): `<your-username>/howdz-frontend` and `<your-username>/howdz-backend`.

## 5. First deploy

Push to `main`. CI builds/scans/pushes images, then CD SSHes in and runs
`deploy/scripts/deploy.sh`, which starts the **green** color (since blue is
the seeded initial state), health-checks it, flips nginx to green, and
stops blue. Every subsequent deploy alternates the other way.

## Note on the backend

[backend/](../backend) is a placeholder (a one-route Express health check)
so the pipeline has a real second image to build, scan and deploy end to
end. Replace it with your actual backend service, or delete `backend/` and
the backend-related steps in `.github/workflows/ci.yml` / `cd.yml` and
`deploy/scripts/deploy.sh` if this project is staying frontend-only.

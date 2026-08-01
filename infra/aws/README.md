# AWS Deployment Notes

Region: `us-east-1`

## EC2 Instances

| Environment | Name | Instance ID | Public IP | Public DNS |
| --- | --- | --- | --- | --- |
| dev | `taskflow-dev` | `i-0707bd71180e44802` | `44.200.255.16` | `ec2-44-200-255-16.compute-1.amazonaws.com` |
| prod | `taskflow-prod` | `i-004c5b847b8c0a0df` | `13.218.203.208` | `ec2-13-218-203-208.compute-1.amazonaws.com` |

Security group: `taskflow-ec2-sg` / `sg-0c0e55914c607d87b`

Open inbound ports:
- `22` from current admin IP only
- `80` from anywhere
- `443` from anywhere
- `3000` from anywhere

Both instances have Docker, Docker Compose plugin, Git, jq, and a persistent 16GB swap file installed by `ec2-user-data.sh`.

## Production RDS PostgreSQL

RDS instance: `taskflow-prod-postgres`

| Setting | Value |
| --- | --- |
| Engine | PostgreSQL 18.3 |
| Instance class | `db.t4g.micro` |
| Storage | 20GB `gp2` |
| Public access | `false` |
| Deletion protection | `true` |
| Endpoint | `taskflow-prod-postgres.cotisaaa8xxt.us-east-1.rds.amazonaws.com` |
| Port | `5432` |
| Database | `tasks` |
| Master username | `postgres` |
| SSL | required (`DB_SSL=true`) |

RDS security group: `taskflow-prod-rds-sg` / `sg-0b46563aea2939034`

Inbound database access is allowed only from the EC2 security group `sg-0c0e55914c607d87b`.

## GitHub Self-Hosted Runner Registration

Runner binaries are already downloaded to `~/actions-runner` on both EC2 instances.

In GitHub, open:

`Settings` -> `Actions` -> `Runners` -> `New self-hosted runner` -> `Linux` -> `x64`

Use the generated token in the commands below.

### Dev Runner

SSH/Connect to `taskflow-dev`, then run:

```bash
cd ~/actions-runner
./config.sh --url https://github.com/vasylpryimakdev/nest-js-task-flow --token YOUR_DEV_TOKEN --name taskflow-dev-runner --labels dev --unattended
sudo ./svc.sh install ubuntu
sudo ./svc.sh start
```

### Prod Runner

SSH/Connect to `taskflow-prod`, then run:

```bash
cd ~/actions-runner
./config.sh --url https://github.com/vasylpryimakdev/nest-js-task-flow --token YOUR_PROD_TOKEN --name taskflow-prod-runner --labels prod --unattended
sudo ./svc.sh install ubuntu
sudo ./svc.sh start
```

## Cost Note

<<<<<<< HEAD
The AWS account rejected `t3.xlarge` because non-free-tier instance types are blocked. The current instances are `t3.micro` with 16GB swap as a budget-safe fallback. For strict compliance with the 12GB RAM requirement, upgrade both instances to `t3.xlarge` after removing the AWS free-tier-only restriction.
=======
The AWS account rejected `t3.xlarge` because non-free-tier instance types are blocked. The current instances are `t3.micro`, which is the practical free-tier-compatible option, with 16GB swap as a budget-safe fallback. For strict compliance with the 12GB RAM requirement, upgrade both instances to `t3.xlarge` or another 12GB+ RAM instance type after removing the AWS free-tier-only restriction.
>>>>>>> 1162c98874ffdb0c1358fb785a93e75529d84738

RDS was created as `db.t4g.micro` with 20GB storage and 1-day backup retention because this account also enforces free-tier RDS restrictions.

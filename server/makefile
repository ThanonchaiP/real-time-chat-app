VERSION ?= latest
AWS_REGION = ap-southeast-7
AWS_ACCOUNT_ID = 654654507595
ECR_REPOSITORY = chatapp-server
ECR_URL = $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(ECR_REPOSITORY)

build-image:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
	docker buildx build --no-cache -f Dockerfile -t $(ECR_URL):$(VERSION) --platform linux/amd64 . --push
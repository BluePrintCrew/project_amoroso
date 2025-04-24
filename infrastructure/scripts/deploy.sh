#!/bin/bash

# Script to upload SpringBoot JAR file to S3 and restart the application on EC2 instances

# Check usage
if [ $# -lt 2 ]; then
    echo "Usage: $0 <environment(dev/prod)> <JAR_file_path> [bucket_name]"
    echo "Example: $0 dev ../backend/build/libs/application.jar"
    exit 1
fi

ENV=$1
JAR_PATH=$2
BUCKET_NAME=${3:-""}  # Get from OpenTofu output if not specified

# Check if JAR file exists
if [ ! -f "$JAR_PATH" ]; then
    echo "Error: JAR file not found: $JAR_PATH"
    exit 1
fi

# Check if environment directory exists
ENV_DIR="../environments/$ENV"
if [ ! -d "$ENV_DIR" ]; then
    echo "Error: Environment directory not found: $ENV_DIR"
    exit 1
fi

# Get bucket name from OpenTofu output if not provided
if [ -z "$BUCKET_NAME" ]; then
    echo "Getting S3 bucket name..."
    cd "$ENV_DIR"
    BUCKET_NAME=$(tofu output -raw s3_bucket_name 2>/dev/null)
    cd - > /dev/null

    if [ -z "$BUCKET_NAME" ]; then
        echo "Error: Could not get S3 bucket name. Please specify it explicitly."
        exit 1
    fi
    
    echo "Using S3 bucket: $BUCKET_NAME"
fi

# Extract JAR file name
JAR_FILENAME="application.jar"

# Upload JAR file to S3
echo "Uploading JAR file to S3..."
aws s3 cp "$JAR_PATH" "s3://$BUCKET_NAME/$JAR_FILENAME"

if [ $? -ne 0 ]; then
    echo "Error: Failed to upload JAR file"
    exit 1
fi

echo "JAR file successfully uploaded to: s3://$BUCKET_NAME/$JAR_FILENAME"

# Find EC2 instances and restart SpringBoot service
echo "Restarting application on EC2 instances..."

# Get Auto Scaling Group name
cd "$ENV_DIR"
ASG_NAME="${ENV}-backend-asg"
cd - > /dev/null

# Get instance IDs from ASG
INSTANCE_IDS=$(aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names "$ASG_NAME" --query "AutoScalingGroups[0].Instances[*].InstanceId" --output text)

if [ -z "$INSTANCE_IDS" ]; then
    echo "Warning: No running EC2 instances found."
    echo "Deployment completed, but the new version will be automatically downloaded when instances start."
    exit 0
fi

# Restart service on each instance
for INSTANCE_ID in $INSTANCE_IDS; do
    echo "Restarting SpringBoot service on instance $INSTANCE_ID..."
    aws ssm send-command \
        --instance-ids "$INSTANCE_ID" \
        --document-name "AWS-RunShellScript" \
        --parameters "commands=[ \
            \"aws s3 cp s3://$BUCKET_NAME/$JAR_FILENAME /opt/app/application.jar\", \
            \"sudo chown ec2-user:ec2-user /opt/app/application.jar\", \
            \"sudo chmod 755 /opt/app/application.jar\", \
            \"sudo systemctl restart springboot.service\" \
        ]" \
        --comment "SpringBoot application redeployment" > /dev/null

    if [ $? -eq 0 ]; then
        echo "Command successfully sent to instance $INSTANCE_ID."
        echo "Deployment completed!"
        echo "The application will be running with the new version in a few seconds."
    else
        echo "Warning: Failed to send command to instance $INSTANCE_ID. Make sure the instance is running the SSM agent."
    fi
done


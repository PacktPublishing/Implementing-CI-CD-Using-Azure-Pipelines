# Confirm Parameters
echo "ENVIRONMENT_NAME: $1"
echo "SERVICE_NAME: $2"
echo "AWS_REGION: $3"
echo "REPO_NAME: $4"
echo "CONTAINER_TAG: $5"
echo "CATALOG_API_URL_VALUE: $6"
echo "CART_API_URL_VALUE: $7"
echo "CHECKOUT_API_URL_VALUE: $8"
aws lightsail update-container-service --service-name $2-$1-frontend --region $3 --private-registry-access ecrImagePullerRole={isActive=true}
echo "Waiting for container service to be ready..."
sleep 30 
echo "Retrieving container service private registry principal ARN..."
principal_arn=`aws lightsail get-container-services --service-name $2-$1-frontend --region $3 --query "containerServices[0].privateRegistryAccess.ecrImagePullerRole.principalArn" --output text`
# Aply ECR policy
echo "Applying ECR policy..."
sed "s/IamRolePrincipalArn/${principal_arn}/g" ecr-policy-template.json > ecr-policy.json
aws ecr set-repository-policy --repository-name $3 --policy-text file://ecr-policy.json
# Create Deployment
account_id=`aws sts get-caller-identity --query "Account" --output text`
echo "Creating deployment..."
aws lightsail create-container-service-deployment --service-name $2-$1-frontend --region $3 --containers frontend=image="$account_id.dkr.ecr.$3.amazonaws.com/$4:$5",environment={CATALOG_API_URL="$6",CART_API_URL="$7",CHECKOUT_API_URL="$8"},ports={80="HTTP"} --public-endpoint containerName=frontend,containerPort=80,healthCheck={healthyThreshold=2,unhealthyThreshold=30,timeoutSeconds=5,intervalSeconds=30,path="/",successCodes=200}
echo "Deployment created successfully!"
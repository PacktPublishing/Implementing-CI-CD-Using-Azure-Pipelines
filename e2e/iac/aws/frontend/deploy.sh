# Confirm Parameters
echo "ENVIRONMENT_NAME: $1"
echo "SERVICE_NAME: $2"
echo "AWS_REGION: $3"
echo "REPO_NAME: $4"
echo "CONTAINER_TAG: $5"
echo "CATALOG_API_URL_VALUE: $6"
echo "CART_API_URL_VALUE: $7"
echo "CHECKOUT_API_URL_VALUE: $8"
aws lightsail update-container-service --service-name $2-$1-frontend --region $3 --private-registry-access file://private-registry-access.json 
echo "Waiting for container service to be ready..."
principal_arn=""
until [ "$principal_arn" != "" ]
do
    sleep 5
    principal_arn=`aws lightsail get-container-services --service-name $2-$1-frontend --region $3 --query "containerServices[0].privateRegistryAccess.ecrImagePullerRole.principalArn" --output text`
done
echo "Principal ARN: $principal_arn"
# Aply ECR policy
echo "Applying ECR policy..."
sed "s|IamRolePrincipalArn|$principal_arn|g" ecr-policy-template.json > ecr-policy.json
aws ecr set-repository-policy --repository-name $4 --policy-text file://ecr-policy.json
# Create Deployment
account_id=`aws sts get-caller-identity --query "Account" --output text`
sed "s|AWSACCOUNTID|$account_id|g ; s|AWSREGION|$3|g ; s|REPO_NAME|$4|g ; s|CONTAINERTAG|$5|g ; s|CATALOG_API_URL_VALUE|$6|g ; s|CART_API_URL_VALUE|$7|g ; s|CHECKOUT_API_URL_VALUE|$8|g" deployment-template.json > deployment.json
echo "Creating deployment..."
aws lightsail create-container-service-deployment --service-name $2-$1-frontend --region $3 --cli-input-json file://deployment.json
echo "Deployment created successfully!"
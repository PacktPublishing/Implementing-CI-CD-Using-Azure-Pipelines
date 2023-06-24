# Confirm Parameters
echo "SERVICE_NAME: $1"
echo "AWS_REGION: $2"
echo "REPO_NAME: $3"
echo "CONTAINER_TAG: $4"
echo "CATALOG_API_URL_VALUE: $5"
echo "CART_API_URL_VALUE: $6"
echo "CHECKOUT_API_URL_VALUE: $7"
aws lightsail update-container-service --service-name $1 --region $2 --private-registry-access file://private-registry-access.json 
echo "Waiting for container service to be ready..."
principal_arn=""
until [ "$principal_arn" != "" ]
do
    sleep 5
    principal_arn=`aws lightsail get-container-services --service-name $1 --region $2 --query "containerServices[0].privateRegistryAccess.ecrImagePullerRole.principalArn" --output text`
done
echo "Principal ARN: $principal_arn"
# Aply ECR policy
echo "Applying ECR policy..."
sed "s|IamRolePrincipalArn|$principal_arn|g" ecr-policy-template.json > ecr-policy.json
aws ecr set-repository-policy --repository-name $3 --policy-text file://ecr-policy.json
# Create Deployment
account_id=`aws sts get-caller-identity --query "Account" --output text`
sed "s|AWSACCOUNTID|$account_id|g ; s|AWSREGION|$2|g ; s|REPO_NAME|$3|g ; s|CONTAINERTAG|$4|g ; s|CATALOG_API_URL_VALUE|$5|g ; s|CART_API_URL_VALUE|$6|g ; s|CHECKOUT_API_URL_VALUE|$7|g" deployment-template.json > deployment.json
echo "Creating deployment..."
aws lightsail create-container-service-deployment --service-name $1 --region $2 --cli-input-json file://deployment.json
state="DEPLOYING"
until [ "$state" != "DEPLOYING" ]
do
    sleep 5
    state=`aws lightsail get-container-services --service-name $1 --region $2 --query "containerServices[0].state" --output text`
done
if [ "$state" == "RUNNING" ]
then
    echo "Deployment created successfully!"
else
    echo "Deployment failed!"
    exit 1
fi

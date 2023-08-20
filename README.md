# AWS Setup and Configuration Cheatsheet
This lecture note is not intended to be a replacement for the videos, but to serve as a cheat sheet for students who want to quickly run thru the AWS configuration steps or easily see if they missed a step. It will also help navigate through the changes to the AWS UI since the course was recorded.

### S3 Bucket Creation and Configuration
Go to AWS Management Console and use the search bar to find S3

Click Create Bucket

Specify an AWS Region

Provide unique Bucket Name and click Create Bucket

Click the new Bucket you have created from the Bucket list.

Select Properties

Scroll down to Static website hosting and click Edit

Change to Enable

Enter index.html in the Index document field

Click Save changes

Select Permissions

Click Edit in Block all public access

Untick the Block all public access box.

Click Save changes

Type confirm in the field and click Confirm

Find the Bucket Policy and click Edit

Click Policy generator

Change Policy type to S3 Bucket Policy

Set Principle to *

Set Action to Get Object

Copy the S3 bucket ARN to add to the ARN field and add /* to the end.
eg: arn:aws:s3:::mfe-dashboard/*

Click Add Statement

Click Generate Policy

Copy paste the generated policy text to the Policy editor

Click Save changes


CloudFront setup
Go to AWS Management Console and use the search bar to find CloudFront

Click Create distribution

Set Origin domain to your S3 bucket

Find the Default cache behavior section and change Viewer protocol policy to Redirect HTTP to HTTPS

Scroll down and click Create Distribution

After Distribution creation has finalized click the Distribution from the list, find its Settings and click Edit

Scroll down to find the Default root object field and enter /container/latest/index.html

Click Save changes

Click Error pages

Click Create custom error response

Change HTTP error code to 403: Forbidden

Change Customize error response to Yes

Set Response page path to /container/latest/index.html

Set HTTP Response Code to 200: OK


Create IAM user
1. Search for "IAM"

2. Click "Create Individual IAM Users" and click "Manage Users"

3. Click "Add User"

4. Enter any name you’d like in the "User Name" field.

5. Click "Next"

6. Click "Attach Policies Directly"

7. Use the search bar to find and tick AmazonS3FullAccess and CloudFrontFullAccess

8. Click "Next"

9. Click "Create user"

10. Select the IAM user that was just created from the list of users

11. Click "Security Credentials"

12. Scroll down to find "Access Keys"

13. Click "Create access key"

14. Select "Command Line Interface (CLI)"

15. Scroll down and tick the "I understand..." check box and click "Next"

16. Copy and/or download the Access Key ID and Secret Access Key to use for deployment.



# Key Creation Update + Reminder on AWS_DEFAULT_REGION
Update for Generating Keys
In the upcoming lecture, we will be creating an IAM user and then generating a key pair for deployment. There is a minor required change to this flow. Instead of being prompted to create a key pair during the IAM user creation, you must first create the IAM user, then, create a key pair associated with that user. AWS has also changed the terminology from Programmatic Access to Command Line Interface (CLI).

Full updated instructions can be found below:

1. Search for "IAM"

2. Click "Create Individual IAM Users" and click "Manage Users"

3. Click "Add User"

4. Enter any name you’d like in the "User Name" field.

5. Click "Next"

6. Click "Attach Policies Directly"

7. Use the search bar to find and tick AmazonS3FullAccess and CloudFrontFullAccess

8. Click "Next"

9. Click "Create user"

10. Select the IAM user that was just created from the list of users

11. Click "Security Credentials"

12. Scroll down to find "Access Keys"

13. Click "Create access key"

14. Select "Command Line Interface (CLI)"


15. Scroll down and tick the "I understand..." check box and click "Next"

16. Copy and/or download the Access Key ID and Secret Access Key to use for deployment.

Reminder on AWS_DEFAULT_REGION
A few lectures ago we mentioned the need to use a different action and left a placeholder for the AWS_DEFAULT_REGION key.

Let's make sure this gets set correctly now.

In the AWS Dashboard use the Services search bar to find S3 and load its dashboard. Once there, copy the AWS region listed to the right of your bucket:


Then, in your container.yml, paste in the value for the AWS_DEFAULT_REGION like so:

      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://${{ secrets.AWS_S3_BUCKET_NAME }}/container/latest
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ca-central-1


# AWS Region with Automatic Invalidation
In the upcoming lecture, we will be adding automatic invalidation to our Container Workflow (and in a few lectures the Marketing Workflow).

If you are using the suggested shinyinc/action-aws-cli@v1.2 action, you will need to add the AWS Region to the variables associated with the create invalidation run step: 

- run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/container/latest/index.html"
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: ca-central-1


Important - Remember to replace us-east-2 with whatever your actual region is.
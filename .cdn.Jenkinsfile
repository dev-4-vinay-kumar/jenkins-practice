pipeline {
    agent any

    environment {
        AWS_CREDENTIALS = credentials('AWS_S3_CREDENTIALS_ID') // AWS credentials ID in Jenkins
        S3_BUCKET = 'your-s3-bucket-name'
        DIST_DIRECTORY = 'dist' // Directory containing build files
        BUILD_VERSION = "build-${env.BUILD_NUMBER}" // Unique version for each build
        MAX_BUILDS_TO_KEEP = 5
        CLOUDFRONT_DISTRIBUTION_ID = 'YOUR_CLOUDFRONT_DISTRIBUTION_ID' // CloudFront distribution ID
        AWS_REGION = 'us-west-2' // Specify your S3 bucket region here
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Upload to S3 with Versioning') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: AWS_CREDENTIALS]]) {
                    script {
                        // Upload current build version to S3
                        sh """
                        aws s3 sync ${DIST_DIRECTORY} s3://${S3_BUCKET}/${BUILD_VERSION} \
                        --acl public-read \
                        --delete \
                        --region ${AWS_REGION}
                        """
                    }
                }
            }
        }

        stage('Invalidate CloudFront Cache') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: AWS_CREDENTIALS]]) {
                    script {
                        // Create CloudFront invalidation for the entire cache or a specific path
                        sh """
                        aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
                        --paths "/*" \
                        --region ${AWS_REGION}
                        """
                    }
                }
            }
        }

        stage('Cleanup Old Builds') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: AWS_CREDENTIALS]]) {
                    script {
                        // List and remove old build versions in S3
                        def buildList = sh(
                            script: "aws s3 ls s3://${S3_BUCKET}/ --region ${AWS_REGION} | grep 'PRE build-' | awk '{print \$2}' | sort -r",
                            returnStdout: true
                        ).trim().split("\n")
                        
                        if (buildList.size() > MAX_BUILDS_TO_KEEP) {
                            buildList.drop(MAX_BUILDS_TO_KEEP).each { oldBuild ->
                                sh "aws s3 rm s3://${S3_BUCKET}/${oldBuild} --recursive --region ${AWS_REGION}"
                                echo "Deleted old build version: ${oldBuild}"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Build version ${BUILD_VERSION} uploaded successfully and CloudFront cache invalidated!"
        }
        failure {
            echo "Deployment failed. Check logs for details."
        }
    }
}

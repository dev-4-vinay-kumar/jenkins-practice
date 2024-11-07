pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS_ID = 'DEV_GIT' // ID of GitHub token in Jenkins credentials
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/dev-4-vinay-kumar/jenkins-practice.git',
                    credentialsId: GITHUB_CREDENTIALS_ID
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test-contianer'
            }
        }
    }

    post {
        success {
            echo 'Tests ran successfully!'
        }
        failure {
            echo 'Tests failed. Check logs for details.'
        }
    }
}

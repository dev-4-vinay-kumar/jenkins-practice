pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/dev-4-vinay-kumar/jenkins-practice.git'
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

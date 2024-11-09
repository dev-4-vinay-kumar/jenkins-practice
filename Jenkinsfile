pipeline {
    agent any

    environment {
        SHARED_VOLUME = "shared_volume"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                          branches: [[name: 'main']],
                          userRemoteConfigs: [[url: 'https://github.com/dev-4-vinay-kumar/jenkins-practice.git']]
                ])
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh 'npm run test-container'
                }
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
        cleanup {
            script {
                sh "docker-compose -f docker-compose.test.yml down --volumes --remove-orphans || true"                
            }
        }

    }
}

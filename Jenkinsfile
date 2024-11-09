pipeline {
    agent any

    environment {
        SONAR_PROJECT_KEY = "test-express-app"
        SONAR_PROJECT_NAME = "test-express-app"
        SONAR_HOST_URL = "http://sonarqube:9000" 
        SONAR_TEST_EXPRESS_APP_TOKEN = credentials('SONAR_TEST_EXPRESS_APP_TOKEN')
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

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonarqube'
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner " +
                           "-D sonar.projectKey=${SONAR_PROJECT_KEY} " +
                           "-D sonar.projectName=${SONAR_PROJECT_NAME} " +
                           "-D sonar.host.url=${SONAR_HOST_URL} " +
                           "-D sonar.login=${SONAR_TEST_EXPRESS_APP_TOKEN}"
                    }
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
                sh "docker-compose -f docker-compose.test.yml down --volumes --rmi all --remove-orphans || true"                
            }
        }

    }
}

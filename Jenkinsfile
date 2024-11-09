pipeline {
    agent any

    tools {
        sonarQube 'SonarQubeScanner' // Use the name defined in "Manage Jenkins > Global Tool Configuration"
    }


    environment {
        SONAR_PROJECT_KEY = "test-express-app"
        SONAR_PROJECT_NAME = "test-express-app"
        SONAR_HOST_URL = "http://sonarqube:9000" 
        SONAR_TOKEN = credentials('SONAR_TEST_EXPRESS_APP_TOKEN')
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
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv('SonarQubeServer') {
                        sh "${scannerHome}/bin/sonar-scanner " +
                           "-Dsonar.projectKey=${SONAR_PROJECT_KEY} " +
                           "-Dsonar.projectName=${SONAR_PROJECT_NAME} " +
                           "-Dsonar.host.url=${SONAR_HOST_URL} " +
                           "-Dsonar.login=${SONAR_LOGIN_TOKEN}"
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

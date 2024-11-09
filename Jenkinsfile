pipeline {
    agent any

    environment {
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

        stage('SonarQube analysis') {
            steps {
                script {
                    scannerHome = tool '<SonarQube Scanner>'// must match the name of an actual scanner installation directory on your Jenkins build agent
                }
                withSonarQubeEnv('<SonarQube>') {// If you have configured more than one global server connection, you can specify its name as configured in Jenkins
                sh "${scannerHome}/bin/sonar-scanner"
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

pipeline {
    agent any

    environment {
        TEST_APP_CONTAINER_ID = ''
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

        stage('setup container for Tests and Run Tests') {
            steps {
                sh 'docker-compose -f docker-compose.test.yml up -d'

                TEST_APP_CONTAINER_ID = sh(
                        script: "docker-compose -f docker-compose.test.yml ps -q app",
                        returnStdout: true
                    ).trim()

                sh "docker cp . ${TEST_APP_CONTAINER_ID}:/app"

                sh "docker exec ${TEST_APP_CONTAINER_ID} npm run test"

                if(TEST_APP_CONTAINER_ID){
                    sh 'docker-compose -f docker-compose.test.yml down --volumes'
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
    }
}

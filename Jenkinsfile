pipeline {
    agent any

    
    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                          branches: [[name: 'main']],
                          userRemoteConfigs: [[url: 'https://github.com/dev-4-vinay-kumar/jenkins-practice.git']]
                ])
            }
        }

        stage('Setup Container for Tests and Run Tests') {
            steps {
                script {
                    sh 'npm run test-container'

                    def testAppContainerId = sh(
                        script: "docker-compose -f docker-compose.test.yml ps -q app",
                        returnStdout: true
                    ).trim()

                    sh "docker cp . ${testAppContainerId}:/app"

                }
            }
        }
    }

    post {
        success {
            sh 'docker-compose -f docker-compose.test.yml down --volumes'
            echo 'Tests ran successfully!'
        }
        failure {
            echo 'Tests failed. Check logs for details.'
        }
    }
}

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
                    sh 'docker-compose -f docker-compose.test.yml up -d'

                    def testAppContainerId = sh(
                        script: "docker-compose -f docker-compose.test.yml ps -q app",
                        returnStdout: true
                    ).trim()

                    sh "echo ${testAppContainerId}"

                    def testAppDbContainerId = sh(
                        script: "docker-compose -f docker-compose.test.yml ps -q db",
                        returnStdout: true
                    ).trim()

                     sh "echo ${testAppDbContainerId}"


                    sh """
                        until docker exec ${testAppDbContainerId} pg_isready -h db -p 5432 -U root > /dev/null 2>&1; do
                            echo "Waiting for PostgreSQL to be ready..."
                            sleep 3
                        done
                    """


                    sh "docker cp . ${testAppContainerId}:/app"

                    sh "docker exec ${testAppContainerId} npx prisma db push"

                    sh "docker exec ${testAppContainerId} npm run test"

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

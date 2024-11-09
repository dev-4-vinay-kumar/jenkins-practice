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

        stage('Prepare Shared Volume') {
            steps {
                script {
                    sh "docker volume create ${SHARED_VOLUME}"
                }
                
                script {
                    sh """
                    docker run --rm \
                        -v ${env.WORKSPACE}:/workspace \
                        -v ${SHARED_VOLUME}:/data \
                        alpine sh -c 'cp -r /workspace/* /data/'
                    """
                }
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
                sh "docker-compose -f docker-compose.yml down --volumes --remove-orphans || true"
                
                sh "docker volume rm ${SHARED_VOLUME} || true"
            }
        }

    }
}

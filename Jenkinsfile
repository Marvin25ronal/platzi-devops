pipeline {
    agent any
    tools{
        nodejs 'nodejs'
    }
    options {
        timeout(time: 2, unit:'MINUTES')
    }
    environment {
        ARTIFACT_ID="marvin25/devops:${env.BUILD_NUMBER}"
    }
    stages{
        stage('Install dependencias'){
            steps{
                sh 'npm install'
            }
            steps{
                sh 'cd app && npm install'
            }
        }
    }
}

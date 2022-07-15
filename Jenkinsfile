pipeline {
    agent any
    tools{
        nodejs 'nodejs'
    }
    options {
        timeout(time: 5, unit:'MINUTES')
    }
    environment {
        ARTIFACT_ID="marvin25/devops:${env.BUILD_NUMBER}"
    }
    stages{
        stage('git repo & clean'){
            steps{
                sh "rm -rf platzi-devops"
                sh "git clone https://github.com/Marvin25ronal/platzi-devops.git"
            }
           
        }
        stage('Install dependencias'){
            steps{
                sh 'npm install'
                sh 'cd app && npm install'
            }
        }
        stage('Build'){
            steps{
                script{
                    dir('app'){
                        dockerImage=docker.build "${env.ARTIFACT_ID}"
                    }
                }
            }
        }
        // stage('Publish'){
        //     when{
        //         branch 'master'
        //     }
        // }

    }
}

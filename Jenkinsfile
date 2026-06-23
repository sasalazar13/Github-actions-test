pipeline {
    agent any

    stages {

        stage('Clonar Repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Instalar Dependencias') {
            steps {
                dir('api') {
                    sh 'npm install'
                }
            }
        }

        stage('Correr Pruebas') {
            steps {
                dir('api') {
                    sh 'npm test'
                }
            }
        }

        stage('Construir Imagenes Docker') {
            steps {
                sh 'docker compose build'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado: todas las pruebas pasaron.'
        }
        failure {
            echo 'Pipeline fallido: revisa los errores arriba.'
        }
    }
}

pipeline {
  agent {
    docker {
      image 'golang:alpine'
    }

  }
  stages {
    stage('build') {
      steps {
        echo 'Fetching dependencies'
        sh 'go get -u ./...'
        sh 'go build .'
        echo 'Building project'
      }
    }

  }
}
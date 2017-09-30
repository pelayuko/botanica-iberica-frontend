# botanica-iberica-frontend
Frontend for botanica iberica project

How to deploy in Openshift

oc new-app codecentric/springboot-maven3-centos~https://github.com/pelayuko/botanica-iberica-frontend.git

Add Maven environment variable
MVN_ARGS spring-boot:run
APP_TARGET app.war
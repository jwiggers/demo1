FROM openjdk:14-jdk-alpine
RUN addgroup -g 1000 -S bdnlwebdev && adduser -u 1000 -S bdnlwebdev -G bdnlwebdev
USER bdnlwebdev
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]

FROM maven:3-jdk-14 as builder
WORKDIR /app
COPY pom.xml .
COPY backend ./backend 
COPY frontend ./frontend 
RUN mvn clean package -DskipTests
FROM openjdk:14-jdk-alpine
RUN addgroup -g 1000 -S bdnlwebdev && adduser -u 1000 -S bdnlwebdev -G bdnlwebdev
USER bdnlwebdev
COPY --from=builder /app/backend/target/*.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
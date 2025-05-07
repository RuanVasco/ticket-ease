FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

COPY --from=builder /app/target/*.war TicketEaseAPI.war

ENTRYPOINT ["java", "-jar", "TicketEaseAPI.war"]

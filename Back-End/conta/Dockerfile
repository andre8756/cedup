# Fase de build - Use a tag 23-jdk-jammy
FROM maven:3.9-eclipse-temurin-23-jdk-jammy AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Fase de execução - Use a mesma variante JDK ou JRE
FROM eclipse-temurin:23-jdk-jammy

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
# Fase de build - Use uma imagem com Maven e Java 23
FROM maven:3.9-eclipse-temurin-23 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Build da aplicação
RUN mvn clean package -DskipTests

# Fase de execução - Use Java 23 slim
FROM eclipse-temurin:23-jre-jammy

WORKDIR /app

# Copie o JAR da fase de build
COPY --from=build /app/target/*.jar app.jar

# Exponha a porta
EXPOSE 8080

# Defina o entrypoint
ENTRYPOINT ["java", "-jar", "app.jar"]
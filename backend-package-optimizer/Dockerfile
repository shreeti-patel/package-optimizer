# Use Eclipse Temurin (recommended OpenJDK) as the base image
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml to download dependencies
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn/

# Give execute permission to the Maven wrapper
RUN chmod +x ./mvnw

# Download dependencies without building
RUN ./mvnw dependency:go-offline

# Copy the source code into the container
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port the app runs on (change if needed)
EXPOSE 10000

# Run the Spring Boot app
CMD ["java", "-jar", "target/backend-package-optimizer-0.0.1-SNAPSHOT.jar"]

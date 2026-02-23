# Set Java environment
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

# Display Java version
Write-Host "Java version:" -ForegroundColor Green
java -version

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Starting Spring Boot application..." -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

# Start Spring Boot with IPv6 support for Supabase direct connection
$env:MAVEN_OPTS = "-Djava.net.preferIPv6Addresses=true"
mvn spring-boot:run

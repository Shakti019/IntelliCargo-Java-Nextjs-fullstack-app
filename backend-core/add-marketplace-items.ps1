# ================================================
# Add Marketplace Items (Without Deleting Data)
# ================================================

$DB_HOST = "aws-0-ap-northeast-2.pooler.supabase.com"
$DB_PORT = "6543"
$DB_NAME = "postgres"
$DB_USER = "postgres.hpprnmdszveyxcpcporf"
$SQL_FILE = "add-marketplace-items.sql"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "IntelliCargo - Add Marketplace Items" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will ADD SELL requests to marketplace" -ForegroundColor Green
Write-Host "Your existing data will NOT be deleted!" -ForegroundColor Green
Write-Host ""
Write-Host "Database: $DB_HOST`:$DB_PORT/$DB_NAME" -ForegroundColor Yellow
Write-Host "SQL File: $PSScriptRoot\$SQL_FILE" -ForegroundColor Yellow
Write-Host ""

# Set PGPASSWORD from environment or prompt
if (-not $env:SUPABASE_DB_PASSWORD) {
    $env:SUPABASE_DB_PASSWORD = Read-Host "Enter database password" -AsSecureString | ConvertFrom-SecureString -AsPlainText
}

# Execute SQL file
Write-Host "Adding marketplace items..." -ForegroundColor Cyan

$sqlFilePath = Join-Path $PSScriptRoot $SQL_FILE

try {
    $result = & docker run --rm -i -e PGPASSWORD=$env:SUPABASE_DB_PASSWORD postgres:15 psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f - < $sqlFilePath 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully added marketplace items!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now:" -ForegroundColor Cyan
        Write-Host "1. Start backend: mvn spring-boot:run" -ForegroundColor White
        Write-Host "2. Login with a different company account" -ForegroundColor White
        Write-Host "3. Go to Trade Offers page to see items!" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Error loading data. See error above." -ForegroundColor Red
        Write-Host ""
        Write-Host "Error details:" -ForegroundColor Yellow
        Write-Host $result -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "❌ Failed to execute SQL." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Note: This requires PostgreSQL client or Docker." -ForegroundColor Yellow
    Write-Host "Alternative: Copy SQL from add-marketplace-items.sql" -ForegroundColor Yellow
    Write-Host "            and run it manually in Supabase SQL Editor" -ForegroundColor Yellow
    Write-Host ""
}

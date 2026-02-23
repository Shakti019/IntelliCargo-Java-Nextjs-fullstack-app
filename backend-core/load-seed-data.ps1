# ================================================
# IntelliCargo Seed Data Loader Script
# ================================================
# This script loads the seed data into the PostgreSQL database
# Usage: .\load-seed-data.ps1
# ================================================

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "IntelliCargo Seed Data Loader" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Database connection details from application.yml
$DB_HOST = "aws-1-ap-northeast-2.pooler.supabase.com"
$DB_PORT = "6543"
$DB_NAME = "postgres"
$DB_USER = "postgres.hpprnmdszveyxcpcporf"
$DB_PASS = "5Nsf9bAossqWixdv"

# Seed data file
$SEED_FILE = Join-Path $PSScriptRoot "src\main\resources\data-seed.sql"

# Check if seed file exists
if (-not (Test-Path $SEED_FILE)) {
    Write-Host "❌ Error: Seed data file not found at: $SEED_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "Database: ${DB_HOST}:${DB_PORT}/${DB_NAME}" -ForegroundColor Yellow
Write-Host "Seed File: $SEED_FILE" -ForegroundColor Yellow
Write-Host ""

# Warning
Write-Host "⚠️  WARNING: This will DELETE all existing data!" -ForegroundColor Red
Write-Host ""
$confirm = Read-Host "Do you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Aborted by user." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Loading seed data..." -ForegroundColor Cyan

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if ($null -eq $psqlPath) {
    Write-Host "❌ Error: PostgreSQL client (psql) not found in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL client tools or use alternative method." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Use pgAdmin or enable SQL init in application.yml" -ForegroundColor Cyan
    exit 1
}

# Set environment variable for password
$env:PGPASSWORD = $DB_PASS

# Execute SQL file
try {
    Write-Host "Connecting to database..." -ForegroundColor Cyan
    
    # Use psql to execute the seed file
    & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SEED_FILE
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Green
        Write-Host "✅ Seed data loaded successfully!" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Test Login Credentials:" -ForegroundColor Cyan
        Write-Host "------------------------------------------------" -ForegroundColor Cyan
        Write-Host "Buyer:  buyer@globalelectronics.com / password123" -ForegroundColor White
        Write-Host "Seller: seller@lpu.edu / password123" -ForegroundColor White
        Write-Host "Buyer2: procurement@techimports.com / password123" -ForegroundColor White
        Write-Host "------------------------------------------------" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Yellow
        Write-Host "1. Start backend: .\start-backend.ps1" -ForegroundColor White
        Write-Host "2. Start frontend: cd ..\frontend; npm run dev" -ForegroundColor White
        Write-Host "3. Login and test the workflow!" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Error loading seed data. Exit code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Check the error messages above for details." -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error: $_" -ForegroundColor Red
} finally {
    # Clear password from environment
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "For more information, see SEED-DATA-GUIDE.md" -ForegroundColor Cyan
Write-Host ""

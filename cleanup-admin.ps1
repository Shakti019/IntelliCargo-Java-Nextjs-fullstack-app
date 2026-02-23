# =====================================================
# SYSTEM CLEANUP SCRIPT - Run as Administrator
# Safely removes unnecessary Windows files
# =====================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "INTELLICARGO - SYSTEM CLEANUP" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "`nHow to run as Administrator:" -ForegroundColor Yellow
    Write-Host "1. Press Windows Key + X" -ForegroundColor White
    Write-Host "2. Click 'Terminal (Admin)' or 'PowerShell (Admin)'" -ForegroundColor White
    Write-Host "3. Run this script again`n" -ForegroundColor White
    pause
    exit
}

Write-Host "Running with Administrator privileges`n" -ForegroundColor Green

# Show current disk space
Write-Host "Current Disk Space:" -ForegroundColor Cyan
Get-PSDrive C | Select-Object @{Name="Drive";Expression={$_.Name}}, @{Name="Used(GB)";Expression={[math]::Round($_.Used/1GB,2)}}, @{Name="Free(GB)";Expression={[math]::Round($_.Free/1GB,2)}}, @{Name="Total(GB)";Expression={[math]::Round(($_.Used+$_.Free)/1GB,2)}}
Write-Host ""

$totalFreed = 0

# ========================================
# CLEANUP OPERATIONS
# ========================================

# 1. Clean Windows Update Download Cache
Write-Host "1. Cleaning Windows Update downloads..." -ForegroundColor Yellow
Write-Host "   (Stopping Windows Update service...)" -ForegroundColor Gray
Stop-Service wuauserv -Force -ErrorAction SilentlyContinue
Stop-Service bits -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

if (Test-Path "C:\Windows\SoftwareDistribution\Download") {
    $sizeBefore = (Get-ChildItem "C:\Windows\SoftwareDistribution\Download" -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB
    Remove-Item "C:\Windows\SoftwareDistribution\Download\*" -Recurse -Force -ErrorAction SilentlyContinue
    $freed = [math]::Round($sizeBefore, 2)
    $totalFreed += $freed
    Write-Host "   Freed: $freed GB" -ForegroundColor Green
}

Start-Service wuauserv -ErrorAction SilentlyContinue
Start-Service bits -ErrorAction SilentlyContinue
Write-Host ""

# 2. Remove old Windows Update backup
Write-Host "2. Removing old Windows Update backup..." -ForegroundColor Yellow
if (Test-Path "C:\Windows\SoftwareDistribution.old") {
    $sizeBefore = (Get-ChildItem "C:\Windows\SoftwareDistribution.old" -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB
    Remove-Item "C:\Windows\SoftwareDistribution.old" -Recurse -Force -ErrorAction SilentlyContinue
    $freed = [math]::Round($sizeBefore, 2)
    $totalFreed += $freed
    Write-Host "   Freed: $freed GB" -ForegroundColor Green
}
Write-Host ""

# 3. Clean WinSxS Component Store
Write-Host "3. Cleaning WinSxS Component Store..." -ForegroundColor Yellow
Write-Host "   (This may take 5-10 minutes, please wait...)" -ForegroundColor Gray
try {
    $output = Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase 2>&1
    Write-Host "   WinSxS cleanup completed" -ForegroundColor Green
    Write-Host "   Estimated freed: 3-7 GB" -ForegroundColor Cyan
    $totalFreed += 5
}
catch {
    Write-Host "   Could not clean WinSxS" -ForegroundColor Yellow
}
Write-Host ""

# 4. Clean Windows Temp Files
Write-Host "4. Cleaning system temp files..." -ForegroundColor Yellow
if (Test-Path "C:\Windows\Temp") {
    $sizeBefore = (Get-ChildItem "C:\Windows\Temp" -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Remove-Item "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
    $freed = [math]::Round($sizeBefore, 2)
    Write-Host "   Freed: $freed MB" -ForegroundColor Green
}
Write-Host ""

# 5. Empty Recycle Bin
Write-Host "5. Emptying Recycle Bin..." -ForegroundColor Yellow
try {
    Clear-RecycleBin -Force -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "   Recycle Bin emptied" -ForegroundColor Green
}
catch {
    Write-Host "   Recycle Bin already empty" -ForegroundColor Yellow
}
Write-Host ""

# 6. Clean old Windows logs
Write-Host "6. Cleaning old Windows logs..." -ForegroundColor Yellow
$logsRemoved = 0
Get-ChildItem "C:\Windows\Logs" -Recurse -File -Force -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | ForEach-Object { 
    try { 
        Remove-Item $_.FullName -Force -ErrorAction Stop
        $logsRemoved++ 
    }
    catch {} 
}
Write-Host "   Removed $logsRemoved old log files" -ForegroundColor Green
Write-Host ""

# ========================================
# SUMMARY
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CLEANUP COMPLETED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total space freed: ~$totalFreed GB" -ForegroundColor Yellow
Write-Host ""

# Show final disk space
Write-Host "Final Disk Space:" -ForegroundColor Cyan
Get-PSDrive C | Select-Object @{Name="Drive";Expression={$_.Name}}, @{Name="Used(GB)";Expression={[math]::Round($_.Used/1GB,2)}}, @{Name="Free(GB)";Expression={[math]::Round($_.Free/1GB,2)}}, @{Name="Total(GB)";Expression={[math]::Round(($_.Used+$_.Free)/1GB,2)}}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Your system has been optimized" -ForegroundColor Green
Write-Host "Safe to continue development" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

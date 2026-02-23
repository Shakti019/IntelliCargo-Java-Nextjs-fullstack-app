# Fix all recordTest calls to include requestData parameter
$filePath = "run-complete-tests.js"
$content = Get-Content $filePath -Raw

# Replace recordTest calls that don't have requestData parameter
# Pattern: recordTest(..., response); -> recordTest(..., response, null, false);
# Pattern: recordTest(..., error); -> recordTest(..., error, false);

# For PASS cases without requestData
$content = $content -replace "recordTest\(([^,]+),\s*'(GET|DELETE)',\s*'PASS',\s*response\);", "recordTest(`$1, '`$2', 'PASS', response, null, false);"
$content = $content -replace "recordTest\(([^,]+),\s*'(GET|DELETE)',\s*'FAIL',\s*null,\s*error\);", "recordTest(`$1, '`$2', 'FAIL', null, error, false);"

# For FAIL cases
$content = $content -replace "recordTest\(([^,]+),\s*'([^']+)',\s*'FAIL',\s*null,\s*error\);", "recordTest(`$1, '`$2', 'FAIL', null, error, false);"

# For SKIP cases
$content = $content -replace "recordTest\(([^,]+),\s*'([^']+)',\s*'SKIP',\s*null,\s*null,\s*true\);", "recordTest(`$1, '`$2', 'SKIP', null, null, true, null);"

$content | Set-Content $filePath -NoNewline

Write-Host "✅ Updated all recordTest calls in $filePath"

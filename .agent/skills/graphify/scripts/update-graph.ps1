# Update Graphify Knowledge Graph for Aanur Textile
[CmdletBinding()]
param()

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
Set-Location $ProjectRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Updating Aanur Textile Code Graph...  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Run Graphify update
Write-Host "`n[1/2] Running AST Re-extraction..." -ForegroundColor Yellow
graphify update .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to update graphify knowledge graph."
    exit $LASTEXITCODE
}

# 2. Run Graphify tree
Write-Host "`n[2/2] Generating D3 Hierarchical Tree..." -ForegroundColor Yellow
graphify tree

Write-Host "`n✅ Graph updated successfully in graphify-out/" -ForegroundColor Green
Write-Host "  - graphify-out/graph.json" -ForegroundColor Gray
Write-Host "  - graphify-out/graph.html" -ForegroundColor Gray
Write-Host "  - graphify-out/GRAPH_TREE.html" -ForegroundColor Gray
Write-Host "  - graphify-out/GRAPH_REPORT.md" -ForegroundColor Gray

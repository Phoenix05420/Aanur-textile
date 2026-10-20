# Open Graphify Visualizations in Default Browser
[CmdletBinding()]
param(
    [ValidateSet("graph", "tree", "both")]
    [string]$View = "graph"
)

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$GraphHtml = Join-Path $ProjectRoot "graphify-out\graph.html"
$TreeHtml = Join-Path $ProjectRoot "graphify-out\GRAPH_TREE.html"

if (-not (Test-Path $GraphHtml)) {
    Write-Warning "graphify-out/graph.html not found. Running update first..."
    & (Join-Path $PSScriptRoot "update-graph.ps1")
}

if ($View -eq "graph" -or $View -eq "both") {
    if (Test-Path $GraphHtml) {
        Write-Host "Opening 2D Interactive Knowledge Graph: $GraphHtml" -ForegroundColor Green
        Start-Process $GraphHtml
    }
}

if ($View -eq "tree" -or $View -eq "both") {
    if (Test-Path $TreeHtml) {
        Write-Host "Opening Collapsible D3 Hierarchy Tree: $TreeHtml" -ForegroundColor Green
        Start-Process $TreeHtml
    }
}

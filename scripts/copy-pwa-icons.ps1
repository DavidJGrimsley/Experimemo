param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot ".."))
)

$nodeScript = Join-Path $PSScriptRoot "copy-pwa-icons.mjs"
node $nodeScript $ProjectRoot
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

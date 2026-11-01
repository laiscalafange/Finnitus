param(
    [string]$ProjectRoot = "."
)
$ErrorActionPreference = "Stop"
$root = (Resolve-Path -LiteralPath $ProjectRoot).Path
$pkg = Split-Path -Parent $MyInvocation.MyCommand.Path
$rows = Import-Csv -LiteralPath (Join-Path $pkg "MANIFESTO_SHA256.csv")
$missing = 0; $different = 0; $identical = 0
Write-Host "Projeto: $root"
Write-Host "Pacote: $pkg"
foreach ($row in $rows) {
    $relative = $row.caminho.Replace('/', [IO.Path]::DirectorySeparatorChar)
    $dest = Join-Path $root $relative
    if (-not (Test-Path -LiteralPath $dest -PathType Leaf)) {
        $missing++
        Write-Host "FALTA     $($row.caminho)" -ForegroundColor Yellow
        continue
    }
    $hash = (Get-FileHash -LiteralPath $dest -Algorithm SHA256).Hash
    if ($hash -ieq $row.sha256) {
        $identical++
    } else {
        $different++
        Write-Host "DIFERENTE $($row.caminho)" -ForegroundColor Cyan
    }
}
Write-Host "---"
Write-Host "Iguais: $identical | Diferentes: $different | Ausentes: $missing"
Write-Host "Nenhum arquivo foi modificado. Arquivos diferentes precisam de comparacao antes da substituicao."

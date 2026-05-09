$tunnels = Get-ChildItem C:\Users\OWNER\.cloudflared\*.json | Where-Object Name -Match '^[a-f0-9-]+\.json$' | Select-Object -ExpandProperty BaseName
foreach ($t in $tunnels) {
    Write-Host "Testing tunnel: $t"
    Stop-Process -Name cloudflared -Force -ErrorAction SilentlyContinue
    Start-Sleep -s 1
    Start-Process -NoNewWindow -FilePath "cloudflared" -ArgumentList "tunnel --config d:\blockchain\cloudflared-config.yaml --protocol http2 run $t"
    Start-Sleep -s 10
    $res = node d:\blockchain\test-rpc.js
    Write-Host "Result: $res"
    if ($res -match "0x") {
        Write-Host "FOUND WORKING TUNNEL: $t"
        break
    }
}

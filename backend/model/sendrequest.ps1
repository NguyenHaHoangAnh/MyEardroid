$uri = "http://localhost:5000/predict"
$filePath = ".\sound_401.wav"
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "rn"
$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"sound_401.wav`"",
    "Content-Type: application/octet-stream$LF",
    [System.IO.File]::ReadAllBytes($filePath),
    "--$boundary--$LF"
) -join $LF
Invoke-RestMethod -Uri $uri -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines
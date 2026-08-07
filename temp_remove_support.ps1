$ErrorActionPreference = 'Stop'
$roots = @('matrices','transformations','trigonometry','statistics','probability')
$patterns = @(
  [regex]'(?s)<section class="lesson-section standard-think"><h2>🧠 Let&#8217;s Think Together</h2>.*?</p></section>',
  [regex]'(?s)<section class="lesson-section"><h2>Thinking Check</h2>.*?</section>',
  [regex]'(?s)<section class="lesson-section standard-think"><h2>Thinking Check</h2>.*?</section>'
)
$changed = New-Object System.Collections.Generic.List[string]
foreach ($root in $roots) {
  foreach ($path in Get-ChildItem -Path $root -Recurse -Filter '*.html') {
    $text = Get-Content -Path $path.FullName -Raw -Encoding utf8
    $newText = $text
    foreach ($pattern in $patterns) {
      $newText = $pattern.Replace($newText, '')
    }
    if ($newText -ne $text) {
      Set-Content -Path $path.FullName -Value $newText -Encoding utf8
      $changed.Add($path.FullName)
    }
  }
}
$changed | ForEach-Object { $_ }

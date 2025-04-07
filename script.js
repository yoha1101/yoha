function handleFiles() {
  const input = document.getElementById('fileInput');
  const files = input.files;
  if (!files.length) {
    alert('파일을 선택하세요.');
    return;
  }

  const file = files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const content = e.target.result;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>파일 읽기 완료!</p><pre>' + content.substring(0, 500) + '...</pre>';
    
    createDownloadButton(content);
  };

  if (file.name.endsWith('.csv')) {
    reader.readAsText(file);
  } else if (file.name.endsWith('.xlsx')) {
    resultDiv.innerHTML = '<p>xlsx 파일 읽기는 다음 버전에서 지원됩니다.</p>';
  } else {
    alert('CSV 파일만 지원합니다.');
  }
}

function createDownloadButton(content) {
  const resultDiv = document.getElementById('result');
  const downloadBtn = document.createElement('button');
  downloadBtn.innerText = "결과 다운로드 (CSV)";
  downloadBtn.onclick = function() {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yoha_result.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  resultDiv.appendChild(document.createElement('br'));
  resultDiv.appendChild(downloadBtn);
}

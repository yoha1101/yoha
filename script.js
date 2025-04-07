function handleFiles() {
  const input = document.getElementById('fileInput');
  const files = input.files;
  if (!files.length) {
    alert('파일을 선택하세요.');
    return;
  }

  let resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<p>파일이 업로드되었습니다. (여기에 파일 읽고 분배하는 로직이 연결될 예정입니다.)</p>';

  // (여기에 파일 읽기, 매칭, 분배 로직 추가 가능)
}

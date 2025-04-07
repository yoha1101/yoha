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
    const lines = content.split("\\n").filter(line => line.trim() !== "");

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "<p>파일 읽기 완료! 이제 다운로드 파일을 선택하세요.</p>";

    createDownloadButtons(lines);
  };

  if (file.name.endsWith('.csv')) {
    reader.readAsText(file);
  } else {
    alert('CSV 파일만 지원합니다.');
  }
}

function createDownloadButtons(lines) {
  const resultDiv = document.getElementById('result');

  const platforms = ["Shopify", "Lavender Vera", "Musinsa"];
  platforms.forEach(platform => {
    const btn = document.createElement("button");
    btn.innerText = platform + " 다운로드";
    btn.style.margin = "10px";
    btn.onclick = function() {
      downloadFile(platform, lines);
    };
    resultDiv.appendChild(btn);
  });
}

function downloadFile(platform, lines) {
  let headers = "";
  let processedData = [];

  if (platform === "Shopify") {
    headers = "Handle,Title,Option1 Name,Option1 Value,Option2 Name,Option2 Value,SKU,HS Code,COO,On hand,Published";
    processedData = lines.map(line => line + ",10");  // 가상의 재고수 10개 입력
  } else if (platform === "Lavender Vera") {
    headers = "상품명,품목병,규격,재고수량";
    processedData = lines.map(line => line + ",10");
  } else if (platform === "Musinsa") {
    headers = "스타일 넘버,상품명,옵션,판매가능 재고";
    processedData = lines.map(line => line + ",10");
  }

  const csvContent = headers + "\\n" + processedData.join("\\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = platform + "_YOHA_재고분배.csv";
  a.click();
  URL.revokeObjectURL(url);
}

<script src="https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js"></script>
<script>
function handleFiles() {
  const input = document.getElementById('fileInput');
  const file = input.files[0];
  if (!file) {
    alert('파일을 선택하세요.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);

    const products = lines.map(line => {
      const [code, name, size, qty] = line.split(',');
      return { code, name, size, qty: parseInt(qty) };
    });

    const divided = divideQuantities(products);
    createDownloadButtons(divided);
  };

  reader.readAsText(file);
}

function divideQuantities(products) {
  const divided = { shopify: [], lavender: [], musinsa: [] };
  products.forEach(p => {
    let qty = p.qty;
    let shopify = 0, lavender = 0, musinsa = 0;
    if (qty <= 3) {
      shopify = qty;
    } else if (qty === 4) {
      shopify = 3; lavender = 1;
    } else if (qty === 5) {
      shopify = 3; lavender = 1; musinsa = 1;
    } else {
      shopify = 3; lavender = 2; musinsa = 1; qty -= 6; shopify += qty;
    }
    divided.shopify.push({ ...p, qty: shopify });
    divided.lavender.push({ ...p, qty: lavender });
    divided.musinsa.push({ ...p, qty: musinsa });
  });
  return divided;
}

function createDownloadButtons(divided) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "";

  createButton('Shopify 다운로드', divided.shopify, 'shopify.xlsx', formatShopify, resultDiv);
  createButton('Lavender Vera 다운로드', divided.lavender, 'lavender.xlsx', formatLavender, resultDiv);
  createButton('Musinsa 다운로드', divided.musinsa, 'musinsa.xlsx', formatMusinsa, resultDiv);
}

function createButton(label, data, filename, formatFunc, parent) {
  const btn = document.createElement('button');
  btn.innerText = label;
  btn.style.margin = '10px';
  btn.onclick = function () {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formatFunc(data));
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  };
  parent.appendChild(btn);
}

function formatShopify(data) {
  return data.map(p => ({
    Handle: p.code,
    Title: p.name,
    "Option1 Name": "Color",
    "Option1 Value": p.size,
    "Option2 Name": "Size",
    "Option2 Value": p.size,
    SKU: p.code,
    "HS Code": "",
    COO: "",
    "On hand": p.qty,
    Published: "TRUE"
  }));
}

function formatLavender(data) {
  return data.map(p => ({
    상품명: p.name,
    품목병: p.code,
    규격: p.size,
    재고수량: p.qty
  }));
}

function formatMusinsa(data) {
  return data.map(p => ({
    "스타일 넘버": p.code,
    상품명: p.name,
    옵션: p.size,
    "판매가능 재고": p.qty
  }));
}
</script>

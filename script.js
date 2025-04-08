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
  const divided = {
    shopify: [],
    lavender: [],
    musinsa: []
  };

  products.forEach(p => {
    let qty = p.qty;
    let shopify = 0, lavender = 0, musinsa = 0;

    if (qty <= 3) {
      shopify = qty;
    } else if (qty === 4) {
      shopify = 3;
      lavender = 1;
    } else if (qty === 5) {
      shopify = 3;
      lavender = 1;
      musinsa = 1;
    } else {
      shopify = 3;
      lavender = 2;
      musinsa = 1;
      qty -= 6;
      shopify += qty;
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

  createButton('Shopify 다운로드', formatShopify(divided.shopify), 'shopify.csv', resultDiv);
  createButton('Lavender Vera 다운로드', formatLavender(divided.lavender), 'lavender.csv', resultDiv);
  createButton('Musinsa 다운로드', formatMusinsa(divided.musinsa), 'musinsa.csv', resultDiv);
}

function createButton(label, content, filename, parent) {
  const btn = document.createElement('button');
  btn.innerText = label;
  btn.style.margin = '10px';
  btn.onclick = function () {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  parent.appendChild(btn);
}

function formatShopify(data) {
  const header = "Handle,Title,Option1 Name,Option1 Value,Option2 Name,Option2 Value,SKU,HS Code,COO,On hand,Published";
  return header + "\n" + data.map(p => {
    return [
      p.code, p.name, "Color", p.size, "Size", p.size, p.code, "", "", p.qty, "TRUE"
    ].join(',');
  }).join('\n');
}

function formatLavender(data) {
  const header = "상품명,품목병,규격,재고수량";
  return header + "\n" + data.map(p => {
    return [p.name, p.code, p.size, p.qty].join(',');
  }).join('\n');
}

function formatMusinsa(data) {
  const header = "스타일 넘버,상품명,옵션,판매가능 재고";
  return header + "\n" + data.map(p => {
    return [p.code, p.name, p.size, p.qty].join(',');
  }).join('\n');
}

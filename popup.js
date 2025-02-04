document.addEventListener("DOMContentLoaded", async function() {
    const url = "https://giavang.pnj.com.vn/";

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
            }
        });
        const text = await response.text();

        // Chuyển đổi HTML thành DOM để xử lý
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        // Tìm bảng giá vàng
        const table = doc.querySelector("table");
        const rows = table.querySelectorAll("tr");

        let tableBody = document.querySelector("#goldTable tbody");
        tableBody.innerHTML = "";

        let regionFilter = document.getElementById("regionFilter");
        let goldTypeFilter = document.getElementById("goldTypeFilter");

        let regions = new Set();
        let goldTypes = new Set();

        let data = [];

        let currentRegion = "";
        rows.forEach((row, index) => {
            if (index === 0) return; // Bỏ qua tiêu đề

            let cells = row.querySelectorAll("td");
            if (cells.length === 5) {
                currentRegion = cells[0].innerText.trim();
                let goldType = cells[1].innerText.trim();
                let buyPrice = cells[2].innerText.trim();
                let sellPrice = cells[3].innerText.trim();
                let updatedTime = cells[4].innerText.trim();

                data.push({ region: currentRegion, goldType, buyPrice, sellPrice, updatedTime });

                regions.add(currentRegion);
                goldTypes.add(goldType);
            } else {
                let goldType = cells[0].innerText.trim();
                let buyPrice = cells[1].innerText.trim();
                let sellPrice = cells[2].innerText.trim();
                let updatedTime = cells[3].innerText.trim();

                data.push({ region: currentRegion, goldType, buyPrice, sellPrice, updatedTime });

                goldTypes.add(goldType);
            }
        });

        // Cập nhật danh sách filter
        updateFilterOptions(regionFilter, regions);
        updateFilterOptions(goldTypeFilter, goldTypes);

        // Hiển thị dữ liệu lần đầu tiên
        displayData(data);

        // Thêm sự kiện lọc
        regionFilter.addEventListener("change", () => displayData(data));
        goldTypeFilter.addEventListener("change", () => displayData(data));

    } catch (error) {
        console.error("Lỗi khi lấy giá vàng:", error);
    }
});

// Hàm cập nhật bộ lọc
function updateFilterOptions(filterElement, items) {
    items.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        filterElement.appendChild(option);
    });
}

// Hàm hiển thị dữ liệu với bộ lọc
function displayData(data) {
    let tableBody = document.querySelector("#goldTable tbody");
    tableBody.innerHTML = "";

    let selectedRegion = document.getElementById("regionFilter").value;
    let selectedGoldType = document.getElementById("goldTypeFilter").value;

    let filteredData = data.filter(item => 
        (selectedRegion === "all" || item.region === selectedRegion) &&
        (selectedGoldType === "all" || item.goldType === selectedGoldType)
    );

    filteredData.forEach(item => {
        let newRow = `<tr>
            <td>${item.region}</td>
            <td>${item.goldType}</td>
            <td>${item.buyPrice}</td>
            <td>${item.sellPrice}</td>
            <td>${item.updatedTime}</td>
        </tr>`;
        tableBody.innerHTML += newRow;
    });
}

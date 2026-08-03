import requests
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urljoin

BASE_URL = "http://192.168.1.50"

session = requests.Session()

html = session.get(
    BASE_URL + "/Accounting/GoldProduct/Search/Print2/?filtertitleT=&DecimalNumberWeightt=4"
).text

soup = BeautifulSoup(html, "html.parser")

table = soup.find("table")

data = []

for tr in table.find("tbody").find_all("tr"):

    tds = tr.find_all("td")

    product_name = tds[9].get_text(strip=True)

    image_link = None

    img = tds[1].find("img")
    if img:
        image_link = urljoin(BASE_URL, img.get("src"))

    data.append({
        "نام محصول": product_name,
        "تصویر": image_link
    })

df = pd.DataFrame(data)
df.to_excel("products.xlsx", index=False)

print(df)
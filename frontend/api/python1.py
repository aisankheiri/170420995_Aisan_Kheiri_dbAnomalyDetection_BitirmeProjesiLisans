import base64

encoded_data = "Li9wZGZzL3JlcG9ydF9haXNhbmtoZWlyaS5wZGY="  # Verilen Base64 kodu

# Base64 kodunu çözümleme
decoded_data = base64.b64decode(encoded_data)

# PDF dosyasına yazma
with open("converted_pdf.pdf", "wb") as pdf_file:
    pdf_file.write(decoded_data)

print("PDF dosyası başarıyla dönüştürüldü.")